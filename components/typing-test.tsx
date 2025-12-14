"use client";

import { RotateCcw, Volume2, VolumeOff } from "lucide-react";
import { Geist_Mono } from "next/font/google";

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

const TEXT =
  "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet at least once. Typing exercises help us master keyboard layouts and improve our communication skills.";

const DURATION = 30;

export default function TypingTest() {
  const { soundEnabled, setSoundEnabled, playPressSound, playReleaseSound } =
    useTypingSounds();

  const { typed, timeLeft, isRunning, isGameOver, wpm, accuracy, restart } =
    useTypingGame({
      text: TEXT,
      duration: DURATION,
      onKeyDown: playPressSound,
      onKeyUp: playReleaseSound,
    });

  const { cursorPos, containerRef, setCharRef } = useCursorPosition(
    typed.length,
  );

  return (
    <div className="space-y-4 text-xl sm:text-2xl">
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Restart"
              onMouseDown={(e) => {
                e.preventDefault();
                restart();
              }}>
              <RotateCcw />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Restart</TooltipContent>
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
          <TooltipContent>{soundEnabled ? "Mute" : "Unmute"}</TooltipContent>
        </Tooltip>
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
        {TEXT.split("").map((char, i) => (
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
      <div
        className={`flex justify-end gap-4 transition-opacity ${
          isRunning ? "opacity-100" : "pointer-events-none opacity-0"
        }`}>
        <span className="text-muted-foreground tabular-nums">{timeLeft}s</span>
        <span className="text-muted-foreground tabular-nums">{accuracy}%</span>
        <span className="text-muted-foreground tabular-nums">{wpm} WPM</span>
      </div>
    </div>
  );
}
