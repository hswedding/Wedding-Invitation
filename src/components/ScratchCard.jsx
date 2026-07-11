import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';
import Icon from './Icons.jsx';

/* Canvas scratch-to-reveal. The revealed content sits underneath; a foil cover
   is erased as the guest scratches. Auto-reveals past ~55%. Falls back to the
   plain revealed content for reduced-motion or coarse/no-pointer devices. */
export default function ScratchCard({ prompt, children, width = 320, height = 150 }) {
  const reduced = useReducedMotion();
  const canRef = useRef(null);
  const wrapRef = useRef(null);
  const [revealed, setRevealed] = useState(false);

  const finePointer =
    typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches;
  // touch devices report coarse but should still scratch; only skip if reduced.
  const useCanvas = !reduced;

  useEffect(() => {
    if (!useCanvas || revealed) return;
    const canvas = canRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = wrapRef.current.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    // foil cover
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#e7c98f');
    grad.addColorStop(0.5, '#d4af37');
    grad.addColorStop(1, '#bfa15f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    for (let i = 0; i < 60; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }

    let drawing = false;
    let last = null;
    let lastCheck = 0;
    const BRUSH = 34;

    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return { x: p.clientX - r.left, y: p.clientY - r.top };
    };
    const scratch = (e) => {
      if (!drawing) return;
      e.preventDefault();
      const { x, y } = pos(e);
      ctx.globalCompositeOperation = 'destination-out';
      // continuous stroke from the last point so fast swipes don't leave gaps
      ctx.lineWidth = BRUSH * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(last ? last.x : x, last ? last.y : y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, BRUSH, 0, Math.PI * 2);
      ctx.fill();
      last = { x, y };
      const now = Date.now();
      if (now - lastCheck > 150) { lastCheck = now; checkCleared(ctx, w, h, dpr); }
    };
    const checkCleared = (c, ww, hh, d) => {
      const img = c.getImageData(0, 0, ww * d, hh * d).data;
      let clear = 0;
      for (let i = 3; i < img.length; i += 40) if (img[i] === 0) clear++;
      if (clear / (img.length / 40) > 0.4) setRevealed(true);
    };
    const start = (e) => { drawing = true; last = null; scratch(e); };
    const end = () => {
      if (drawing) checkCleared(ctx, w, h, dpr);
      drawing = false;
      last = null;
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    window.addEventListener('touchend', end);
    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', scratch);
      window.removeEventListener('mouseup', end);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', scratch);
      window.removeEventListener('touchend', end);
    };
  }, [useCanvas, revealed]);

  return (
    <div className="scratch">
      {prompt && !revealed && useCanvas && (
        <p className="scratch__prompt">
          <Icon name="sparkle" size={16} /> {prompt}
        </p>
      )}
      <div className="scratch__wrap" ref={wrapRef} style={{ minHeight: height }}>
        <div className="scratch__reveal">{children}</div>
        {useCanvas && !revealed && (
          <canvas
            ref={canRef}
            className="scratch__canvas"
            role="button"
            tabIndex={0}
            aria-label={`${prompt || 'Scratch to reveal'} — or press Enter to reveal`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRevealed(true); }
            }}
          />
        )}
      </div>
      {useCanvas && !revealed && !finePointer && (
        <button type="button" className="scratch__skip" onClick={() => setRevealed(true)}>
          Tap to reveal
        </button>
      )}
    </div>
  );
}
