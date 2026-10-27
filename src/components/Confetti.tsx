import { useMemo } from 'react';

const COLORS = ['#ff8a3d', '#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#8d5cf6'];

export function Confetti({ count = 60 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        dur: 2 + Math.random() * 2,
        color: COLORS[i % COLORS.length],
        size: 8 + Math.random() * 8,
        rot: Math.random() * 360
      })),
    [count]
  );
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p, i) => (
        <i
          key={i}
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size * 0.5,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            transform: `rotate(${p.rot}deg)`
          }}
        />
      ))}
    </div>
  );
}
