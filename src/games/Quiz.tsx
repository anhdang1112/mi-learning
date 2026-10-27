import { useEffect, useRef, useState } from 'react';
import type { Question } from '../data/activities';
import { sfx, speak } from '../lib/audio';
import { Visual } from '../components/Visual';
import { Mascot } from '../components/Mascot';

export interface RoundStats {
  correct: number;
  total: number;
  mistakes: number;
}

export function Quiz({ questions, onFinish }: { questions: Question[]; onFinish: (s: RoundStats) => void }) {
  const [idx, setIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const q = questions[idx];

  const say = () => (q.speakEn ? speak(q.speakEn, 'en-US') : speak(q.prompt, 'vi-VN', 0.95));

  useEffect(() => {
    const t = window.setTimeout(say, 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function choose(id: string, spoken?: string) {
    if (done || wrong.includes(id)) return;
    if (id === q.answer) {
      sfx('correct');
      setDone(true);
      if (q.praise) window.setTimeout(() => speak(q.praise!, 'en-US'), 350);
      timer.current = window.setTimeout(() => {
        if (idx + 1 >= questions.length) {
          onFinish({ correct: questions.length - mistakesRef.current, total: questions.length, mistakes: mistakesRef.current });
        } else {
          setIdx(idx + 1);
          setWrong([]);
          setDone(false);
        }
      }, 1400);
    } else {
      sfx('wrong');
      if (spoken) speak(spoken, 'en-US');
      setWrong((w) => [...w, id]);
      setMistakes((m) => m + 1);
      setShake(id);
      window.setTimeout(() => setShake(null), 500);
    }
  }

  // ref copy so the timeout callback reads the latest mistakes count
  const mistakesRef = useRef(0);
  mistakesRef.current = mistakes;

  const textOnly = q.options.every((o) => o.label && !o.emoji);
  const pictureOnly = q.options.every((o) => o.emoji && !o.label);
  const emojiLens = q.options.map((o) => (o.emoji ? [...o.emoji].length : 0));
  // options that are groups of different counts (compare quiz): one row each, one shared size
  const isGroups = pictureOnly && Math.min(...emojiLens) !== Math.max(...emojiLens);
  const uniformSize = isGroups ? (Math.max(...emojiLens) > 9 ? 'xs' : 'sm') : undefined;
  const longEmoji = isGroups || emojiLens.some((n) => n > 3);

  return (
    <div className="quiz">
      <div className="progress" aria-label={`Câu ${idx + 1}/${questions.length}`}>
        {questions.map((_, i) => (
          <span key={i} className={i < idx ? 'dot done' : i === idx ? 'dot now' : 'dot'} />
        ))}
      </div>

      <Mascot say={q.prompt} sayEn={q.speakEn} mood={wrong.length ? 'think' : done ? 'cheer' : 'happy'} />

      {q.big && (
        <button type="button" className="big-visual" onClick={say} aria-label="Nghe lại">
          <Visual value={q.big} />
        </button>
      )}

      <div className={`options ${textOnly ? 'text' : ''} ${longEmoji ? 'wide' : ''} n${q.options.length}`}>
        {q.options.map((o) => {
          const isWrong = wrong.includes(o.id);
          const isRight = done && o.id === q.answer;
          return (
            <button
              key={o.id}
              type="button"
              disabled={isWrong}
              className={`opt ${isWrong ? 'wrong' : ''} ${isRight ? 'right' : ''} ${shake === o.id ? 'shake' : ''}`}
              onClick={() => choose(o.id, o.speak)}
            >
              {o.emoji && <Visual value={o.emoji} size={uniformSize} className={pictureOnly ? 'opt-vis' : 'opt-vis small'} />}
              {o.label && <span className="opt-label">{o.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
