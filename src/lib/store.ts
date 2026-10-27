import { useSyncExternalStore } from 'react';

export interface ActivityResult {
  stars: number; // best 0-3
  plays: number;
  correct: number; // cumulative
  total: number; // cumulative
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  stars: number;
  streak: number;
  lastDay: string;
  stickers: string[];
  results: Record<string, ActivityResult>;
  log: Record<string, { stars: number; activities: number }>;
}

export interface AppState {
  profiles: Profile[];
  activeId: string | null;
  pin: string | null;
  sound: boolean;
  speech: boolean;
  music: boolean;
}

const KEY = 'bevuihoc.v1';

const defaults: AppState = { profiles: [], activeId: null, pin: null, sound: true, speech: true, music: true };

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return defaults;
}

let state: AppState = load();
const listeners = new Set<() => void>();

function commit(next: AppState) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function useApp(): AppState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state
  );
}

export function getState() {
  return state;
}

export function useProfile(): Profile | null {
  const s = useApp();
  return s.profiles.find((p) => p.id === s.activeId) ?? null;
}

export const today = () => new Date().toISOString().slice(0, 10);

export function addProfile(name: string, avatar: string) {
  const p: Profile = {
    id: Math.random().toString(36).slice(2, 10),
    name: name.trim() || 'Bé',
    avatar,
    stars: 0,
    streak: 0,
    lastDay: '',
    stickers: [],
    results: {},
    log: {}
  };
  commit({ ...state, profiles: [...state.profiles, p], activeId: p.id });
}

export function selectProfile(id: string | null) {
  commit({ ...state, activeId: id });
}

export function deleteProfile(id: string) {
  const profiles = state.profiles.filter((p) => p.id !== id);
  commit({ ...state, profiles, activeId: state.activeId === id ? null : state.activeId });
}

export function resetProfile(id: string) {
  commit({
    ...state,
    profiles: state.profiles.map((p) =>
      p.id === id ? { ...p, stars: 0, streak: 0, lastDay: '', stickers: [], results: {}, log: {} } : p
    )
  });
}

export function setPin(pin: string) {
  commit({ ...state, pin });
}

export function setSetting(key: 'sound' | 'speech' | 'music', value: boolean) {
  commit({ ...state, [key]: value });
}

function dayDiff(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

export const STICKER_EVERY = 6; // stars per sticker

export const STICKERS = [
  '🦄', '🐉', '🚀', '🌈', '🍭', '🎈', '🏆', '👑', '🦋', '🐳', '🎨', '⚽',
  '🚒', '🛸', '🍩', '🌻', '🐝', '🎸', '🧸', '🪁', '🦖', '🐙', '🍓', '⭐'
];

export const AVATARS = ['🐶', '🐱', '🐼', '🦁', '🐰', '🦊', '🐯', '🐸', '🐵', '🐨'];

/** Record an activity result. Returns stars gained and any newly unlocked sticker. */
export function recordResult(
  activityId: string,
  stars: number,
  correct: number,
  total: number
): { gained: number; sticker: string | null; newStreak: number } {
  const p = state.profiles.find((x) => x.id === state.activeId);
  if (!p) return { gained: 0, sticker: null, newStreak: 0 };

  const prev = p.results[activityId] ?? { stars: 0, plays: 0, correct: 0, total: 0 };
  // reward improvement, but always at least 1 star for finishing so replaying never feels pointless
  const gained = Math.max(stars - prev.stars, stars > 0 ? 1 : 0);
  const res: ActivityResult = {
    stars: Math.max(prev.stars, stars),
    plays: prev.plays + 1,
    correct: prev.correct + correct,
    total: prev.total + total
  };

  const d = today();
  let streak = p.streak;
  if (p.lastDay !== d) streak = p.lastDay && dayDiff(p.lastDay, d) === 1 ? p.streak + 1 : 1;

  const newStars = p.stars + gained;
  let sticker: string | null = null;
  let stickers = p.stickers;
  if (Math.floor(newStars / STICKER_EVERY) > p.stickers.length) {
    const pool = STICKERS.filter((s) => !p.stickers.includes(s));
    if (pool.length) {
      sticker = pool[Math.floor(Math.random() * pool.length)];
      stickers = [...p.stickers, sticker];
    }
  }

  const day = p.log[d] ?? { stars: 0, activities: 0 };
  const next: Profile = {
    ...p,
    stars: newStars,
    streak,
    lastDay: d,
    stickers,
    results: { ...p.results, [activityId]: res },
    log: { ...p.log, [d]: { stars: day.stars + gained, activities: day.activities + 1 } }
  };
  commit({ ...state, profiles: state.profiles.map((x) => (x.id === p.id ? next : x)) });
  return { gained, sticker, newStreak: streak };
}
