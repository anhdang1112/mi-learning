import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sfx, startMusic, stopMusic, unlockAudio } from '../lib/audio';
import { useApp } from '../lib/store';

/** Starts/stops background music from settings, route and the first user tap. */
export function AudioManager() {
  const { music } = useApp();
  const { pathname } = useLocation();
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const unlock = () => {
      unlockAudio();
      setUnlocked(true);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    // every button makes a soft tap sound; answer/card buttons have their own sounds
    const tap = (e: PointerEvent) => {
      const b = (e.target as HTMLElement | null)?.closest('button');
      if (b && !b.disabled && !b.matches('.opt, .mem')) sfx('tap');
    };
    window.addEventListener('pointerdown', tap);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('pointerdown', tap);
    };
  }, []);

  const silent = pathname.startsWith('/videos') || pathname.startsWith('/parent');
  const mode = pathname.startsWith('/play') ? 'play' : 'home';

  useEffect(() => {
    if (music && unlocked && !silent) startMusic(mode);
    else stopMusic();
  }, [music, unlocked, silent, mode]);

  return null;
}
