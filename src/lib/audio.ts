import { getState } from './store';

// ---------- Context and buses ----------
let ctx: AudioContext | null = null;
let master: GainNode;
let sfxBus: GainNode;
let musicBus: GainNode;

function ac() {
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    sfxBus = ctx.createGain();
    sfxBus.connect(master);
    musicBus = ctx.createGain();
    musicBus.gain.value = 0;
    musicBus.connect(master);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

function tone(
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = 'sine',
  vol = 0.18,
  to?: number,
  bus?: GainNode
) {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  const t = c.currentTime + start;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(bus ?? sfxBus);
  o.start(t);
  o.stop(t + dur + 0.05);
}

// ---------- Sound effects ----------
export type Sfx = 'tap' | 'correct' | 'wrong' | 'win' | 'star' | 'flip' | 'pop';

let lastTap = 0;

export function sfx(kind: Sfx) {
  if (!getState().sound) return;
  switch (kind) {
    case 'tap': {
      // soft "bloop"; dedupe so a global tap handler and an explicit call never double up
      const now = performance.now();
      if (now - lastTap < 150) return;
      lastTap = now;
      tone(520, 0, 0.09, 'sine', 0.2, 820);
      break;
    }
    case 'flip': // quick whoosh
      tone(280, 0, 0.1, 'triangle', 0.12, 720);
      break;
    case 'pop':
      tone(300, 0, 0.12, 'sine', 0.25, 900);
      break;
    case 'correct': // happy ascending arpeggio + sparkle
      [72, 76, 79, 84].forEach((n, i) => tone(midi(n), i * 0.075, 0.22, 'triangle', 0.17));
      tone(midi(96), 0.3, 0.3, 'sine', 0.07);
      break;
    case 'wrong': // gentle "boing", never harsh
      tone(340, 0, 0.28, 'sine', 0.22, 190);
      tone(250, 0.18, 0.25, 'sine', 0.12, 150);
      break;
    case 'star': // sparkle
      [88, 91, 95].forEach((n, i) => tone(midi(n), i * 0.07, 0.25, 'sine', 0.12));
      break;
    case 'win': // little fanfare
      [
        [72, 0],
        [76, 0.12],
        [79, 0.24],
        [84, 0.36],
        [79, 0.54],
        [84, 0.66]
      ].forEach(([n, t]) => {
        tone(midi(n), t, 0.3, 'triangle', 0.2);
        tone(midi(n + 12), t, 0.3, 'sine', 0.06);
      });
      tone(midi(88), 0.85, 0.7, 'triangle', 0.18);
      tone(midi(79), 0.85, 0.7, 'triangle', 0.12);
      tone(midi(72), 0.85, 0.7, 'triangle', 0.12);
      break;
  }
}

/** A single musical note (MIDI number), used by the memory game pads. */
export function playNote(n: number) {
  if (getState().sound) tone(midi(n), 0, 0.45, 'triangle', 0.25);
}

// ---------- Background music (generated, no audio files, no copyright) ----------
export type MusicMode = 'home' | 'play';

const PENTA = [72, 74, 76, 79, 81, 84]; // C major pentatonic, C5..C6
const ROOTS = [48, 45, 41, 43]; // C  Am  F  G  (bass)
const MOTIFS: number[][] = [
  [0, 2, 4, 2, 3, 2, 1, -1],
  [4, 3, 2, 0, 2, -1, 1, -1],
  [2, -1, 4, 5, 4, 2, 3, -1],
  [0, -1, 2, -1, 4, -1, 3, 2],
  [5, 4, 2, 4, 3, 1, 2, -1],
  [2, 3, 4, -1, 2, 1, 0, -1]
];

let musicTimer: number | undefined;
let musicOn = false;
let musicMode: MusicMode = 'home';
let nextTime = 0;
let stepNo = 0;
let motif = MOTIFS[0];
let ducked = false;

const MUSIC_LEVEL = 0.55;

function stepDur() {
  const bpm = musicMode === 'play' ? 118 : 92;
  return 60 / bpm / 2; // eighth note
}

function scheduleMusic() {
  const c = ctx;
  if (!c) return;
  while (nextTime < c.currentTime + 0.35) {
    const i = stepNo % 8;
    const bar = Math.floor(stepNo / 8);
    const t = nextTime - c.currentTime;
    if (i === 0) {
      let next = MOTIFS[Math.floor(Math.random() * MOTIFS.length)];
      if (next === motif) next = MOTIFS[(MOTIFS.indexOf(next) + 1) % MOTIFS.length];
      motif = next;
    }
    const d = stepDur();
    const root = ROOTS[bar % 4];
    const idx = motif[i];
    if (idx >= 0) tone(midi(PENTA[idx]), t, d * 2.2, 'triangle', 0.085, undefined, musicBus);
    if (i === 0 || i === 4) tone(midi(root), t, d * 3.6, 'sine', 0.16, undefined, musicBus);
    if (musicMode === 'play') {
      if (i === 2 || i === 6) tone(midi(root + 7), t, d * 1.5, 'sine', 0.07, undefined, musicBus);
      if (i % 2 === 1) tone(2200, t, 0.03, 'square', 0.012, undefined, musicBus);
    } else if (i === 4) {
      tone(midi(root + 19), t, d * 3, 'sine', 0.04, undefined, musicBus);
    }
    nextTime += d;
    stepNo++;
  }
}

function level() {
  return (ducked ? 0.28 : 1) * MUSIC_LEVEL;
}

export function startMusic(mode: MusicMode) {
  musicMode = mode;
  if (musicOn) return;
  const c = ac();
  if (!c) return;
  musicOn = true;
  stepNo = 0;
  nextTime = c.currentTime + 0.15;
  musicBus.gain.cancelScheduledValues(c.currentTime);
  musicBus.gain.setTargetAtTime(level(), c.currentTime, 0.6);
  musicTimer = window.setInterval(scheduleMusic, 100);
}

export function stopMusic() {
  if (!musicOn || !ctx) return;
  musicOn = false;
  window.clearInterval(musicTimer);
  musicBus.gain.cancelScheduledValues(ctx.currentTime);
  musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
}

function setDuck(on: boolean) {
  ducked = on;
  if (ctx && musicOn) musicBus.gain.setTargetAtTime(level(), ctx.currentTime, 0.12);
}

/** Browsers block audio until the first tap; call this from a user gesture. */
export function unlockAudio() {
  ac();
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) void ctx.suspend();
    else void ctx.resume();
  });
}

// ---------- Speech ----------
let voicesCache: SpeechSynthesisVoice[] = [];
function pickVoice(lang: string) {
  if (!('speechSynthesis' in window)) return undefined;
  if (!voicesCache.length) voicesCache = window.speechSynthesis.getVoices();
  const base = lang.slice(0, 2);
  const matches = voicesCache.filter((v) => v.lang.toLowerCase().startsWith(base));
  return (
    matches.find((v) => v.lang.toLowerCase() === lang.toLowerCase() && /female|zira|samantha|google|aria|jenny/i.test(v.name)) ||
    matches.find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ||
    matches[0]
  );
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    voicesCache = window.speechSynthesis.getVoices();
  };
}

/** Read text aloud. lang: 'en-US' for English words, 'vi-VN' for Vietnamese prompts. Music ducks while speaking. */
export function speak(text: string, lang: 'en-US' | 'vi-VN' = 'en-US', rate = 0.8) {
  if (!getState().speech || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.pitch = 1.15;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    u.onstart = () => setDuck(true);
    u.onend = () => setDuck(false);
    u.onerror = () => setDuck(false);
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}
