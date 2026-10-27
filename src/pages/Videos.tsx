import { useEffect, useState } from 'react';
import { VIDEOS, VIDEO_CATS, type Video } from '../data/videos';
import { TopBar } from '../components/TopBar';
import { Mascot } from '../components/Mascot';

function useOnline() {
  const [on, setOn] = useState(navigator.onLine);
  useEffect(() => {
    const up = () => setOn(true);
    const down = () => setOn(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);
  return on;
}

export function Videos() {
  const [cat, setCat] = useState('all');
  const [now, setNow] = useState<Video | null>(null);
  const online = useOnline();
  const list = cat === 'all' ? VIDEOS : VIDEOS.filter((v) => v.cat === cat);

  if (now) {
    return (
      <main className="page">
        <TopBar title={now.title} back={undefined} />
        <button type="button" className="btn ghost" onClick={() => setNow(null)}>
          ⬅️ Chọn video khác
        </button>
        <div className="video-frame">
          <iframe
            title={now.title}
            src={`https://www.youtube-nocookie.com/embed/${now.id}?rel=0&modestbranding=1&playsinline=1`}
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <p className="hint">{now.vi}. Video do kênh Super Simple Songs trên YouTube phát. Cần có mạng.</p>
      </main>
    );
  }

  return (
    <main className="page">
      <TopBar title="Xem và hát" back="/" />
      <Mascot say="Cùng xem video và hát tiếng Anh nhé!" />
      {!online && <p className="notice">📶 Đang không có mạng. Video cần internet để xem.</p>}
      <div className="chips">
        {VIDEO_CATS.map((c) => (
          <button key={c.id} type="button" className={`cat ${c.id === cat ? 'sel' : ''}`} onClick={() => setCat(c.id)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>
      <div className="video-grid">
        {list.map((v) => (
          <button key={v.id} type="button" className="video" onClick={() => setNow(v)}>
            <span className="thumb">
              <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
              <span className="play">▶</span>
            </span>
            <b>{v.title}</b>
            <small>{v.vi}</small>
          </button>
        ))}
      </div>
      <p className="hint">Video từ kênh chính thức Super Simple Songs. Có thể có quảng cáo do YouTube hiển thị.</p>
    </main>
  );
}
