import { speak } from '../lib/audio';

export type Mood = 'happy' | 'cheer' | 'think';

const FACE: Record<Mood, string> = { happy: '🦊', cheer: '🤩', think: '🤔' };

/** Friendly mascot "Cáo Mơ" with a speech bubble. Tap to hear the message. */
export function Mascot({ say, mood = 'happy', sayEn }: { say: string; mood?: Mood; sayEn?: string }) {
  return (
    <button
      type="button"
      className="mascot"
      onClick={() => (sayEn ? speak(sayEn, 'en-US') : speak(say, 'vi-VN', 0.95))}
      aria-label="Nghe lời bạn Cáo"
    >
      <span className={`mascot-face ${mood}`}>{FACE[mood]}</span>
      <span className="bubble">{say}</span>
    </button>
  );
}
