import { useNavigate, useParams } from 'react-router-dom';
import { ENGLISH, MATH, MATH_GROUPS, type Activity } from '../data/activities';
import { TOPICS } from '../data/vocab';
import { useProfile } from '../lib/store';
import { TopBar } from '../components/TopBar';
import { Mascot } from '../components/Mascot';
import { sfx } from '../lib/audio';

interface Group {
  id: string;
  title: string;
  emoji: string;
  color: string;
}

function groupsFor(subject: string): Group[] {
  return subject === 'en' ? TOPICS : MATH_GROUPS;
}

function activitiesFor(subject: string, group: string): Activity[] {
  return (subject === 'en' ? ENGLISH : MATH).filter((a) => a.group === group);
}

function Stars({ n }: { n: number }) {
  return (
    <span className="stars" aria-label={`${n} sao`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= n ? 'on' : 'off'}>
          ★
        </span>
      ))}
    </span>
  );
}

/** Level 1: pick a topic. Level 2: pick an activity inside the topic. */
export function Learn() {
  const { subject = 'en', group } = useParams();
  const p = useProfile()!;
  const nav = useNavigate();
  const groups = groupsFor(subject);
  const subjectTitle = subject === 'en' ? 'Tiếng Anh' : 'Toán tư duy';

  if (!group) {
    return (
      <main className="page">
        <TopBar title={subjectTitle} back="/" />
        <Mascot say={subject === 'en' ? 'Chọn một chủ đề nào!' : 'Hôm nay mình chơi gì nhỉ?'} />
        <div className="topic-grid">
          {groups.map((g) => {
            const acts = activitiesFor(subject, g.id);
            const got = acts.reduce((s, a) => s + (p.results[a.id]?.stars ?? 0), 0);
            return (
              <button
                key={g.id}
                type="button"
                className="topic"
                style={{ background: g.color }}
                onClick={() => {
                  sfx('tap');
                  nav(`/learn/${subject}/${g.id}`);
                }}
              >
                <span className="topic-emoji">{g.emoji}</span>
                <span className="topic-title">{g.title}</span>
                <span className="topic-meta">
                  ★ {got}/{acts.length * 3}
                </span>
              </button>
            );
          })}
        </div>
      </main>
    );
  }

  const g = groups.find((x) => x.id === group);
  const acts = activitiesFor(subject, group);
  return (
    <main className="page">
      <TopBar title={g ? `${g.emoji} ${g.title}` : subjectTitle} back={`/learn/${subject}`} />
      <div className="act-list">
        {acts.map((a, i) => {
          const r = p.results[a.id];
          const prevDone = i === 0 || a.subject === 'math' || (p.results[acts[i - 1].id]?.stars ?? 0) > 0;
          return (
            <button
              key={a.id}
              type="button"
              className={`act ${prevDone ? '' : 'recommended-later'}`}
              onClick={() => {
                sfx('tap');
                nav(`/play/${a.id}`);
              }}
            >
              <span className="act-emoji">{a.emoji}</span>
              <span className="act-text">
                <b>{a.title}</b>
                <small>{a.desc}</small>
              </span>
              <Stars n={r?.stars ?? 0} />
            </button>
          );
        })}
      </div>
    </main>
  );
}
