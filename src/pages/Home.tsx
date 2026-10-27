import { useNavigate } from 'react-router-dom';
import { useApp, useProfile, setSetting, STICKER_EVERY } from '../lib/store';
import { TopBar } from '../components/TopBar';
import { Mascot } from '../components/Mascot';
import { sfx } from '../lib/audio';

function greeting(name: string) {
  const h = new Date().getHours();
  if (h < 11) return `Chào buổi sáng ${name}! Hôm nay mình học gì nào?`;
  if (h < 17) return `Chào ${name}! Cùng học thật vui nhé!`;
  return `Chào buổi tối ${name}! Học một chút rồi đi ngủ nhé!`;
}

export function Home() {
  const p = useProfile()!;
  const { music } = useApp();
  const nav = useNavigate();
  const toNext = STICKER_EVERY - (p.stars % STICKER_EVERY);

  const go = (path: string) => {
    sfx('tap');
    nav(path);
  };

  return (
    <main className="page">
      <TopBar title={`${p.avatar} ${p.name}`} />
      <Mascot say={greeting(p.name)} sayEn="Hello! Let's learn together!" />

      <div className="home-grid">
        <button type="button" className="big-card en" onClick={() => go('/learn/en')}>
          <span className="big-emoji">🔤</span>
          <span className="big-title">Tiếng Anh</span>
          <span className="big-desc">Từ vựng · Nghe · Phát âm</span>
        </button>
        <button type="button" className="big-card math" onClick={() => go('/learn/math')}>
          <span className="big-emoji">🧮</span>
          <span className="big-title">Toán tư duy</span>
          <span className="big-desc">Đếm · Logic · Hình khối</span>
        </button>
      </div>

      <button type="button" className="video-banner" onClick={() => go('/videos')}>
        <span className="big-emoji small">🎬</span>
        <span>
          <b>Xem và hát</b>
          <small>Video bài hát tiếng Anh vui nhộn</small>
        </span>
      </button>

      <div className="stat-row">
        <button type="button" className="stat" onClick={() => go('/rewards')}>
          <span className="stat-icon">🏅</span>
          <span>
            <b>{p.stickers.length}</b> sticker
            <small>Còn {toNext} ⭐ nữa có sticker mới</small>
          </span>
        </button>
        <div className="stat">
          <span className="stat-icon">🔥</span>
          <span>
            <b>{p.streak}</b> ngày liên tiếp
            <small>{p.streak > 0 ? 'Giỏi quá, giữ lửa nhé!' : 'Học hôm nay để bắt đầu!'}</small>
          </span>
        </div>
      </div>

      <nav className="footer-links">
        <button
          type="button"
          onClick={() => {
            setSetting('music', !music);
            sfx('tap');
          }}
        >
          {music ? '🎵 Tắt nhạc' : '🔇 Bật nhạc'}
        </button>
        <button type="button" onClick={() => go('/profiles')}>
          👥 Đổi bé
        </button>
        <button type="button" onClick={() => go('/parent')}>
          🔒 Dành cho phụ huynh
        </button>
      </nav>
    </main>
  );
}
