import { useNavigate } from 'react-router-dom';
import { useProfile } from '../lib/store';
import { sfx } from '../lib/audio';

export function TopBar({ title, back }: { title?: string; back?: string | -1 }) {
  const nav = useNavigate();
  const p = useProfile();
  return (
    <header className="topbar">
      {back !== undefined ? (
        <button
          type="button"
          className="round-btn"
          aria-label="Quay lại"
          onClick={() => {
            sfx('tap');
            if (back === -1) nav(-1);
            else nav(back);
          }}
        >
          ⬅️
        </button>
      ) : (
        <span className="round-btn ghost-spacer" />
      )}
      <h1>{title}</h1>
      {p && (
        <button type="button" className="chip" onClick={() => nav('/rewards')} aria-label="Phần thưởng">
          <span>⭐ {p.stars}</span>
        </button>
      )}
    </header>
  );
}
