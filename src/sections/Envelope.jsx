import { useRef, useState } from 'react';
import { gsap } from '../lib/gsap.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import Icon from '../components/Icons.jsx';

/* Scene 0 — the envelope film IS the opening screen. It sits full-screen on
   its first frame; a tap plays it with sound, and when it ends (or is
   skipped) the page is revealed. Reduced motion or a video error skips
   straight to the page. */
export default function Envelope({ onOpen }) {
  const root = useRef(null);
  const videoRef = useRef(null);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  const open = () => {
    if (playing) return;
    if (reduced) {
      gsap.set(root.current, { autoAlpha: 0 });
      finish();
      return;
    }
    const video = videoRef.current;
    if (!video) return closeOverlay();
    setPlaying(true);
    // A user gesture, so playing with sound is allowed; fall back to muted.
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(closeOverlay);
    });
  };

  const closeOverlay = () => {
    videoRef.current?.pause();
    gsap.to(root.current, {
      autoAlpha: 0, duration: 0.8, ease: 'power2.inOut', onComplete: finish,
    });
  };

  const finish = () => onOpen?.();

  return (
    <div
      className="envelope"
      ref={root}
      role="dialog"
      aria-label="Wedding invitation — tap to open"
    >
      <video
        ref={videoRef}
        className="envelope__film"
        src="/videos/envelop.mp4"
        playsInline
        preload="auto"
        onEnded={closeOverlay}
        onError={() => closeOverlay()}
        aria-label="Envelope opening film"
      />

      {!playing && (
        <button
          type="button"
          className="envelope__tap"
          onClick={open}
          aria-label="Open the invitation"
        >
          <span className="envelope__cta">
            <Icon name="sparkle" size={16} /> Tap to Open
          </span>
        </button>
      )}

      {playing && (
        <button type="button" className="envelope__skip" onClick={closeOverlay}>
          Skip <Icon name="sparkle" size={14} />
        </button>
      )}
    </div>
  );
}
