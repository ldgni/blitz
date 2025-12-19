"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTypingGameOptions {
  text: string;
  duration: number;
  onKeyDown?: (key: string) => void;
  onKeyUp?: (key: string) => void;
}

export function useTypingGame({
  text,
  duration,
  onKeyDown,
  onKeyUp,
}: UseTypingGameOptions) {
  const [typed, setTyped] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [errors, setErrors] = useState(0);
  const startTimeRef = useRef<number>(0);

  const isComplete = typed.length >= text.length;
  const isGameOver = timeLeft === 0 || isComplete;
  const accuracy =
    totalKeystrokes > 0
      ? Math.max(
          0,
          Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100),
        )
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (isGameOver) return;

      if (e.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1));
        onKeyDown?.(e.key);
      } else if (e.key.length === 1) {
        if (!isRunning) {
          setIsRunning(true);
          startTimeRef.current = Date.now();
        }

        const currentIndex = typed.length;
        if (currentIndex >= text.length) return;

        onKeyDown?.(e.key);
        const isCorrect = e.key === text[currentIndex];
        setTotalKeystrokes((prev) => prev + 1);
        if (!isCorrect) setErrors((prev) => prev + 1);
        setTyped((prev) => [...prev, isCorrect]);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (isGameOver) return;
      onKeyUp?.(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isRunning, isGameOver, typed.length, text, onKeyDown, onKeyUp]);

  const restart = useCallback(() => {
    setTyped([]);
    setTimeLeft(duration);
    setTotalKeystrokes(0);
    setErrors(0);
    setIsRunning(false);
    setWpm(0);
  }, [duration]);

  return {
    typed,
    timeLeft,
    isRunning,
    isGameOver,
    wpm,
    accuracy,
    restart,
  };
}
