import { useRef, useState } from 'react';
import { gsap } from '../lib/gsap.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import { couple } from '../data.js';
import Icon from '../components/Icons.jsx';

/* Scene 0 — full-screen wine-maroon envelope with an ivory wax seal. Tapping
   the seal opens it (cinematic fade through dark) and hands off to the page. */
export default function Envelope({ onOpen }) {
  const root = useRef(null);
  const sealRef = useRef(null);
  const reduced = useReducedMotion();
  const [busy, setBusy] = useState(false);

  const open = () => {
    if (busy) return;
    setBusy(true);
    if (reduced) {
      gsap.set(root.current, { autoAlpha: 0, onComplete: finish });
      return;
    }
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(sealRef.current, { scale: 1.18, duration: 0.18, ease: 'power2.out' })
      .to(sealRef.current, { scale: 0.2, rotate: 24, autoAlpha: 0, duration: 0.5, ease: 'power3.in' })
      .to(root.current.querySelector('.envelope__card'), { y: -14, autoAlpha: 0, duration: 0.4 }, '-=0.3')
      .to(root.current, { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' }, '-=0.1');
  };

  const finish = () => onOpen?.();

  return (
    <div
      className="envelope"
      ref={root}
      role="dialog"
      aria-label="Wedding invitation — tap the seal to open"
    >
      <Corner className="envelope__corner envelope__corner--tl" />
      <Corner className="envelope__corner envelope__corner--br" />

      <div className="envelope__card">
        <p className="envelope__kicker">Together with their families</p>
        <p className="envelope__names">
          {couple.groom.first} <span>&</span> {couple.bride.first}
        </p>

        <button
          type="button"
          className="envelope__seal"
          ref={sealRef}
          onClick={open}
          aria-label="Open the invitation"
        >
          <span className="envelope__seal-ring" aria-hidden="true" />
          <span className="envelope__monogram">{couple.monogram}</span>
        </button>

        <p className="envelope__cta">
          <Icon name="sparkle" size={16} /> Tap to Reveal
        </p>
      </div>
    </div>
  );
}

function Corner({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" width="120" height="120">
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6">
        <path d="M10 110c0-30 8-54 30-66" />
        <path d="M14 96c14-6 26-4 36 4M30 70c10 2 16 8 18 18M52 52c6 4 9 10 9 18" />
        <circle cx="40" cy="58" r="3" />
        <circle cx="58" cy="44" r="2.4" />
        <path d="M22 84c-4 4-7 9-8 16" />
      </g>
    </svg>
  );
}
