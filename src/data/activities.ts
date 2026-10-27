import { ALPHABET, TOPICS, type Tpl, type Word } from './vocab';
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
  big?: string; // big visual: emoji string, text, "shape:<name>" or "size:<big|mid|small>:<emoji>"
  options: Option[];
  answer: string;
  praise?: string; // English spoken on correct
}

export type Kind = 'flash' | 'quiz' | 'match' | 'spell' | 'simon';
export type Subject = 'en' | 'math';

export interface Activity {
  id: string;
  subject: Subject;
  group: string;
  title: string;
  desc: string;
  emoji: string;
  kind: Kind;
  words?: Word[];
  make?: (level: number) => Question[];
  levels?: number; // activities with levels are stored as `${id}@${level}`
  level?: number; // set on the resolved activity returned by getActivity
}

export interface Group {
  id: string;
  title: string;
  emoji: string;
  color: string;
}

export const ROUND = 8;

// ---------- English ----------
const art = (s: string) => (/^[aeiou]/i.test(s) ? 'an' : 'a');

function sentence(tpl: Tpl, w: Word): string | null {
  switch (tpl) {
    case 'art': return w.pl ? `They're ${w.en}.` : `It's ${art(w.en)} ${w.en}.`;
    case 'it': return `It's ${w.en}.`;
    case 'mine': return `This is my ${w.en}.`;
    case 'can': return `I can ${w.en}.`;
    case 'im': return `I'm ${w.en}.`;
    case 'like': return `I like ${w.en}.`;
    case 'job': return `I'm ${art(w.en)} ${w.en}.`;
    default: return null;
  }
}

/** 3 options in the first half of a round, 4 in the second half (more choices = harder). */
const optCount = (i: number, avail: number) => Math.min(avail, i < ROUND / 2 ? 3 : 4);

function distractors(words: Word[], correct: Word, n: number) {
  return pick(words.filter((x) => x.en !== correct.en), n);
}

function listenQuiz(words: Word[]): Question[] {
  return pick(words, Math.min(ROUND, words.length)).map((w, i) => ({
    prompt: 'Nghe và chạm vào hình đúng',
    speakEn: w.en,
    big: '🔊',
    options: shuffle([w, ...distractors(words, w, optCount(i, words.length) - 1)]).map((x) => ({ id: x.en, emoji: x.emoji, speak: x.en })),
    answer: w.en,
    praise: w.en
  }));
}

function seeQuiz(words: Word[]): Question[] {
  return pick(words, Math.min(ROUND, words.length)).map((w, i) => ({
    prompt: 'Đây là gì nhỉ? Chọn từ đúng',
    big: w.emoji,
    options: shuffle([w, ...distractors(words, w, optCount(i, words.length) - 1)]).map((x) => ({ id: x.en, label: x.en, speak: x.en })),
    answer: w.en,
    praise: w.en
  }));
}

function trueFalseQuiz(words: Word[]): Question[] {
  return pick(words, Math.min(ROUND, words.length)).map((w, i) => {
    const same = i % 2 === 0;
    const shown = same ? w : distractors(words, w, 1)[0];
    return {
      prompt: `Hình này đúng là "${shown.en}" phải không?`,
      speakEn: shown.en,
      big: w.emoji,
      options: [
        { id: 'yes', emoji: '✅', label: 'Đúng' },
        { id: 'no', emoji: '❌', label: 'Sai' }
      ],
      answer: same ? 'yes' : 'no',
      praise: w.en
    };
  });
}

function sentenceQuiz(tpl: Tpl, words: Word[]): Question[] {
  return pick(words, Math.min(ROUND, words.length)).map((w, i) => {
    const right = sentence(tpl, w)!;
    const wrong = distractors(words, w, optCount(i, words.length) - 1).map((x) => sentence(tpl, x)!);
    return {
      prompt: 'Chọn câu đúng với hình',
      big: w.emoji,
      options: shuffle([right, ...wrong]).map((s) => ({ id: s, label: s, speak: s })),
      answer: right,
      praise: right
    };
  });
}

const canSpell = (w: Word) => /^[a-z]+$/.test(w.en) && w.en.length <= 8;

function topicActivities(t: { id: string; tpl: Tpl; words: Word[] }): Activity[] {
  const base = { subject: 'en' as const, group: t.id };
  const list: Activity[] = [
    { ...base, id: `en-${t.id}-learn`, title: 'Làm quen từ mới', desc: 'Xem, nghe và đọc theo', emoji: '📖', kind: 'flash', words: t.words },
    { ...base, id: `en-${t.id}-listen`, title: 'Nghe và chọn', desc: 'Nghe từ rồi chạm vào hình', emoji: '👂', kind: 'quiz', make: () => listenQuiz(t.words) },
    { ...base, id: `en-${t.id}-see`, title: 'Nhìn hình chọn chữ', desc: 'Hình này tiếng Anh là gì?', emoji: '👀', kind: 'quiz', make: () => seeQuiz(t.words) },
    { ...base, id: `en-${t.id}-tf`, title: 'Đúng hay sai?', desc: 'Nghe từ, xem hình, chọn đúng/sai', emoji: '🤔', kind: 'quiz', make: () => trueFalseQuiz(t.words) }
  ];
  if (t.tpl !== 'none') {
    list.push({ ...base, id: `en-${t.id}-sent`, title: 'Chọn câu đúng', desc: 'Học câu tiếng Anh đơn giản', emoji: '💬', kind: 'quiz', make: () => sentenceQuiz(t.tpl, t.words) });
  }
  const spellable = t.words.filter(canSpell);
  if (spellable.length >= 5) {
    list.push({ ...base, id: `en-${t.id}-spell`, title: 'Ghép chữ cái', desc: 'Xếp các chữ cái thành từ', emoji: '🔠', kind: 'spell', words: spellable });
  }
  list.push({ ...base, id: `en-${t.id}-match`, title: 'Lật thẻ ghép đôi', desc: 'Tìm cặp hình và từ giống nhau', emoji: '🃏', kind: 'match', words: t.words });
  return list;
}

// ---------- Alphabet ----------
const letterWord = (l: (typeof ALPHABET)[number]): Word => ({ en: `${l.up}${l.low}`, vi: l.word, emoji: l.emoji, say: `${l.up}. ${l.up} is for ${l.word}.` });

function abcListen(): Question[] {
  return pick(ALPHABET, ROUND).map((l, i) => ({
    prompt: 'Nghe và chọn chữ cái đúng',
    speakEn: l.up,
    big: '🔊',
    options: shuffle([l, ...pick(ALPHABET.filter((x) => x.up !== l.up), optCount(i, 26) - 1)]).map((x) => ({ id: x.up, label: x.up, speak: x.up })),
    answer: l.up,
    praise: `${l.up}. ${l.word}`
  }));
}

function abcFirst(): Question[] {
  return pick(ALPHABET, ROUND).map((l, i) => ({
    prompt: 'Từ này bắt đầu bằng chữ cái nào?',
    speakEn: l.word,
    big: l.emoji,
    options: shuffle([l, ...pick(ALPHABET.filter((x) => x.up !== l.up), optCount(i, 26) - 1)]).map((x) => ({ id: x.up, label: x.up, speak: x.up })),
    answer: l.up,
    praise: `${l.up}. ${l.word}`
  }));
}

function abcCase(): Question[] {
  return pick(ALPHABET, ROUND).map((l, i) => ({
    prompt: 'Chữ in thường của chữ này là gì?',
    speakEn: l.up,
    big: l.up,
    options: shuffle([l, ...pick(ALPHABET.filter((x) => x.up !== l.up), optCount(i, 26) - 1)]).map((x) => ({ id: x.low, label: x.low, speak: x.up })),
    answer: l.low,
    praise: `${l.up}. ${l.word}`
  }));
}

export const ABC_GROUP: Group = { id: 'alphabet', title: 'Bảng chữ cái', emoji: '🔤', color: '#ff6b6b' };

const abc = { subject: 'en' as const, group: 'alphabet' };
const ABC_ACTIVITIES: Activity[] = [
  { ...abc, id: 'en-alphabet-learn1', title: 'Học chữ A - I', desc: 'Xem, nghe chữ cái và từ đi kèm', emoji: '📖', kind: 'flash', words: ALPHABET.slice(0, 9).map(letterWord) },
  { ...abc, id: 'en-alphabet-learn2', title: 'Học chữ J - R', desc: 'Xem, nghe chữ cái và từ đi kèm', emoji: '📖', kind: 'flash', words: ALPHABET.slice(9, 18).map(letterWord) },
  { ...abc, id: 'en-alphabet-learn3', title: 'Học chữ S - Z', desc: 'Xem, nghe chữ cái và từ đi kèm', emoji: '📖', kind: 'flash', words: ALPHABET.slice(18).map(letterWord) },
  { ...abc, id: 'en-alphabet-listen', title: 'Nghe và chọn chữ', desc: 'Nghe tên chữ cái rồi chạm', emoji: '👂', kind: 'quiz', make: abcListen },
  { ...abc, id: 'en-alphabet-first', title: 'Chữ cái đầu tiên', desc: 'Từ này bắt đầu bằng chữ gì?', emoji: '🔎', kind: 'quiz', make: abcFirst },
  { ...abc, id: 'en-alphabet-case', title: 'Chữ hoa và chữ thường', desc: 'Nối chữ hoa với chữ thường', emoji: '🔡', kind: 'quiz', make: abcCase },
  { ...abc, id: 'en-alphabet-match', title: 'Lật thẻ chữ cái', desc: 'Tìm cặp chữ hoa và chữ thường', emoji: '🃏', kind: 'match', words: ALPHABET.map((l) => ({ en: l.low, vi: l.word, emoji: l.up, say: l.up })) }
];

export const ENGLISH_GROUPS: Group[] = [ABC_GROUP, ...TOPICS];
export const ENGLISH: Activity[] = [...ABC_ACTIVITIES, ...TOPICS.flatMap((t) => topicActivities(t))];

// ---------- Math ----------
const COUNT_EMOJI = ['🍎', '⭐', '🐟', '🎈', '🚗', '🌸', '🐞', '🍪', '🦋', '🧸'];
const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const NUM_WORD = (n: number) => NUM_WORDS[n] ?? String(n);

const numOpt = (n: number): Option => ({ id: String(n), label: String(n), speak: NUM_WORD(n) });
const lv = <T,>(L: number, a: T, b: T, c: T): T => [a, b, c][L - 1];
const anyEmoji = () => COUNT_EMOJI[rand(0, COUNT_EMOJI.length - 1)];
const nOpts = (L: number) => (L === 1 ? 3 : 4);
const spread = (ans: number, n: number, around: number, lo = 0) => numberOptions(ans, n, Math.max(lo, ans - around), ans + around).map(numOpt);

function countQ(L: number): Question[] {
  const max = lv(L, 5, 10, 15);
  const min = lv(L, 1, 3, 6);
  return Array.from({ length: ROUND }, () => {
    const n = rand(min, max);
    return { prompt: 'Đếm xem có bao nhiêu?', big: repeatEmoji(anyEmoji(), n), options: spread(n, nOpts(L), 3, 1), answer: String(n), praise: NUM_WORD(n) };
  });
}

function compareQ(L: number): Question[] {
  const max = lv(L, 5, 8, 12);
  return Array.from({ length: ROUND }, (_, i) => {
    const e = anyEmoji();
    const a = rand(1, max);
    let b = rand(1, max);
    if (b === a) b = a === max ? a - 1 : a + 1;
    if (L === 3 && Math.abs(a - b) > 2) b = a + (a < max ? 1 : -1); // close counts are harder
    const more = i % 2 === 0;
    return {
      prompt: more ? 'Bên nào NHIỀU hơn?' : 'Bên nào ÍT hơn?',
      options: [{ id: String(a), emoji: repeatEmoji(e, a) }, { id: String(b), emoji: repeatEmoji(e, b) }],
      answer: String(more ? Math.max(a, b) : Math.min(a, b))
    };
  });
}

function biggerQ(L: number): Question[] {
  const max = lv(L, 10, 20, 30);
  return Array.from({ length: ROUND }, (_, i) => {
    const big = i % 2 === 0;
    const how = big ? 'LỚN' : 'BÉ';
    const nums = Array.from(new Set(Array.from({ length: 30 }, () => rand(0, max)))).slice(0, L === 3 ? 3 : 2);
    const target = big ? Math.max(...nums) : Math.min(...nums);
    return { prompt: `Số nào ${how} ${L === 3 ? 'nhất' : 'hơn'}?`, options: nums.map(numOpt), answer: String(target) };
  });
}

function hearNumQ(L: number): Question[] {
  const max = lv(L, 5, 10, 20);
  return pick(Array.from({ length: max }, (_, k) => k + 1), ROUND).map((n) => ({
    prompt: 'Nghe và chọn đúng số',
    speakEn: NUM_WORD(n),
    big: '🔊',
    options: spread(n, nOpts(L), 3, 1),
    answer: String(n),
    praise: NUM_WORD(n)
  }));
}

function countMixQ(L: number): Question[] {
  const kinds = lv(L, 2, 3, 3);
  const maxEach = lv(L, 4, 5, 6);
  return Array.from({ length: ROUND }, () => {
    const emojis = pick(COUNT_EMOJI, kinds);
    const counts = emojis.map(() => rand(1, maxEach));
    const target = rand(0, kinds - 1);
    const all = shuffle(emojis.flatMap((e, k) => Array.from({ length: counts[k] }, () => e)));
    return { prompt: `Có bao nhiêu ${emojis[target]} ?`, big: all.join(''), options: spread(counts[target], nOpts(L), 2, 1), answer: String(counts[target]), praise: NUM_WORD(counts[target]) };
  });
}

function addQ(L: number): Question[] {
  const max = lv(L, 5, 10, 20);
  return Array.from({ length: ROUND }, () => {
    const a = rand(1, max - 1);
    const b = rand(1, max - a);
    const s = a + b;
    const e = anyEmoji();
    return {
      prompt: `${a} cộng ${b} bằng mấy?`,
      big: L < 3 ? `${repeatEmoji(e, a)} ➕ ${repeatEmoji(e, b)}` : `${a} + ${b} = ❓`,
      options: spread(s, nOpts(L), 3, 1),
      answer: String(s),
      praise: NUM_WORD(s)
    };
  });
}

function subQ(L: number): Question[] {
  const max = lv(L, 5, 10, 20);
  return Array.from({ length: ROUND }, () => {
    const a = rand(2, max);
    const b = rand(1, a - 1);
    const r = a - b;
    const e = anyEmoji();
    return {
      prompt: `${a} trừ ${b} còn mấy?`,
      big: L < 3 ? `${repeatEmoji(e, a)} ➖ ${repeatEmoji('❌', b)}` : `${a} - ${b} = ❓`,
      options: spread(r, nOpts(L), 3, 0),
      answer: String(r),
      praise: NUM_WORD(r)
    };
  });
}

function bondQ(L: number): Question[] {
  const total = lv(L, 5, 10, 10);
  return Array.from({ length: ROUND }, () => {
    const a = rand(L === 3 ? 0 : 1, total - (L === 3 ? 0 : 1));
    const b = total - a;
    return {
      prompt: `${a} cộng mấy thì bằng ${total}?`,
      big: L === 1 ? `${repeatEmoji('🟠', a)} ➕ ❓ = ${repeatEmoji('🟠', total)}` : `${a} + ❓ = ${total}`,
      options: spread(b, nOpts(L), 3, 0),
      answer: String(b),
      praise: NUM_WORD(b)
    };
  });
}

function missingQ(L: number): Question[] {
  return Array.from({ length: ROUND }, () => {
    let step = 1;
    let start = rand(0, 8);
    if (L === 2) {
      step = [2, 5, 10][rand(0, 2)];
      start = rand(0, 1) * step;
    } else if (L === 3) {
      step = [-1, -2, 3, 4][rand(0, 3)];
      start = step < 0 ? rand(10, 20) : rand(0, 10);
    }
    const seq = Array.from({ length: 5 }, (_, k) => start + k * step);
    const idx = rand(1, 3);
    const miss = seq[idx];
    return {
      prompt: 'Số nào còn thiếu?',
      big: seq.map((n, k) => (k === idx ? '❓' : String(n))).join(' , '),
      options: spread(miss, nOpts(L), Math.max(2, Math.abs(step) * 2), 0),
      answer: String(miss),
      praise: NUM_WORD(miss)
    };
  });
}

const PATTERN_SETS = [['🔴', '🔵', '🟡', '🟢'], ['🍎', '🍌', '🍇', '🍓'], ['⭐', '🌙', '☀️', '☁️'], ['🐶', '🐱', '🐰', '🐸'], ['🚗', '🚌', '🚲', '🚀'], ['🌸', '🍀', '🌼', '🌷']];

function patternQ(L: number): Question[] {
  const shapes = lv(L, [[0, 1]], [[0, 0, 1], [0, 1, 1], [0, 1, 2]], [[0, 0, 1, 1], [0, 1, 2, 3], [0, 1, 0, 2], [0, 1, 2, 1]]);
  return Array.from({ length: ROUND }, () => {
    const shape = shapes[rand(0, shapes.length - 1)];
    const set = shuffle(PATTERN_SETS[rand(0, PATTERN_SETS.length - 1)]);
    const unit = shape.map((k) => set[k]);
    const total = unit.length * 2 + 1;
    const seq = Array.from({ length: total }, (_, k) => unit[k % unit.length]);
    const ans = seq.pop()!;
    const opts = [ans, ...set.filter((x) => x !== ans)].slice(0, nOpts(L));
    return { prompt: 'Hình tiếp theo là gì?', big: seq.join(' ') + ' ❓', options: shuffle(opts).map((o) => ({ id: o, emoji: o })), answer: ans };
  });
}

const ODD_GROUPS = [['🍎', '🍌', '🍇', '🍓'], ['🐶', '🐱', '🐰', '🐵'], ['🚗', '🚌', '🚲', '🚆'], ['🌸', '🌻', '🌼', '🌷'], ['⚽', '🏀', '🎾', '🏐']];
const ODD_OUT = ['🚀', '🍕', '🌙', '🎸', '🦆', '🍩'];
const SIMILAR = [['🍎', '🍅'], ['🍊', '🏀'], ['🌕', '🧀'], ['🐱', '🦁'], ['🍓', '🍒'], ['🐶', '🐺']];

function oddQ(L: number): Question[] {
  return Array.from({ length: ROUND }, (_, i) => {
    let same: string;
    let odd: string;
    if (L === 3) {
      const pair = shuffle(SIMILAR[i % SIMILAR.length]);
      [same, odd] = pair;
    } else {
      const g = ODD_GROUPS[i % ODD_GROUPS.length];
      same = g[rand(0, g.length - 1)];
      odd = i % 2 === 0 ? g.filter((x) => x !== same)[0] : ODD_OUT[rand(0, ODD_OUT.length - 1)];
    }
    const n = L === 1 ? 4 : 6;
    const row = shuffle([...Array.from({ length: n - 1 }, () => same), odd]);
    return {
      prompt: 'Hình nào KHÁC với các hình còn lại?',
      options: row.map((e, k) => ({ id: `${k}:${e}`, emoji: e })),
      answer: `${row.indexOf(odd)}:${odd}`
    };
  });
}

const SHAPES = ['circle', 'square', 'triangle', 'star', 'heart', 'rectangle'];
const SIDES: Record<string, number> = { triangle: 3, square: 4, rectangle: 4 };

function shapesQ(L: number): Question[] {
  if (L === 3) {
    // "which shape has N sides?" (triangle=3, square/rectangle=4)
    return Array.from({ length: ROUND }, (_, i) => {
      const side = i % 2 === 0 ? 3 : 4;
      const correct = side === 3 ? 'triangle' : pick(['square', 'rectangle'], 1)[0];
      const others = SHAPES.filter((s) => (SIDES[s] ?? 0) !== side);
      return {
        prompt: `Hình nào có ${side} cạnh?`,
        options: shuffle([correct, ...pick(others, 3)]).map((s) => ({ id: s, emoji: `shape:${s}`, speak: s })),
        answer: correct,
        praise: correct
      };
    });
  }
  const pool = L === 1 ? SHAPES.slice(0, 4) : SHAPES;
  return Array.from({ length: ROUND }, (_, i) => {
    const s = pool[i % pool.length];
    return {
      prompt: 'Đây là hình gì?',
      big: `shape:${s}`,
      options: shuffle([s, ...pick(pool.filter((x) => x !== s), nOpts(L) - 1)]).map((x) => ({ id: x, label: x, speak: x })),
      answer: s,
      praise: s
    };
  });
}

function sizeQ(L: number): Question[] {
  return Array.from({ length: ROUND }, (_, i) => {
    const e = anyEmoji();
    const big = i % 2 === 0;
    const sizes = L === 1 ? ['big', 'small'] : ['big', 'mid', 'small'];
    return {
      prompt: big ? 'Hình nào TO nhất?' : 'Hình nào NHỎ nhất?',
      options: shuffle(sizes).map((s) => ({ id: s, emoji: `size:${s}:${e}` })),
      answer: big ? 'big' : 'small'
    };
  });
}

export const MATH_GROUPS: Group[] = [
  { id: 'count', title: 'Đếm & so sánh', emoji: '🔢', color: '#06b6d4' },
  { id: 'calc', title: 'Cộng trừ vui', emoji: '➕', color: '#f59e0b' },
  { id: 'logic', title: 'Tư duy logic', emoji: '🧩', color: '#8d5cf6' },
  { id: 'shape', title: 'Hình & kích thước', emoji: '🔺', color: '#ef476f' }
];

const m = (id: string, group: string, title: string, desc: string, emoji: string, make: (L: number) => Question[], levels = 3): Activity => ({
  id: `math-${id}`, subject: 'math', group, title, desc, emoji, kind: 'quiz', make, levels
});

export const MATH: Activity[] = [
  m('count', 'count', 'Đếm số lượng', 'Đếm hình rồi chọn số', '🍎', countQ),
  m('hearnum', 'count', 'Nghe và chọn số', 'Nghe số tiếng Anh, chọn số đúng', '🎧', hearNumQ),
  m('compare', 'count', 'Nhiều hơn, ít hơn', 'So sánh hai nhóm', '⚖️', compareQ),
  m('bigger', 'count', 'Số lớn, số bé', 'So sánh các con số', '🔟', biggerQ),
  m('countmix', 'count', 'Đếm đúng loại', 'Đếm riêng từng loại trong đám hình', '🔎', countMixQ),
  m('add', 'calc', 'Phép cộng', 'Cộng các số nhỏ', '➕', addQ),
  m('sub', 'calc', 'Phép trừ', 'Trừ các số nhỏ', '➖', subQ),
  m('bond', 'calc', 'Cộng để đủ số', 'Còn thiếu mấy để đủ?', '🧮', bondQ),
  m('missing', 'calc', 'Số còn thiếu', 'Điền số vào dãy', '❓', missingQ),
  m('pattern', 'logic', 'Tìm quy luật', 'Hình tiếp theo là gì?', '🔴', patternQ),
  m('odd', 'logic', 'Tìm hình khác biệt', 'Chọn hình lạ nhất', '🕵️', oddQ),
  { id: 'math-simon', subject: 'math', group: 'logic', title: 'Trí nhớ siêu nhân', desc: 'Nhớ và bấm lại đúng thứ tự', emoji: '🧠', kind: 'simon', levels: 3 },
  m('shapes', 'shape', 'Nhận biết hình', 'Tên hình và số cạnh', '🔺', shapesQ),
  m('size', 'shape', 'To và nhỏ', 'So sánh kích thước', '🐘', sizeQ, 2)
];

// ---------- Registry ----------
export const ALL_ACTIVITIES: Activity[] = [...ENGLISH, ...MATH];

/** Result-store keys for an activity (one per level for leveled activities). */
export function activityKeys(a: Activity): string[] {
  return a.levels ? Array.from({ length: a.levels }, (_, i) => `${a.id}@${i + 1}`) : [a.id];
}

export const ALL_KEYS = ALL_ACTIVITIES.flatMap(activityKeys);

export function getActivity(fullId: string): Activity | undefined {
  const [baseId, lvl] = fullId.split('@');
  const a = ALL_ACTIVITIES.find((x) => x.id === baseId);
  if (!a) return undefined;
  if (!a.levels) return a;
  const level = Math.min(a.levels, Math.max(1, Number(lvl) || 1));
  return { ...a, id: `${a.id}@${level}`, level, title: `${a.title} · Cấp ${level}` };
}

export function starsFor(mistakes: number): number {
  if (mistakes === 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}
