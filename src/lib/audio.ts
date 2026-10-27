import { getState } from './store';

let ctx: AudioContext | null = null;
function ac() {
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (C) ctx = new C();
  }
  if (ctx && ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.18) {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  const t = c.currentTime + start;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export type Sfx = 'tap' | 'correct' | 'wrong' | 'win' | 'star';

export function sfx(kind: Sfx) {
  if (!getState().sound) return;
  switch (kind) {
    case 'tap':
      tone(520, 0, 0.08, 'triangle');
      break;
    case 'correct':
      tone(659, 0, 0.12, 'triangle');
      tone(880, 0.1, 0.2, 'triangle');
      break;
    case 'wrong':
      tone(220, 0, 0.18, 'sawtooth', 0.08);
      tone(180, 0.15, 0.2, 'sawtooth', 0.08);
      break;
    case 'star':
      tone(988, 0, 0.12, 'sine');
      tone(1319, 0.08, 0.18, 'sine');
      break;
    case 'win':
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.25, 'triangle'));
      break;
  }
}

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
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    voicesCache = window.speechSynthesis.getVoices();
  };
}

/** Read text aloud. lang: 'en-US' for English words, 'vi-VN' for Vietnamese prompts. */
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
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}
