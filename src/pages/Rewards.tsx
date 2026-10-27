import { STICKERS, STICKER_EVERY, useProfile } from '../lib/store';
import { TopBar } from '../components/TopBar';
import { Mascot } from '../components/Mascot';
import { sfx } from '../lib/audio';

export function Rewards() {
  const p = useProfile()!;
  const toNext = STICKER_EVERY - (p.stars % STICKER_EVERY);
  return (
    <main className="page">
      <TopBar title="Bộ sưu tập" back={-1} />
      <Mascot say={`Bé có ${p.stars} ⭐ rồi! Còn ${toNext} sao nữa là có sticker mới.`} />
      <div className="sticker-grid">
        {STICKERS.map((s) => {
          const own = p.stickers.includes(s);
          return (
            <button key={s} type="button" className={`sticker ${own ? 'own' : 'locked'}`} onClick={() => own && sfx('star')}>
              {own ? s : '❔'}
            </button>
          );
        })}
      </div>
    </main>
  );
}
