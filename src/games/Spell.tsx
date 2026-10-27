import { useEffect, useMemo, useRef, useState } from 'react';
import type { Word } from '../data/vocab';
import { sfx, speak } from '../lib/audio';
import { pick, shuffle } from '../lib/util';
import { Mascot } from '../components/Mascot';
import type { RoundStats } from './Quiz';

interface Tile {
  id: number;
  ch: string;
}

/** Spelling: see the picture, tap the letters in order. Shorter words come first. */
export function Spell({ words, onFinish }: { words: Word[]; onFinish: (s: RoundStats) => void }) {
  const queue = useMemo(() => pick(words, Math.min(6, words.length)).sort((a, b) => a.en.length - b.en.length), [words]);
  const [idx, setIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [slots, setSlots] = useState<number[]>([]); // tile ids placed, in order
  const [state, setState] = useState<'play' | 'ok' | 'bad'>('play');
  const timer = useRef<number | undefined>(undefined);
  const mistakesRef = useRef(0);
  mistakesRef.current = mistakes;

  const word = queue[idx];
  const tiles = useMemo<Tile[]>(() => {
    const base = word.en.split('').map((ch, id) => ({ id, ch }));
    let s = shuffle(base);
    // never show the letters already in the right order (unless every letter is the same)
    for (let k = 0; k < 20 && new Set(base.map((t) => t.ch)).size > 1 && s.map((t) => t.ch).join('') === word.en; k++) s = shuffle(base);
    return s;
  }, [word]);

  useEffect(() => {
    const t = window.setTimeout(() => speak(word.en, 'en-US', 0.7), 300);
    return () => window.clearTimeout(t);
  }, [word]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function place(t: Tile) {
    if (state !== 'play' || slots.includes(t.id)) return;
    sfx('pop');
    const next = [...slots, t.id];
    setSlots(next);
    if (next.length < tiles.length) return;
    const spelled = next.map((id) => tiles.find((x) => x.id === id)!.ch).join('');
    if (spelled === word.en) {
      setState('ok');
      sfx('correct');
      window.setTimeout(() => speak(word.en, 'en-US', 0.7), 350);
      timer.current = window.setTimeout(() => {
        if (idx + 1 >= queue.length) {
          onFinish({ correct: queue.length - mistakesRef.current, total: queue.length, mistakes: mistakesRef.current });
        } else {
          setIdx(idx + 1);
          setSlots([]);
          setState('play');
        }
      }, 1500);
    } else {
      setState('bad');
      sfx('wrong');
      setMistakes((m) => m + 1);
      timer.current = window.setTimeout(() => {
        setSlots([]);
        setState('play');
      }, 700);
    }
  }

  const back = () => {
    if (state === 'play' && slots.length) setSlots(slots.slice(0, -1));
  };

  return (
    <div className="spell">
      <div className="progress">
        {queue.map((_, i) => (
          <span key={i} className={i < idx ? 'dot done' : i === idx ? 'dot now' : 'dot'} />
        ))}
      </div>
      <Mascot say="Xếp các chữ cái thành từ nhé!" sayEn={word.en} mood={state === 'bad' ? 'think' : state === 'ok' ? 'cheer' : 'happy'} />
      <button type="button" className="big-visual" onClick={() => speak(word.en, 'en-US', 0.7)} aria-label="Nghe lại">
        <span className="vis lg">{word.emoji}</span>
      </button>
      <div className={`slots ${state === 'bad' ? 'shake' : ''} ${state === 'ok' ? 'ok' : ''}`} onClick={back}>
        {tiles.map((_, i) => {
          const t = slots[i] !== undefined ? tiles.find((x) => x.id === slots[i]) : undefined;
          return (
            <span key={i} className={`slot ${t ? 'full' : ''}`}>
              {t?.ch ?? ''}
            </span>
          );
        })}
      </div>
      <div className="tiles">
        {tiles.map((t) => (
          <button key={t.id} type="button" className="tile" disabled={slots.includes(t.id)} onClick={() => place(t)}>
            {t.ch}
          </button>
        ))}
      </div>
      <button type="button" className="btn ghost" onClick={back} disabled={!slots.length || state !== 'play'}>
        ⌫ Xóa chữ cuối
      </button>
    </div>
  );
}
