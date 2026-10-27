import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AVATARS, addProfile, selectProfile, useApp } from '../lib/store';
import { sfx, speak } from '../lib/audio';

export function Profiles() {
  const { profiles } = useApp();
  const nav = useNavigate();
  const [adding, setAdding] = useState(profiles.length === 0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);

  function choose(id: string) {
    sfx('tap');
    selectProfile(id);
    nav('/');
  }

  function create() {
    sfx('correct');
    addProfile(name, avatar);
    speak('Hello!', 'en-US');
    nav('/');
  }

  return (
    <main className="page center">
      <div className="logo">🦊</div>
      <h1 className="title">Bé Vui Học</h1>
      <p className="subtitle">Học tiếng Anh và Toán thật vui!</p>

      {!adding && (
        <>
          <h2>Ai đang học nào?</h2>
          <div className="profile-grid">
            {profiles.map((p) => (
              <button key={p.id} type="button" className="profile" onClick={() => choose(p.id)}>
                <span className="profile-avatar">{p.avatar}</span>
                <span>{p.name}</span>
              </button>
            ))}
            <button type="button" className="profile add" onClick={() => setAdding(true)}>
              <span className="profile-avatar">➕</span>
              <span>Thêm bé</span>
            </button>
          </div>
        </>
      )}

      {adding && (
        <div className="panel">
          <h2>Chào bạn nhỏ! Bé tên là gì?</h2>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên của bé"
            maxLength={16}
            autoFocus
          />
          <p className="hint">Chọn bạn đồng hành:</p>
          <div className="avatar-row">
            {AVATARS.map((a) => (
              <button
                key={a}
                type="button"
                className={`avatar ${a === avatar ? 'sel' : ''}`}
                onClick={() => {
                  sfx('tap');
                  setAvatar(a);
                }}
                aria-label={`Chọn ${a}`}
              >
                {a}
              </button>
            ))}
          </div>
          <button type="button" className="btn primary big" onClick={create} disabled={!name.trim()}>
            Bắt đầu thôi! 🚀
          </button>
          {profiles.length > 0 && (
            <button type="button" className="btn ghost" onClick={() => setAdding(false)}>
              Quay lại
            </button>
          )}
        </div>
      )}
    </main>
  );
}
