"use client";

import { Howl } from "howler";
import { useCallback, useState } from "react";

// Preload sounds
const pressSounds = {
  generic: [0, 1, 2, 3, 4].map(
    (i) => new Howl({ src: [`/sounds/press/GENERIC_R${i}.mp3`] }),
  ),
  space: new Howl({ src: ["/sounds/press/SPACE.mp3"] }),
  backspace: new Howl({ src: ["/sounds/press/BACKSPACE.mp3"] }),
  enter: new Howl({ src: ["/sounds/press/ENTER.mp3"] }),
};

const releaseSounds = {
  generic: new Howl({ src: ["/sounds/release/GENERIC.mp3"] }),
  space: new Howl({ src: ["/sounds/release/SPACE.mp3"] }),
  backspace: new Howl({ src: ["/sounds/release/BACKSPACE.mp3"] }),
  enter: new Howl({ src: ["/sounds/release/ENTER.mp3"] }),
};

export function useTypingSounds() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playPressSound = useCallback(
    (key: string) => {
      if (!soundEnabled) return;
      if (key === " ") {
        pressSounds.space.play();
      } else if (key === "Backspace") {
        pressSounds.backspace.play();
      } else if (key === "Enter") {
        pressSounds.enter.play();
      } else if (key.length === 1) {
        const randomSound =
          pressSounds.generic[
            Math.floor(Math.random() * pressSounds.generic.length)
          ];
        randomSound.play();
      }
    },
    [soundEnabled],
  );

  const playReleaseSound = useCallback(
    (key: string) => {
      if (!soundEnabled) return;
      if (key === " ") {
        releaseSounds.space.play();
      } else if (key === "Backspace") {
        releaseSounds.backspace.play();
      } else if (key === "Enter") {
        releaseSounds.enter.play();
      } else if (key.length === 1) {
        releaseSounds.generic.play();
      }
    },
    [soundEnabled],
  );

  return {
    soundEnabled,
    setSoundEnabled,
    playPressSound,
    playReleaseSound,
  };
}
