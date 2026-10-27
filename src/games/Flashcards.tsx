import { useEffect, useState } from 'react';
import type { Word } from '../data/vocab';
import { sfx, speak } from '../lib/audio';
import type { RoundStats } from './Quiz';

/** Learn-new-words mode: big picture, tap to hear, swipe through. No scoring pressure. */
export function Flashcards({ words, onFinish }: { words: Word[]; onFinish: (s: RoundStats) => void }) {
  const [i, setI] = useState(0);
  const [showVi, setShowVi] = useState(false);
  const w = words[i];

  useEffect(() => {
    const t = window.setTimeout(() => speak(w.say ?? w.en, 'en-US', 0.7), 250);
    return () => window.clearTimeout(t);
  }, [w]);

  function go(delta: number) {
    sfx('tap');
    setShowVi(false);
    const n = i + delta;
    if (n < 0) return;
    if (n >= words.length) {
      onFinish({ correct: words.length, total: words.length, mistakes: 0 });
      return;
    }
    setI(n);
  }

  return (
    <div className="flash">
      <div className="progress">
        {words.map((_, k) => (
          <span key={k} className={k < i ? 'dot done' : k === i ? 'dot now' : 'dot'} />
        ))}
      </div>
      <button type="button" className="card" onClick={() => speak(w.say ?? w.en, 'en-US', 0.7)} key={w.en}>
        <span className="card-emoji">{w.emoji}</span>
        <span className="card-word">{w.en}</span>
        <span className="card-hint">🔊 Chạm để nghe lại</span>
      </button>
      <button type="button" className="vi-toggle" onClick={() => setShowVi((v) => !v)}>
        {showVi ? w.vi : '🇻🇳 Xem nghĩa tiếng Việt'}
      </button>
      <div className="flash-nav">
        <button type="button" className="btn ghost" onClick={() => go(-1)} disabled={i === 0}>
          ⬅️
        </button>
        <button type="button" className="btn primary" onClick={() => go(1)}>
          {i === words.length - 1 ? 'Xong rồi! 🎉' : 'Tiếp ➡️'}
        </button>
      </div>
    </div>
  );
}
