// Scene 1 — the door: open on tap/keyboard + spawn falling marigold petals.
// Pure DOM/CSS; GSAP is intentionally not used here.

export function initDoor() {
  const stage = document.getElementById('stage');
  if (!stage) return;

  const open = () => {
    if (stage.classList.contains('open')) return;
    stage.classList.add('open');
    buildPetals(stage.querySelector('#petals'));
  };

  stage.addEventListener('click', open);
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
}

function buildPetals(wrap) {
  if (!wrap) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const frag = document.createDocumentFragment();
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = 10 + Math.random() * 8;
    p.style.left = Math.random() * 100 + '%';
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.animationDuration = 5 + Math.random() * 5 + 's';
    p.style.animationDelay = Math.random() * 4 + 's';
    frag.appendChild(p);
  }
  wrap.appendChild(frag);
}
