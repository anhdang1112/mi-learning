import { TOPICS, type Word } from './vocab';
import { pick, rand, repeatEmoji, shuffle, numberOptions } from '../lib/util';

export interface Option {
  id: string;
  label?: string;
  emoji?: string;
  speak?: string; // English spoken when tapped
}

export interface Question {
  prompt: string; // Vietnamese instruction (also read aloud)
  speakEn?: string; // English read aloud automatically
  big?: string; // big visual: emoji string, text, or "shape:<name>"
  options: Option[];
  answer: string;
  praise?: string; // English phrase spoken on correct
}

export type Kind = 'flash' | 'quiz' | 'match';
export type Subject = 'en' | 'math';

export interface Activity {
  id: string;
  subject: Subject;
  group: string; // topic id or math skill group
  title: string;
  desc: string;
  emoji: string;
  kind: Kind;
  words?: Word[];
  make?: () => Question[];
}

export const QUESTIONS_PER_ROUND = 6;

// ---------- English ----------
function distractors(words: Word[], correct: Word, n: number) {
  return pick(
    words.filter((w) => w.en !== correct.en),
    n
  );
}

function listenQuiz(words: Word[]): Question[] {
  return pick(words, Math.min(QUESTIONS_PER_ROUND, words.length)).map((w) => ({
    prompt: 'Nghe và chạm vào hình đúng',
    speakEn: w.en,
    big: '🔊',
    options: shuffle([w, ...distractors(words, w, 2)]).map((x) => ({ id: x.en, emoji: x.emoji, speak: x.en })),
    answer: w.en,
    praise: w.en
  }));
}

function seeQuiz(words: Word[]): Question[] {
  return pick(words, Math.min(QUESTIONS_PER_ROUND, words.length)).map((w) => ({
    prompt: 'Đây là gì nhỉ? Chọn từ đúng',
    big: w.emoji,
    options: shuffle([w, ...distractors(words, w, 2)]).map((x) => ({ id: x.en, label: x.en, speak: x.en })),
    answer: w.en,
    praise: w.en
  }));
}

export const ENGLISH: Activity[] = TOPICS.flatMap((t) => [
  { id: `en-${t.id}-learn`, subject: 'en' as const, group: t.id, title: 'Làm quen từ mới', desc: 'Xem, nghe và đọc theo', emoji: '📖', kind: 'flash' as const, words: t.words },
  { id: `en-${t.id}-listen`, subject: 'en' as const, group: t.id, title: 'Nghe và chọn', desc: 'Nghe từ rồi chạm vào hình', emoji: '👂', kind: 'quiz' as const, make: () => listenQuiz(t.words) },
  { id: `en-${t.id}-see`, subject: 'en' as const, group: t.id, title: 'Nhìn hình chọn chữ', desc: 'Hình này tiếng Anh là gì?', emoji: '👀', kind: 'quiz' as const, make: () => seeQuiz(t.words) },
  { id: `en-${t.id}-match`, subject: 'en' as const, group: t.id, title: 'Lật thẻ ghép đôi', desc: 'Tìm cặp hình và từ giống nhau', emoji: '🃏', kind: 'match' as const, words: t.words }
]);

// ---------- Math ----------
const COUNT_EMOJI = ['🍎', '⭐', '🐟', '🎈', '🚗', '🌸', '🐞', '🍪', '🦋', '🧸'];
const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

const numOpt = (n: number): Option => ({ id: String(n), label: String(n), speak: NUM_WORDS[n] });

function countQ(): Question[] {
  return Array.from({ length: QUESTIONS_PER_ROUND }, (_, i) => {
    const max = 4 + i * 1; // 4..9 growing difficulty
    const n = rand(1, max);
    const e = COUNT_EMOJI[rand(0, COUNT_EMOJI.length - 1)];
    return {
      prompt: 'Đếm xem có bao nhiêu?',
      big: repeatEmoji(e, n),
      options: numberOptions(n, 3, Math.max(1, n - 2), n + 2).map(numOpt),
      answer: String(n),
      praise: NUM_WORDS[n]
    };
  });
}

function compareGroupsQ(): Question[] {
  return Array.from({ length: QUESTIONS_PER_ROUND }, (_, i) => {
    const e = COUNT_EMOJI[rand(0, COUNT_EMOJI.length - 1)];
    const a = rand(1, 5 + Math.floor(i / 2));
    let b = rand(1, 5 + Math.floor(i / 2));
    if (b === a) b = a + 1;
    const more = i % 2 === 0;
    const target = more ? Math.max(a, b) : Math.min(a, b);
    return {
      prompt: more ? 'Bên nào NHIỀU hơn?' : 'Bên nào ÍT hơn?',
      options: [
        { id: String(a), emoji: repeatEmoji(e, a) },
        { id: String(b), emoji: repeatEmoji(e, b) }
      ],
      answer: String(target)
    };
  });
}

function biggerNumberQ(): Question[] {
  return Array.from({ length: QUESTIONS_PER_ROUND }, (_, i) => {
    const max = i < 3 ? 10 : 20;
    const a = rand(0, max);
    let b = rand(0, max);
    if (a === b) b = (a + 3) % (max + 1);
    const bigger = i % 2 === 0;
    return {
      prompt: bigger ? 'Số nào LỚN hơn?' : 'Số nào BÉ hơn?',
      options: [numOpt(a), numOpt(b)],
      answer: String(bigger ? Math.max(a, b) : Math.min(a, b))
    };
  });
}

function patternQ(): Question[] {
  const sets = [['🔴', '🔵'], ['🍎', '🍌'], ['⭐', '🌙'], ['🐶', '🐱'], ['🟩', '🟨', '🟦'], ['🌸', '🍀', '🌼'], ['🚗', '🚌', '🚲']];
  const shapes = [[0, 1], [0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2], [0, 0, 1, 1]];
  return Array.from({ length: QUESTIONS_PER_ROUND }, (_, i) => {
    const shape = shapes[Math.min(shapes.length - 1, Math.floor((i * shapes.length) / QUESTIONS_PER_ROUND))];
    const need = Math.max(...shape) + 1;
    const set = sets.filter((s) => s.length >= need)[rand(0, 2)] ?? sets[0];
    const unit = shape.map((k) => set[k]);
    const total = Math.max(5, unit.length * 2 + 1);
    const seq = Array.from({ length: total }, (_, k) => unit[k % unit.length]);
    const ans = seq.pop()!;
    const opts = [...new Set([ans, ...set])].slice(0, 3);
    while (opts.length < 3) opts.push(['🍉', '🐸', '🎈'][opts.length]);
    return {
      prompt: 'Hình tiếp theo là gì?',
      big: seq.join(' ') + ' ❓',
      options: shuffle(opts).map((o) => ({ id: o, emoji: o })),
      answer: ans
    };
  });
}

function addQ(): Question[] {
  return Array.from({ length: QUESTIONS_PER_ROUND }, (_, i) => {
    const max = i < 3 ? 5 : 10;
    const a = rand(1, max - 1);
    const b = rand(1, max - a);
    const e = COUNT_EMOJI[rand(0, COUNT_EMOJI.length - 1)];
    const s = a + b;
    return {
      prompt: `${a} cộng ${b} bằng mấy?`,
      big: `${repeatEmoji(e, a)} ➕ ${repeatEmoji(e, b)}`,
      options: numberOptions(s, 3, Math.max(1, s - 2), s + 2).map(numOpt),
      answer: String(s),
      praise: NUM_WORDS[s]
    };
  });
}

function subQ(): Question[] {
  return Array.from({ length: QUESTIONS_PER_ROUND }, (_, i) => {
    const max = i < 3 ? 5 : 10;
    const a = rand(2, max);
    const b = rand(1, a - 1);
    const e = COUNT_EMOJI[rand(0, COUNT_EMOJI.length - 1)];
    const r = a - b;
    return {
      prompt: `${a} trừ ${b} còn mấy?`,
      big: `${repeatEmoji(e, a)} ➖ ${repeatEmoji('❌', b)}`,
      options: numberOptions(r, 3, 0, Math.max(3, a)).map(numOpt),
      answer: String(r),
      praise: NUM_WORDS[r]
    };
  });
}

function missingQ(): Question[] {
  return Array.from({ length: QUESTIONS_PER_ROUND }, (_, i) => {
    const step = i < 4 ? 1 : 2;
    const start = rand(0, 10 - 4 * step);
    const idx = rand(1, 3);
    const seq = Array.from({ length: 5 }, (_, k) => start + k * step);
    const miss = seq[idx];
    return {
      prompt: 'Số nào còn thiếu?',
      big: seq.map((n, k) => (k === idx ? '❓' : String(n))).join(' , '),
      options: numberOptions(miss, 3, Math.max(0, miss - 3), miss + 3).map(numOpt),
      answer: String(miss),
      praise: NUM_WORDS[miss]
    };
  });
}

function oddOneQ(): Question[] {
  const groups = [
    ['🍎', '🍌', '🍇', '🍓'],
    ['🐶', '🐱', '🐰', '🐵'],
    ['🚗', '🚌', '🚲', '🚆'],
    ['🌸', '🌻', '🌼', '🌷'],
    ['⚽', '🏀', '🎾', '🏐']
  ];
  const odd = ['🚀', '🍕', '🌙', '🎸', '🦆', '🍩'];
  return Array.from({ length: QUESTIONS_PER_ROUND }, (_, i) => {
    const g = groups[i % groups.length];
    const same = g[rand(0, g.length - 1)];
    const other = g.filter((x) => x !== same);
    const oddEmoji = i % 2 === 0 ? other[0] : odd[rand(0, odd.length - 1)];
    const row = shuffle([same, same, same, oddEmoji]);
    return {
      prompt: 'Hình nào KHÁC với các hình còn lại?',
      options: row.map((e, k) => ({ id: `${k}:${e}`, emoji: e })),
      answer: `${row.indexOf(oddEmoji)}:${oddEmoji}`
    };
  });
}

function shapesQ(): Question[] {
  const shapes = ['circle', 'square', 'triangle', 'star', 'heart', 'rectangle'];
  return pick(shapes, QUESTIONS_PER_ROUND).map((s) => ({
    prompt: 'Đây là hình gì?',
    big: `shape:${s}`,
    options: shuffle([s, ...pick(shapes.filter((x) => x !== s), 2)]).map((x) => ({ id: x, label: x, speak: x })),
    answer: s,
    praise: s
  }));
}

function bigSmallQ(): Question[] {
  return Array.from({ length: QUESTIONS_PER_ROUND }, (_, i) => {
    const e = COUNT_EMOJI[rand(0, COUNT_EMOJI.length - 1)];
    const wantBig = i % 2 === 0;
    return {
      prompt: wantBig ? 'Hình nào TO hơn?' : 'Hình nào NHỎ hơn?',
      options: shuffle([
        { id: 'big', emoji: `size:big:${e}` },
        { id: 'small', emoji: `size:small:${e}` }
      ]),
      answer: wantBig ? 'big' : 'small'
    };
  });
}

export const MATH_GROUPS = [
  { id: 'count', title: 'Đếm & so sánh', emoji: '🔢', color: '#06b6d4' },
  { id: 'calc', title: 'Cộng trừ vui', emoji: '➕', color: '#f59e0b' },
  { id: 'logic', title: 'Tư duy logic', emoji: '🧩', color: '#8d5cf6' },
  { id: 'shape', title: 'Hình & kích thước', emoji: '🔺', color: '#ef476f' }
];

const m = (id: string, group: string, title: string, desc: string, emoji: string, make: () => Question[]): Activity => ({
  id: `math-${id}`, subject: 'math', group, title, desc, emoji, kind: 'quiz', make
});

export const MATH: Activity[] = [
  m('count', 'count', 'Đếm số lượng', 'Đếm hình rồi chọn số', '🍎', countQ),
  m('compare', 'count', 'Nhiều hơn, ít hơn', 'So sánh hai nhóm', '⚖️', compareGroupsQ),
  m('bigger', 'count', 'Số lớn, số bé', 'So sánh hai con số', '🔟', biggerNumberQ),
  m('missing', 'count', 'Số còn thiếu', 'Điền số vào dãy', '❓', missingQ),
  m('add', 'calc', 'Phép cộng', 'Cộng trong phạm vi 10', '➕', addQ),
  m('sub', 'calc', 'Phép trừ', 'Trừ trong phạm vi 10', '➖', subQ),
  m('pattern', 'logic', 'Tìm quy luật', 'Hình tiếp theo là gì?', '🔴', patternQ),
  m('odd', 'logic', 'Tìm hình khác biệt', 'Chọn hình lạ nhất', '🕵️', oddOneQ),
  m('shapes', 'shape', 'Nhận biết hình', 'Học tên hình bằng tiếng Anh', '🔺', shapesQ),
  m('size', 'shape', 'To và nhỏ', 'So sánh kích thước', '🐘', bigSmallQ)
];

export const ALL_ACTIVITIES: Activity[] = [...ENGLISH, ...MATH];
export const getActivity = (id: string) => ALL_ACTIVITIES.find((a) => a.id === id);

export function starsFor(mistakes: number): number {
  if (mistakes === 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}
