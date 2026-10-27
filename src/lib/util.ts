export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const rand = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

export function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

export function repeatEmoji(e: string, n: number) {
  return Array.from({ length: n }, () => e).join('');
}

/** n distinct numbers in [min,max], always containing `must`, shuffled. */
export function numberOptions(must: number, n: number, min: number, max: number): number[] {
  const set = new Set<number>([must]);
  let guard = 0;
  while (set.size < n && guard++ < 100) set.add(rand(min, max));
  return shuffle([...set]);
}
