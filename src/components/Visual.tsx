/** Renders a question visual: plain emoji/text, "shape:<name>" or "size:<big|small>:<emoji>". */
export type VisSize = 'lg' | 'md' | 'sm' | 'xs';

export function sizeFor(len: number): VisSize {
  return len > 12 ? 'xs' : len > 6 ? 'sm' : len > 3 ? 'md' : 'lg';
}

/** `size` forces one size so groups that are compared by count never differ in emoji size. */
export function Visual({ value, className = '', size }: { value: string; className?: string; size?: VisSize }) {
  if (value.startsWith('shape:')) return <Shape name={value.slice(6)} className={className} />;
  if (value.startsWith('size:')) {
    const [, size, emoji] = value.split(':');
    return (
      <span className={`size-${size} ${className}`} aria-hidden>
        {emoji}
      </span>
    );
  }
  const cls = size ?? sizeFor([...value].length);
  return <span className={`vis ${cls} ${className}`}>{value}</span>;
}

const FILL = '#ff8a3d';

export function Shape({ name, className = '' }: { name: string; className?: string }) {
  const common = { fill: FILL, stroke: '#3b2a1a', strokeWidth: 4, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 100 100" className={`shape ${className}`} aria-hidden>
      {name === 'circle' && <circle cx="50" cy="50" r="40" {...common} />}
      {name === 'square' && <rect x="14" y="14" width="72" height="72" {...common} />}
      {name === 'rectangle' && <rect x="6" y="26" width="88" height="48" {...common} />}
      {name === 'triangle' && <polygon points="50,10 92,86 8,86" {...common} />}
      {name === 'star' && (
        <polygon points="50,6 62,38 96,38 68,58 78,92 50,72 22,92 32,58 4,38 38,38" {...common} />
      )}
      {name === 'heart' && (
        <path d="M50 88 C10 58 6 30 28 20 C42 14 50 26 50 30 C50 26 58 14 72 20 C94 30 90 58 50 88Z" {...common} />
      )}
    </svg>
  );
}
