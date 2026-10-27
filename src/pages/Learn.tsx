import { useNavigate, useParams } from 'react-router-dom';
import { ENGLISH, ENGLISH_GROUPS, MATH, MATH_GROUPS, activityKeys, type Activity, type Group } from '../data/activities';
import { useProfile } from '../lib/store';
import { TopBar } from '../components/TopBar';
import { Mascot } from '../components/Mascot';
import { sfx } from '../lib/audio';

const groupsFor = (subject: string): Group[] => (subject === 'en' ? ENGLISH_GROUPS : MATH_GROUPS);
const activitiesFor = (subject: string, group: string): Activity[] => (subject === 'en' ? ENGLISH : MATH).filter((a) => a.group === group);

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

/** Level 1: pick a topic. Level 2: pick an activity (and difficulty level) inside the topic. */
export function Learn() {
  const { subject = 'en', group } = useParams();
  const p = useProfile()!;
  const nav = useNavigate();
  const groups = groupsFor(subject);
  const subjectTitle = subject === 'en' ? 'Tiếng Anh' : 'Toán tư duy';
  const starsOf = (key: string) => p.results[key]?.stars ?? 0;

  if (!group) {
    return (
      <main className="page">
        <TopBar title={subjectTitle} back="/" />
        <Mascot say={subject === 'en' ? 'Chọn một chủ đề nào!' : 'Hôm nay mình chơi gì nhỉ?'} />
        <div className="topic-grid">
          {groups.map((g) => {
            const acts = activitiesFor(subject, g.id);
            const keys = acts.flatMap(activityKeys);
            const got = keys.reduce((s, k) => s + starsOf(k), 0);
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
                  ★ {got}/{keys.length * 3}
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
  const open = (id: string) => nav(`/play/${id}`);

  return (
    <main className="page">
      <TopBar title={g ? `${g.emoji} ${g.title}` : subjectTitle} back={`/learn/${subject}`} />
      <div className="act-list">
        {acts.map((a) =>
          a.levels ? (
            <div key={a.id} className="act with-levels">
              <div className="act-head">
                <span className="act-emoji">{a.emoji}</span>
                <span className="act-text">
                  <b>{a.title}</b>
                  <small>{a.desc}</small>
                </span>
              </div>
              <div className="level-row">
                {activityKeys(a).map((k, i) => (
                  <button key={k} type="button" className="level-btn" onClick={() => open(k)}>
                    <span>Cấp {i + 1}</span>
                    <Stars n={starsOf(k)} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button key={a.id} type="button" className="act" onClick={() => open(a.id)}>
              <span className="act-emoji">{a.emoji}</span>
              <span className="act-text">
                <b>{a.title}</b>
                <small>{a.desc}</small>
              </span>
              <Stars n={starsOf(a.id)} />
            </button>
          )
        )}
      </div>
    </main>
  );
}
