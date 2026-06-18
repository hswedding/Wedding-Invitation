import './styles/tokens.css';
import './styles/base.css';
import './styles/scenes.css';

import { initDoor } from './scenes/door.js';

initDoor();

// Placeholder scroll reveals for the Scene 2 teaser.
// Phase 2 replaces this with Lenis + GSAP ScrollTrigger.
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.25 }
);
document.querySelectorAll('.reveal-up').forEach((el) => io.observe(el));
