import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

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

    // the prompt sits on the foil itself, so it is scratched away with it
    if (prompt) {
      const family =
        getComputedStyle(canvas).getPropertyValue('--font-sans').trim() || 'sans-serif';
      ctx.font = `500 15px ${family}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(92, 70, 14, 0.85)';
      ctx.fillText(`✦ ${prompt}`, w / 2, h / 2);
    }

    let drawing = false;
    let lastCheck = 0;
    let last = null;
    const BRUSH = 10; // radius — generous so a few swipes clear the card

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
      // connect to the previous point so fast swipes leave no gaps
      if (last) {
        ctx.lineWidth = BRUSH * 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
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
    const end = () => { drawing = false; last = null; };

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
  }, [useCanvas, revealed, prompt]);

  // Confetti burst over the card once the foil is scratched away. Drawn on a
  // temporary full-viewport canvas so pieces can fly past the card's
  // overflow:hidden wrap; removed as soon as the burst settles.
  useEffect(() => {
    if (!revealed || reduced) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    Object.assign(canvas.style, {
      position: 'fixed', inset: '0', width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 30,
    });
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const COLORS = ['#d4af37', '#e7c98f', '#bfa15f', '#d05f7a', '#7faa6a', '#f4ead8'];
    const GRAVITY = 900, DRAG = 0.985, DURATION = 2400;
    const parts = Array.from({ length: 140 }, () => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2 * Math.PI;
      const speed = 260 + Math.random() * 420;
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        w: 5 + Math.random() * 5, h: 8 + Math.random() * 7,
        rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 14,
        flutter: 2 + Math.random() * 4,
        color: COLORS[(Math.random() * COLORS.length) | 0],
      };
    });

    let raf, start, prev;
    const tick = (t) => {
      if (start === undefined) { start = prev = t; }
      const dt = Math.min((t - prev) / 1000, 0.032);
      prev = t;
      const elapsed = t - start;
      const fade = Math.min(1, Math.max(0, (DURATION - elapsed) / (DURATION * 0.3)));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of parts) {
        p.vy += GRAVITY * dt;
        p.vx *= DRAG; p.vy *= DRAG;
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.rot += p.vr * dt;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        // flutter: squash the width as the piece "tumbles"
        ctx.scale(Math.sin(elapsed / 1000 * p.flutter + p.rot), 1);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (elapsed < DURATION) raf = requestAnimationFrame(tick);
      else canvas.remove();
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); canvas.remove(); };
  }, [revealed, reduced]);

  return (
    <div className="scratch">
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
