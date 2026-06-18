# Wedding Invitation Site — Claude Code Build Brief

Paste this into a fresh Claude Code session as the project brief. It assumes a static, scroll-driven single-page Indian wedding invitation.

---

## 1. Goal

A single-page, mobile-first Indian wedding invitation. It opens on a closed ornate door that the guest taps to swing open, revealing the Ganesha invocation and the couple's names. Scrolling then plays a cinematic story (our-story, events, venue, RSVP) with orchestrated reveals.

## 2. Tech stack (decided — don't substitute without asking)

- **Plain HTML / CSS / vanilla JS.** No React, no build framework. One `index.html` entry.
- **GSAP 3 + ScrollTrigger** for scroll choreography (free for commercial use since April 2025).
- **Lenis** for smooth scroll (pairs with ScrollTrigger; call `ScrollTrigger.update` on Lenis scroll).
- **Vite** only as a dev server + bundler for clean module imports and minification. No framework.
- Fonts: Google Fonts — `Cormorant Garamond` (display/body), `Tiro Devanagari Sanskrit` (Hindi), `Tangerine` (script accent). Self-host for production if load time matters.
- The door (scene 1) is **CSS 3D transforms only** — no library. GSAP starts at scene 2.

## 3. Project structure

```
wedding-invite/
├─ index.html
├─ src/
│  ├─ main.js            # entry: init Lenis, register ScrollTrigger, import scenes
│  ├─ scenes/
│  │  ├─ door.js         # scene 1 open logic + petals
│  │  ├─ story.js        # scene 2 timelines
│  │  ├─ events.js       # haldi / mehndi / wedding cards
│  │  ├─ venue.js        # map + directions
│  │  └─ rsvp.js         # form handling
│  ├─ styles/
│  │  ├─ tokens.css      # the palette + type variables below
│  │  ├─ base.css
│  │  └─ scenes.css
│  └─ lib/               # gsap, ScrollTrigger, lenis (or via npm)
├─ assets/
│  ├─ ganesha.svg        # drop-in real Ganesha line-art (placeholder for now)
│  ├─ mandala.svg
│  ├─ photos/            # optimized webp, lazy-loaded
│  └─ audio/             # optional shehnai/chime, muted by default
└─ public/
```

## 4. Design tokens (use verbatim)

```css
:root{
  --night:#1c0c13; --night-2:#2a121b;
  --wood:#5e1d28; --wood-dark:#431019;
  --gold:#c9a24b; --gold-lt:#eccd83; --ivory:#f1e3c6;
  --marigold:#e8923a; --glow:#ffd98a;
}
```
Direction: candlelit-haveli-at-night. Deep aubergine background, brass-gold detailing, marigold (genda) accents, ivory type. Restraint everywhere except the door reveal — that is the one signature moment.

## 5. Scene-by-scene spec

**Scene 1 — The Door (CSS, no GSAP)**
- Closed ornate double doors, cusped (jharokha) arch top, brass handles meeting at the seam, warm light glowing through the seam, a marigold *toran* across the frame, ambient embers, "Tap to open" hint.
- On tap/Enter: doors rotateY open (~108deg, transform-origin at outer edges, perspective on parent), seam light fades, content behind scales+fades in (mandala + `ॐ`, `॥ श्री गणेशाय नमः ॥`, names with a Tangerine `&`, `शुभ विवाह`, date), marigold petals begin falling, scroll cue appears.
- Use the working prototype `wedding-scene-1.html` as the exact starting point — port it in, don't rebuild.

**Scene 2 — Our Story** (GSAP + ScrollTrigger)
- Pinned section; photos cross-fade and parallax as you scroll. SplitText to reveal the headline character-by-character. Timeline scrubbed to scroll progress.

**Scene 3 — Events** (Haldi / Mehndi / Sangeet / Wedding / Reception)
- Cards that slide/fade in on enter (stagger). Each with date, time, venue, dress-code colour dot.

**Scene 4 — Venue & Travel**
- Embedded map (Google Maps iframe or Leaflet), "Get directions" button, hotel notes.

**Scene 5 — RSVP**
- Simple form. Backend: Google Form / Formspree / a small serverless endpoint — pick the lowest-maintenance option. Validate client-side, no `<form>` reload.

**Footer** — countdown timer to the date, hashtag, contact numbers.

## 6. Animation rules (so it doesn't feel "AI-generated")

- One orchestrated moment per section beats scattered effects. Ease everything (`power2/power3`, `expo` for the door-feel).
- Always wrap reveals in `prefers-reduced-motion` checks; provide instant fallbacks.
- `ScrollTrigger.matchMedia` / `gsap.matchMedia` for mobile vs desktop variants.
- Lazy-load photos; never block first paint. Target a clean Lighthouse score on mobile.
- Kill all ScrollTriggers on resize/teardown to avoid layout jank.

## 7. Build order (phased — one PR per phase)

1. **Scaffold** — Vite static setup, tokens.css, fonts, port scene 1 from the prototype. Verify door works on touch + keyboard.
2. **Smooth scroll + first scroll reveal** — wire Lenis + ScrollTrigger, build Scene 2.
3. **Events + Venue** — scenes 3 & 4, content-driven.
4. **RSVP + footer countdown** — pick backend, validate, test submission.
5. **Polish pass** — reduced-motion, mobile breakpoints, Lighthouse, real photos, optional audio toggle, OG/meta tags for WhatsApp link previews (critical — most guests open via WhatsApp).
6. **Deploy** — Netlify/Vercel/GitHub Pages.

## 8. Git workflow

- Branch prefix `sandeep/` (e.g. `sandeep/scene-1-door`, `sandeep/scroll-story`).
- One phase per branch/PR; commit per logical scene.
- Keep content (names, dates, photos, venue) in a single `src/data.js` so updates don't touch animation code.

## 9. Open variables to confirm before phase 3

- Couple names + families + exact date/time (currently placeholders: Aarav & Diya, 12·12·2026).
- Event list and venues (Tricity — e.g. the shortlisted halls).
- Languages: English + Hindi confirmed; add Punjabi/Gurmukhi?
- RSVP: collected how, sent where?
- WhatsApp share preview image + title.

## 10. First message to send Claude Code

> Build phase 1 only. Set up a Vite static site (no framework), add the design tokens and Google Fonts, and port the attached `wedding-scene-1.html` into `index.html` + `src/scenes/door.js` + `src/styles/`. Keep the door as pure CSS 3D. Don't add GSAP yet. Branch: `sandeep/scene-1-door`. Show me the result before phase 2.
