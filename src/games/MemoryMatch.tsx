import { useEffect, useMemo, useRef, useState } from 'react';
import type { Word } from '../data/vocab';
import { sfx, speak } from '../lib/audio';
import { pick, shuffle } from '../lib/util';
import type { RoundStats } from './Quiz';

interface Tile {
  key: string;
  pair: string;
  kind: 'pic' | 'word';
  w: Word;
}

export function MemoryMatch({ words, onFinish }: { words: Word[]; onFinish: (s: RoundStats) => void }) {
  const tiles = useMemo<Tile[]>(() => {
    const chosen = pick(words, 6);
    return shuffle(
      chosen.flatMap((w) => [
        { key: `${w.en}-p`, pair: w.en, kind: 'pic' as const, w },
        { key: `${w.en}-w`, pair: w.en, kind: 'word' as const, w }
      ])
    );
  }, [words]);

  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [tries, setTries] = useState(0);
  const lock = useRef(false);

  useEffect(() => {
    if (matched.length === tiles.length / 2 && matched.length > 0) {
      const t = window.setTimeout(() => {
        const extra = Math.max(0, tries - matched.length);
        onFinish({ correct: matched.length, total: matched.length + extra, mistakes: extra });
      }, 900);
      return () => window.clearTimeout(t);
    }
  }, [matched, tiles.length, tries, onFinish]);

  function flip(t: Tile) {
    if (lock.current || open.includes(t.key) || matched.includes(t.pair)) return;
    sfx('tap');
    speak(t.w.en, 'en-US', 0.8);
    const next = [...open, t.key];
    setOpen(next);
    if (next.length === 2) {
      setTries((n) => n + 1);
      lock.current = true;
      const [a, b] = next.map((k) => tiles.find((x) => x.key === k)!);
      if (a.pair === b.pair) {
        window.setTimeout(() => {
          sfx('correct');
          setMatched((m) => [...m, a.pair]);
          setOpen([]);
          lock.current = false;
        }, 500);
      } else {
        window.setTimeout(() => {
          setOpen([]);
          lock.current = false;
        }, 1000);
      }
    }
  }

  return (
    <div className="memory">
      <p className="hint">Lật hai thẻ: một hình và một từ giống nhau. Chạm để nghe!</p>
      <div className="mem-grid">
        {tiles.map((t) => {
          const faceUp = open.includes(t.key) || matched.includes(t.pair);
          return (
            <button
              key={t.key}
              type="button"
              className={`mem ${faceUp ? 'up' : ''} ${matched.includes(t.pair) ? 'ok' : ''}`}
              onClick={() => flip(t)}
              aria-label={faceUp ? t.w.en : 'Thẻ úp'}
            >
              {faceUp ? t.kind === 'pic' ? <span className="mem-emoji">{t.w.emoji}</span> : <span className="mem-word">{t.w.en}</span> : <span className="mem-back">?</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
