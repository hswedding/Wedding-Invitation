import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

/* Soft rose-petal rain on a fixed full-screen canvas. Capped particle count for
   mobile; paused entirely when the user prefers reduced motion. */
const COLORS = ['#f7dcda', '#e2b4b1', '#eac9c7', '#f7efc8'];

export default function Petals({ active = true }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || reduced) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf, w, h, dpr;
    let running = true;

    const count = window.innerWidth < 600 ? 14 : 26;
    const petals = Array.from({ length: count }, () => spawn(true));

    function spawn(initial) {
      return {
        x: Math.random() * window.innerWidth,
        y: initial ? Math.random() * window.innerHeight : -20,
        r: 5 + Math.random() * 7,
        speed: 0.5 + Math.random() * 1.1,
        sway: 0.6 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.04,
        rot: Math.random() * Math.PI,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        alpha: 0.45 + Math.random() * 0.4,
      };
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        p.y += p.speed;
        p.phase += 0.02;
        p.x += Math.sin(p.phase) * p.sway * 0.5;
        p.rot += p.spin;
        if (p.y > h + 20) Object.assign(p, spawn(false));

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r * 0.6, p.r, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      if (running) raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(resize, 150); };
    window.addEventListener('resize', onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      clearTimeout(t);
    };
  }, [active, reduced]);

  if (reduced) return null;
  return (
    <canvas
      id="petals-canvas"
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 'var(--z-petals)',
      }}
    />
  );
}
