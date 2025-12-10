"use client";

import { useCallback, useEffect, useState } from "react";

const TEXT =
  "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet at least once. Typing exercises help us master keyboard layouts and improve our communication skills.";

export default function TypingTest() {
  const [typedChars, setTypedChars] = useState<
    Array<{ char: string; correct: boolean }>
  >([]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore modifier keys
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      // Handle backspace - go back one position
      if (e.key === "Backspace") {
        setTypedChars((prev) => prev.slice(0, -1));
        return;
      }

      // Don't allow typing past the end
      if (typedChars.length >= TEXT.length) return;

      // Only process printable characters
      if (e.key.length !== 1) return;

      const expectedChar = TEXT[typedChars.length];
      const isCorrect = e.key === expectedChar;

      setTypedChars((prev) => [...prev, { char: e.key, correct: isCorrect }]);
    },
    [typedChars.length],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const isComplete = typedChars.length >= TEXT.length;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-3xl">
        {isComplete ? (
          <div className="text-center">
            <p className="mb-4 text-2xl font-bold sm:text-4xl">Complete!</p>
            <button
              onClick={() => window.location.reload()}
              className="text-muted-foreground hover:text-foreground text-2xl transition-colors">
              Try again
            </button>
          </div>
        ) : (
          <p className="text-2xl leading-relaxed font-medium tracking-wide sm:text-4xl">
            {TEXT.split("").map((char, index) => {
              let colorClass = "text-muted-foreground/50";

              if (index < typedChars.length) {
                const typed = typedChars[index];
                if (typed.correct) {
                  colorClass = "text-foreground";
                } else {
                  colorClass = "text-red-500";
                }
              }

              // Show cursor at current position
              const showCursor = index === typedChars.length;

              return (
                <span key={index} className="relative">
                  {showCursor && (
                    <span className="animate-blink absolute top-0 -left-px h-full w-1 bg-orange-500" />
                  )}
                  <span className={colorClass}>{char}</span>
                </span>
              );
            })}
          </p>
        )}
      </div>
    </div>
  );
}
