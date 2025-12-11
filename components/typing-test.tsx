"use client";

import { useEffect, useState } from "react";

const TEXT =
  "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet at least once. Typing exercises help us master keyboard layouts and improve our communication skills.";

export default function TypingTest() {
  const [typed, setTyped] = useState<Array<{ char: string; correct: boolean }>>(
    [],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        // Only handle printable characters (length === 1)
        setTyped((prev) =>
          prev.length < TEXT.length
            ? [...prev, { char: e.key, correct: e.key === TEXT[prev.length] }]
            : prev,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 p-4 text-2xl">
      <p className="leading-relaxed font-medium tracking-wide">
        {TEXT.split("").map((char, i) => (
          <span key={i} className="relative">
            {i === typed.length && (
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
      <div className="ml-auto">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            setTyped([]);
          }}
          className="text-muted-foreground hover:text-foreground transition-colors">
          Restart
        </button>
      </div>
    </div>
  );
}
