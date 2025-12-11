"use client";

import { useEffect, useRef, useState } from "react";

const TEXT =
  "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet at least once. Typing exercises help us master keyboard layouts and improve our communication skills.";

const DURATION = 30;

export default function TypingTest() {
  const [typed, setTyped] = useState<Array<{ char: string; correct: boolean }>>(
    [],
  );
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [errors, setErrors] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wpmRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const isComplete = typed.length >= TEXT.length;
  const isGameOver = timeLeft === 0 || isComplete;
  const accuracy =
    totalKeystrokes > 0
      ? Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100)
      : 100;

  // Timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0 && !isComplete) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isComplete, timeLeft]);

  // WPM calculation every 100ms
  useEffect(() => {
    if (isRunning && !isGameOver) {
      wpmRef.current = setInterval(() => {
        if (!startTimeRef.current) return;
        const minutes = (Date.now() - startTimeRef.current) / 60000;
        const correctChars = typed.filter((t) => t.correct).length;
        setWpm(minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0);
      }, 100);
    }
    return () => {
      if (wpmRef.current) clearInterval(wpmRef.current);
    };
  }, [isRunning, isGameOver, typed]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      // Block input when game is over
      if (isGameOver) return;

      if (e.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        // Start timer on first character
        if (!isRunning) {
          setIsRunning(true);
          startTimeRef.current = Date.now();
        }
        // Track raw accuracy
        setTotalKeystrokes((prev) => prev + 1);
        const isCorrect = e.key === TEXT[typed.length];
        if (!isCorrect) setErrors((prev) => prev + 1);
        // Only handle printable characters (length === 1)
        setTyped((prev) =>
          prev.length < TEXT.length
            ? [...prev, { char: e.key, correct: isCorrect }]
            : prev,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isRunning, isGameOver, typed.length]);

  const restart = () => {
    setTyped([]);
    setTimeLeft(DURATION);
    setTotalKeystrokes(0);
    setErrors(0);
    setIsRunning(false);
    setWpm(0);
    startTimeRef.current = null;
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 p-4 text-2xl">
      <p className="leading-relaxed font-medium tracking-wide">
        {TEXT.split("").map((char, i) => (
          <span key={i} className="relative">
            {i === typed.length && !isGameOver && (
              <span className="animate-blink absolute top-0 -left-px h-full w-1 bg-orange-500" />
            )}
            <span
              className={
                i < typed.length
                  ? typed[i].correct
                    ? "text-foreground"
                    : "text-red-500"
                  : "text-muted-foreground/50"
              }>
              {char}
            </span>
          </span>
        ))}
      </p>
      <div className="flex w-full justify-end gap-4">
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
