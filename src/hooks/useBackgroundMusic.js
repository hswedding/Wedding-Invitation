import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';

/* App-wide background score — one looped <audio> element that follows the
   global sound toggle in App.jsx. Fades in/out so it never snaps on.

   Autoplay with sound needs a user gesture: for guests the envelope tap
   provides it, so playback starts the moment the page is revealed. The host
   preview skips the envelope, so if the browser blocks the first attempt we
   retry on the first interaction instead. */
export default function useBackgroundMusic(src, playing, volume = 0.35) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0; // faded up on play
    audioRef.current = audio;
    return () => {
      gsap.killTweensOf(audio);
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    gsap.killTweensOf(audio);

    if (!playing) {
      gsap.to(audio, { volume: 0, duration: 0.4, onComplete: () => audio.pause() });
      return;
    }

    let cancelled = false;
    let retry = null;
    const fadeIn = () => { if (!cancelled) gsap.to(audio, { volume, duration: 1.4 }); };
    // Older Safari returns undefined from play() instead of a promise.
    const attempt = () => Promise.resolve(audio.play()).then(fadeIn);

    attempt().catch(() => {
      if (cancelled) return;
      retry = () => { attempt().catch(() => {}); };
      window.addEventListener('pointerdown', retry, { once: true });
    });

    return () => {
      cancelled = true;
      if (retry) window.removeEventListener('pointerdown', retry);
    };
  }, [playing, volume]);
}
