"use client";

import { FileText, Github, RotateCcw, Volume2, VolumeOff } from "lucide-react";
import { Geist_Mono } from "next/font/google";
import { useState } from "react";

import ModeToggle from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCursorPosition } from "@/hooks/use-cursor-position";
import { useTypingGame } from "@/hooks/use-typing-game";
import { useTypingSounds } from "@/hooks/use-typing-sounds";

const geistMono = Geist_Mono({ subsets: ["latin"] });

const TEXT_PRESETS = [
  "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet at least once. Typing exercises help us master keyboard layouts and improve our communication skills.",
  "Programming is the art of telling a computer what to do through precise instructions. Code is written in languages that humans can learn and machines can execute. Practice makes perfect when learning any new skill.",
  "Technology evolves rapidly, bringing new tools and possibilities every day. Learning to adapt and grow with these changes is essential. Curiosity and persistence are key to mastering any field.",
];

const DURATION = 30;

export default function TypingTest() {
  const [textIndex, setTextIndex] = useState(0);
  const currentText = TEXT_PRESETS[textIndex];

  const { soundEnabled, setSoundEnabled, playPressSound, playReleaseSound } =
    useTypingSounds();

  const { typed, timeLeft, isRunning, isGameOver, wpm, accuracy, restart } =
    useTypingGame({
      text: currentText,
      duration: DURATION,
      onKeyDown: playPressSound,
      onKeyUp: playReleaseSound,
    });

  const { cursorPos, containerRef, setCharRef } = useCursorPosition(
    typed.length,
  );

  const handleRestart = () => {
    restart();
  };

  const handleTextChange = () => {
    const nextIndex = (textIndex + 1) % TEXT_PRESETS.length;
    setTextIndex(nextIndex);
    restart();
  };

  return (
    <div className="space-y-4 text-xl sm:text-2xl">
      <div className="flex justify-between">
        <div className="space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Restart"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleRestart();
                }}>
                <RotateCcw />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Restart game</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setSoundEnabled((prev) => !prev);
                }}>
                {soundEnabled ? <Volume2 /> : <VolumeOff />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {soundEnabled ? "Mute sounds" : "Unmute sounds"}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="space-x-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="View source on GitHub"
            asChild>
            <a
              href="https://github.com/ldgni/blitz"
              target="_blank"
              onMouseDown={(e) => e.preventDefault()}>
              <Github />
            </a>
          </Button>
          <ModeToggle />
        </div>
      </div>
      <p
        ref={containerRef}
        className={`relative leading-relaxed font-medium tracking-wide ${geistMono.className}`}>
        {!isGameOver && (
          <span
            className={`absolute w-0.5 bg-orange-500 transition-all duration-75 ${
              !isRunning ? "animate-blink" : ""
            }`}
            style={{
              left: cursorPos.left,
              top: cursorPos.top,
              height: "1.25em",
            }}
          />
        )}
        {currentText.split("").map((char, i) => (
          <span
            key={i}
            ref={setCharRef(i)}
            className={`transition-colors duration-75 ${
              i < typed.length
                ? typed[i]
                  ? "text-foreground"
                  : "text-destructive"
                : "text-muted-foreground/50"
            }`}>
            {char}
          </span>
        ))}
      </p>
      <div className="flex items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Change text"
              onMouseDown={(e) => {
                e.preventDefault();
                handleTextChange();
              }}>
              <FileText />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Change text</TooltipContent>
        </Tooltip>
        <div
          className={`flex gap-4 transition-opacity ${
            isRunning || isGameOver
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}>
          {isRunning && (
            <span className="text-muted-foreground tabular-nums">
              {timeLeft}s
            </span>
          )}
          <span className="text-muted-foreground tabular-nums">
            {accuracy}%
          </span>
          <span className="text-muted-foreground tabular-nums">{wpm} WPM</span>
        </div>
      </div>
    </div>
  );
}
