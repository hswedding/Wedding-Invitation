import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import Icon from '../components/Icons.jsx';

/* Scene 4b — Invitation films. Each function that carries a `video` is shown
   as its own cinematic scene: the Canva invitation film in an ornate gold
   frame that starts playing the moment it scrolls into view and pauses when
   it leaves. Muted by default (autoplay policy) with a tap-to-unmute pill. */

function Film({ event }) {
  const wrap = useRef(null);
  const videoRef = useRef(null);
  const reduced = useReducedMotion();
  const [muted, setMuted] = useState(true);

  // Autoplay / pause driven by visibility.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          if (!reduced) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.4] }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  useGSAP(() => {
    gsap.from(wrap.current.querySelectorAll('.film__reveal'), {
      scrollTrigger: { trigger: wrap.current, start: 'top 72%' },
      y: 32, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12,
    });
    gsap.from(wrap.current.querySelector('.film__frame'), {
      scrollTrigger: { trigger: wrap.current, start: 'top 68%' },
      scale: 0.94, duration: 1.1, ease: 'power3.out',
    });
  }, { scope: wrap });

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted) video.play().catch(() => {});
  };

  return (
    <section className="film section" id={`film-${event.id}`} ref={wrap}>
      <div className="section__inner film__inner">
        <p className="eyebrow film__reveal">{event.dateLabel} · {event.dayLabel}</p>
        <h2 className="display film__reveal">{event.name}</h2>
        {event.nameDeva && (
          <p className="film__deva film__reveal" lang="hi">{event.nameDeva}</p>
        )}

        <div className="film__frame film__reveal">
          <video
            ref={videoRef}
            className="film__video"
            src={event.video}
            muted={muted}
            loop
            playsInline
            preload="metadata"
            controls={reduced}
            aria-label={`${event.name} invitation film`}
          />
          {!reduced && (
            <button
              type="button"
              className="film__sound"
              onClick={toggleMute}
              aria-label={muted ? 'Unmute film' : 'Mute film'}
              aria-pressed={!muted}
            >
              <Icon name={muted ? 'speakerOff' : 'speaker'} size={18} />
              <span>{muted ? 'Tap for sound' : 'Sound on'}</span>
            </button>
          )}
        </div>

        <p className="film__meta film__reveal">
          <Icon name="location" size={16} />
          <a href={event.venue?.mapUrl} target="_blank" rel="noopener noreferrer">
            {event.venue?.name}
          </a>
        </p>
      </div>
    </section>
  );
}

export default function EventFilms({ events }) {
  const films = events.filter((e) => e.video);
  if (!films.length) return null;
  return films.map((e) => <Film key={e.id} event={e} />);
}
