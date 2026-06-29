import { useEffect, useRef, useState } from 'react';
import Icon from './Icons.jsx';
import { config } from '../data.js';

/* Floating background-music toggle. Audio only starts after a user gesture
   (the envelope tap sets `started`), per autoplay policy. Muted by default. */
export default function MusicToggle({ started, enabled = true }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!enabled || !started) return;
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.4;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [started, enabled]);

  if (!enabled) return null;

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {});
    else { a.pause(); setPlaying(false); }
  };

  return (
    <>
      <audio ref={audioRef} src={config.music.src} loop preload="none" />
      <button
        type="button"
        className="music-toggle"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Pause background music' : 'Play background music'}
      >
        <Icon name={playing ? 'speaker' : 'speakerOff'} size={20} />
      </button>
    </>
  );
}
