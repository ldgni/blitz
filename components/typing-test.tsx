"use client";

import { useEffect, useRef, useState } from "react";

const TEXT =
  "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet at least once. Typing exercises help us master keyboard layouts and improve our communication skills.";

const DURATION = 30;

export default function TypingTest() {
  const [typed, setTyped] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [errors, setErrors] = useState(0);
  const startTimeRef = useRef<number>(0);

  const isComplete = typed.length >= TEXT.length;
  const isGameOver = timeLeft === 0 || isComplete;
  const accuracy =
    totalKeystrokes > 0
      ? Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100)
      : 100;

  // Timer countdown
  useEffect(() => {
    if (!isRunning || isGameOver) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isGameOver]);

  // WPM update
  useEffect(() => {
    if (!isRunning || isGameOver) return;

    const interval = setInterval(() => {
      const minutes = (Date.now() - startTimeRef.current) / 60000;
      const correctChars = typed.filter(Boolean).length;
      setWpm(minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0);
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, isGameOver, typed]);

  // Keyboard input
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (isGameOver) return;

      if (e.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        if (!isRunning) {
          setIsRunning(true);
          startTimeRef.current = Date.now();
        }

        setTotalKeystrokes((prev) => prev + 1);

        setTyped((prev) => {
          if (prev.length >= TEXT.length) return prev;
          const isCorrect = e.key === TEXT[prev.length];
          if (!isCorrect) setErrors((err) => err + 1);
          return [...prev, isCorrect];
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isRunning, isGameOver]);

  const restart = () => {
    setTyped([]);
    setTimeLeft(DURATION);
    setTotalKeystrokes(0);
    setErrors(0);
    setIsRunning(false);
    setWpm(0);
    startTimeRef.current = 0;
  };

  return (
    <div className="space-y-4 text-xl sm:text-2xl">
      <p className="leading-relaxed font-medium tracking-wide">
        {TEXT.split("").map((char, i) => (
          <span key={i} className="relative">
            {i === typed.length && !isGameOver && (
              <span className="animate-blink absolute top-0 -left-px h-full w-1 bg-orange-500" />
            )}
            <span
              className={
                i < typed.length
                  ? typed[i]
                    ? "text-foreground"
                    : "text-destructive"
                  : "text-muted-foreground/50"
              }>
              {char}
            </span>
          </span>
        ))}
      </p>
      <div className="flex w-full justify-center gap-4 sm:justify-end">
        <span className="text-muted-foreground tabular-nums">{timeLeft}s</span>
        <span className="text-muted-foreground tabular-nums">{accuracy}%</span>
        <span className="text-muted-foreground tabular-nums">{wpm} WPM</span>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            restart();
          }}
          className="text-muted-foreground hover:text-foreground transition-colors">
          Restart
        </button>
      </div>
    </div>
  );
}
