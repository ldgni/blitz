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
      const container = containerRef.current;
      if (!container) return;

      const charEl = charRefs.current[currentIndex];
      if (charEl) {
        const containerRect = container.getBoundingClientRect();
        const charRect = charEl.getBoundingClientRect();
        setCursorPos({
          left: charRect.left - containerRect.left,
          top: charRect.top - containerRect.top,
        });
      } else if (currentIndex === 0) {
        // Handle start of text - position cursor at beginning
        setCursorPos({ left: 0, top: 0 });
      }
    };

    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(updateCursorPos);
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
