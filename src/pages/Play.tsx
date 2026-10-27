import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getActivity, starsFor } from '../data/activities';
import { recordResult } from '../lib/store';
import { sfx, speak } from '../lib/audio';
import { TopBar } from '../components/TopBar';
import { Confetti } from '../components/Confetti';
import { Quiz, type RoundStats } from '../games/Quiz';
import { Flashcards } from '../games/Flashcards';
import { MemoryMatch } from '../games/MemoryMatch';
import { Spell } from '../games/Spell';
import { Simon } from '../games/Simon';

interface Outcome {
  stars: number;
  gained: number;
  sticker: string | null;
  stats: RoundStats;
}

const PRAISE = ['Giỏi quá!', 'Tuyệt vời!', 'Siêu đẳng!', 'Bé làm được rồi!'];

export function Play() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const act = getActivity(id);
  const [round, setRound] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const questions = useMemo(() => act?.make?.(act.level ?? 1) ?? [], [act, round]);

  const finish = useCallback(
    (stats: RoundStats) => {
      if (!act) return;
      const stars = act.kind === 'flash' ? 1 : starsFor(stats.mistakes);
      const res = recordResult(act.id, stars, stats.correct, stats.total);
      sfx('win');
      for (let i = 0; i < stars; i++) window.setTimeout(() => sfx('star'), 900 + i * 280);
      if (res.sticker) window.setTimeout(() => sfx('pop'), 1700);
      window.setTimeout(() => speak(stars === 3 ? 'Perfect!' : 'Great job!', 'en-US'), 700);
      setOutcome({ stars, gained: res.gained, sticker: res.sticker, stats });
    },
    [act]
  );

  if (!act) {
    return (
      <main className="page">
        <TopBar title="Ơ kìa" back="/" />
        <p className="hint">Không tìm thấy bài học này.</p>
      </main>
    );
  }

  const back = `/learn/${act.subject}/${act.group}`;

  if (outcome) {
    return (
      <main className="page center result">
        <Confetti />
        <h1 className="title">{PRAISE[outcome.stars % PRAISE.length]}</h1>
        <div className="result-stars" aria-label={`${outcome.stars} sao`}>
          {[1, 2, 3].map((i) => (
            <span key={i} className={i <= outcome.stars ? 'on pop' : 'off'} style={{ animationDelay: `${i * 0.25}s` }}>
              ★
            </span>
          ))}
        </div>
        <p className="subtitle">
          {outcome.gained > 0 ? `Bé nhận thêm ${outcome.gained} ⭐` : 'Chơi lại để lấy thêm sao nhé!'}
        </p>
        {outcome.sticker && (
          <div className="sticker-win">
            <span className="sticker-big">{outcome.sticker}</span>
            <b>Bé nhận được sticker mới!</b>
          </div>
        )}
        <div className="result-actions">
          <button
            type="button"
            className="btn primary big"
            onClick={() => {
              setOutcome(null);
              setRound((r) => r + 1);
            }}
          >
            🔁 Chơi lại
          </button>
          <button type="button" className="btn secondary big" onClick={() => nav(back)}>
            ➡️ Bài khác
          </button>
          <button type="button" className="btn ghost" onClick={() => nav('/')}>
            🏠 Về nhà
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <TopBar title={act.title} back={back} />
      {act.kind === 'quiz' && <Quiz key={round} questions={questions} onFinish={finish} />}
      {act.kind === 'flash' && act.words && <Flashcards key={round} words={act.words} onFinish={finish} />}
      {act.kind === 'match' && act.words && <MemoryMatch key={round} words={act.words} onFinish={finish} />}
      {act.kind === 'spell' && act.words && <Spell key={round} words={act.words} onFinish={finish} />}
      {act.kind === 'simon' && <Simon key={round} level={act.level ?? 1} onFinish={finish} />}
    </main>
  );
}
