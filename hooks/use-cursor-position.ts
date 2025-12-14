"use client";

import { useEffect, useRef, useState } from "react";

interface CursorPosition {
  left: number;
  top: number;
}

export function useCursorPosition(currentIndex: number) {
  const [cursorPos, setCursorPos] = useState<CursorPosition>({
    left: 0,
    top: 0,
  });
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const updateCursorPos = () => {
      const charEl = charRefs.current[currentIndex];
      const container = containerRef.current;
      if (charEl && container) {
        const containerRect = container.getBoundingClientRect();
        const charRect = charEl.getBoundingClientRect();
        setCursorPos({
          left: charRect.left - containerRect.left,
          top: charRect.top - containerRect.top,
        });
      }
    };

    updateCursorPos();
    window.addEventListener("resize", updateCursorPos);
    return () => window.removeEventListener("resize", updateCursorPos);
  }, [currentIndex]);

  const setCharRef = (index: number) => (el: HTMLSpanElement | null) => {
    charRefs.current[index] = el;
  };

  return {
    cursorPos,
    containerRef,
    setCharRef,
  };
}
