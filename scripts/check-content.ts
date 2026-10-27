// Sanity check for generated questions: run with `npx tsx scripts/check-content.ts`
import { ALL_ACTIVITIES, ALL_KEYS, getActivity } from '../src/data/activities';

let problems = 0;
const fail = (msg: string) => {
  problems++;
  if (problems <= 30) console.log('PROBLEM:', msg);
};

let questions = 0;
for (const key of ALL_KEYS) {
  const a = getActivity(key);
  if (!a) {
    fail(`no activity for ${key}`);
    continue;
  }
  if (a.kind === 'flash' || a.kind === 'match' || a.kind === 'spell') {
    if (!a.words?.length) fail(`${key} has no words`);
    continue;
  }
  if (a.kind === 'simon') continue;
  for (let run = 0; run < 150; run++) {
    const qs = a.make!(a.level ?? 1);
    if (qs.length < 5) fail(`${key} only ${qs.length} questions`);
    for (const q of qs) {
      questions++;
      const ids = q.options.map((o) => o.id);
      if (new Set(ids).size !== ids.length) fail(`${key} duplicate option ids ${JSON.stringify(ids)} | ${q.prompt}`);
      if (!ids.includes(q.answer)) fail(`${key} answer ${q.answer} not in ${JSON.stringify(ids)} | ${q.prompt}`);
      if (q.options.length < 2) fail(`${key} <2 options | ${q.prompt}`);
      if (q.options.some((o) => !o.emoji && !o.label)) fail(`${key} empty option | ${q.prompt}`);
      if (/undefined|NaN|null/.test(JSON.stringify(q))) fail(`${key} bad value ${JSON.stringify(q)}`);
    }
  }
}
console.log(`activities: ${ALL_ACTIVITIES.length}, playable keys: ${ALL_KEYS.length}, questions checked: ${questions}, problems: ${problems}`);
process.exit(problems ? 1 : 0);
