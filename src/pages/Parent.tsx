import { useState } from 'react';
import { ALL_ACTIVITIES } from '../data/activities';
import { deleteProfile, resetProfile, setPin, setSetting, useApp, type Profile } from '../lib/store';
import { TopBar } from '../components/TopBar';

function PinGate({ onOk }: { onOk: () => void }) {
  const { pin } = useApp();
  const [v, setV] = useState('');
  const [err, setErr] = useState('');
  const creating = !pin;

  function submit() {
    if (!/^\d{4}$/.test(v)) return setErr('Nhập đủ 4 chữ số');
    if (creating) {
      setPin(v);
      onOk();
    } else if (v === pin) onOk();
    else {
      setErr('Sai mã PIN');
      setV('');
    }
  }

  return (
    <div className="panel">
      <h2>🔒 Khu vực phụ huynh</h2>
      <p className="hint">{creating ? 'Tạo mã PIN 4 số để bé không vào nhầm.' : 'Nhập mã PIN để tiếp tục.'}</p>
      <input
        className="input pin"
        inputMode="numeric"
        type="password"
        maxLength={4}
        value={v}
        onChange={(e) => {
          setV(e.target.value.replace(/\D/g, ''));
          setErr('');
        }}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="••••"
        aria-label="Mã PIN"
      />
      {err && <p className="error">{err}</p>}
      <button type="button" className="btn primary" onClick={submit}>
        {creating ? 'Tạo PIN' : 'Mở'}
      </button>
    </div>
  );
}

function lastDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

function ChildReport({ p }: { p: Profile }) {
  const days = lastDays(7);
  const maxStars = Math.max(1, ...days.map((d) => p.log[d]?.stars ?? 0));
  const bySubject = (subject: 'en' | 'math') => {
    const acts = ALL_ACTIVITIES.filter((a) => a.subject === subject);
    const rs = acts.map((a) => p.results[a.id]).filter(Boolean);
    const correct = rs.reduce((s, r) => s + r.correct, 0);
    const total = rs.reduce((s, r) => s + r.total, 0);
    return { done: rs.length, all: acts.length, acc: total ? Math.round((correct / total) * 100) : null };
  };
  const en = bySubject('en');
  const math = bySubject('math');
  const weak = ALL_ACTIVITIES.filter((a) => (p.results[a.id]?.stars ?? 3) < 2 && p.results[a.id]).map((a) => a.title);

  return (
    <section className="report">
      <h3>
        {p.avatar} {p.name}
      </h3>
      <div className="kpis">
        <div><b>{p.stars}</b><small>Tổng sao</small></div>
        <div><b>{p.streak}</b><small>Ngày liên tiếp</small></div>
        <div><b>{p.stickers.length}</b><small>Sticker</small></div>
      </div>
      <table className="tbl">
        <thead><tr><th>Môn</th><th>Bài đã chơi</th><th>Độ chính xác</th></tr></thead>
        <tbody>
          <tr><td>Tiếng Anh</td><td>{en.done}/{en.all}</td><td>{en.acc === null ? '—' : `${en.acc}%`}</td></tr>
          <tr><td>Toán tư duy</td><td>{math.done}/{math.all}</td><td>{math.acc === null ? '—' : `${math.acc}%`}</td></tr>
        </tbody>
      </table>
      <h4>Sao kiếm được 7 ngày qua</h4>
      <div className="bars">
        {days.map((d) => {
          const v = p.log[d]?.stars ?? 0;
          return (
            <div key={d} className="bar-col">
              <span className="bar-val">{v}</span>
              <span className="bar" style={{ height: `${(v / maxStars) * 80 + 4}px` }} />
              <small>{d.slice(8)}/{d.slice(5, 7)}</small>
            </div>
          );
        })}
      </div>
      {weak.length > 0 && (
        <p className="hint">💡 Nên luyện thêm: {weak.slice(0, 4).join(', ')}</p>
      )}
      <div className="row">
        <button
          type="button"
          className="btn ghost"
          onClick={() => window.confirm(`Xóa toàn bộ tiến độ của ${p.name}?`) && resetProfile(p.id)}
        >
          Đặt lại tiến độ
        </button>
        <button
          type="button"
          className="btn ghost danger"
          onClick={() => window.confirm(`Xóa hồ sơ ${p.name}?`) && deleteProfile(p.id)}
        >
          Xóa hồ sơ
        </button>
      </div>
    </section>
  );
}

export function Parent() {
  const { profiles, sound, speech } = useApp();
  const [ok, setOk] = useState(false);
  return (
    <main className="page">
      <TopBar title="Phụ huynh" back="/" />
      {!ok ? (
        <PinGate onOk={() => setOk(true)} />
      ) : (
        <>
          <section className="report">
            <h3>⚙️ Cài đặt</h3>
            <label className="toggle">
              <input type="checkbox" checked={sound} onChange={(e) => setSetting('sound', e.target.checked)} /> Hiệu ứng âm thanh
            </label>
            <label className="toggle">
              <input type="checkbox" checked={speech} onChange={(e) => setSetting('speech', e.target.checked)} /> Đọc to từ và câu hỏi
            </label>
            <p className="hint">Giọng đọc dùng bộ đọc có sẵn của thiết bị. Nếu chưa nghe tiếng, hãy kiểm tra âm lượng và cài giọng tiếng Anh trong cài đặt máy.</p>
          </section>
          {profiles.length === 0 && <p className="hint">Chưa có hồ sơ bé nào.</p>}
          {profiles.map((p) => (
            <ChildReport key={p.id} p={p} />
          ))}
        </>
      )}
    </main>
  );
}
