import { useEffect, useRef, useState } from 'react';
import { playNote, sfx } from '../lib/audio';
import { rand } from '../lib/util';
import { Mascot } from '../components/Mascot';
import type { RoundStats } from './Quiz';

const PADS = [
  { emoji: '🐶', color: '#ef476f', note: 72 },
  { emoji: '🐱', color: '#3b82f6', note: 76 },
  { emoji: '🐸', color: '#06c167', note: 79 },
  { emoji: '🐥', color: '#f5b700', note: 84 }
];
const ROUNDS = 4;

const gen = (n: number) => Array.from({ length: n }, () => rand(0, 3));

/** Memory game: watch the animals light up, then repeat the order. Level sets the starting length. */
export function Simon({ level, onFinish }: { level: number; onFinish: (s: RoundStats) => void }) {
  const [round, setRound] = useState(0);
  const [seq, setSeq] = useState<number[]>(() => gen(level + 1));
  const [phase, setPhase] = useState<'show' | 'input' | 'ok'>('show');
  const [lit, setLit] = useState<number | null>(null);
  const [pos, setPos] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // playback of the sequence
  useEffect(() => {
    if (phase !== 'show') return;
    seq.forEach((k, i) => {
      later(() => {
        setLit(k);
        playNote(PADS[k].note);
      }, 900 + i * 800);
      later(() => setLit(null), 900 + i * 800 + 500);
    });
    later(() => {
      setPos(0);
      setPhase('input');
    }, 900 + seq.length * 800);
    return () => timers.current.forEach(clearTimeout);
  }, [phase, seq]);

  function press(k: number) {
    if (phase !== 'input') return;
    playNote(PADS[k].note);
    setLit(k);
    later(() => setLit(null), 250);
    if (seq[pos] !== k) {
      sfx('wrong');
      setMistakes((m) => m + 1);
      setPhase('ok'); // brief pause, then replay the same sequence
      later(() => setPhase('show'), 900);
      return;
    }
    if (pos + 1 < seq.length) return setPos(pos + 1);
    sfx('correct');
    setPhase('ok');
    later(() => {
      if (round + 1 >= ROUNDS) {
        const m = mistakes;
        onFinish({ correct: Math.max(0, ROUNDS - m), total: ROUNDS, mistakes: m });
        return;
      }
      setRound(round + 1);
      setSeq([...seq, rand(0, 3)]);
      setPhase('show');
    }, 1000);
  }

  const say = phase === 'show' ? 'Nhìn kỹ nhé, bạn nào sáng lên trước?' : phase === 'input' ? `Đến lượt bé rồi! (${pos}/${seq.length})` : 'Giỏi quá!';

  return (
    <div className="simon">
      <div className="progress">
        {Array.from({ length: ROUNDS }, (_, i) => (
          <span key={i} className={i < round ? 'dot done' : i === round ? 'dot now' : 'dot'} />
        ))}
      </div>
      <Mascot say={say} mood={phase === 'ok' ? 'cheer' : phase === 'show' ? 'think' : 'happy'} />
      <div className="pads">
        {PADS.map((p, k) => (
          <button
            key={k}
            type="button"
            className={`pad ${lit === k ? 'lit' : ''}`}
            style={{ background: p.color }}
            onClick={() => press(k)}
            disabled={phase !== 'input'}
            aria-label={`Bạn thứ ${k + 1}`}
          >
            {p.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
