# Wedding Invitation Site — Claude Code Build Brief

A single-page, mobile-first digital wedding invitation, **modeled on
[invifest-demo.vercel.app](https://invifest-demo.vercel.app/)**. This brief is the
reverse-engineered architecture of that reference plus the plan to rebuild it with the
same tech stack and feel.

> **Direction change (read first).** An earlier draft of this plan targeted vanilla
> HTML/CSS/JS, a dark "candlelit haveli" palette, and a CSS 3D *door*. To match Invifest
> we are switching to **React 19 + Vite**, a **light cream / dusty-rose / gold** palette,
> and a **wax-seal envelope** opening with a **scratch-to-reveal** date. The cultural
> specifics of your own wedding (Ganesha invocation, Hindi/Punjabi text, family names) are
> layered in as content — see §9.

---

## 1. Goal

A single-page, mobile-first wedding invitation that opens on a **sealed envelope**. The
guest taps the wax seal; the envelope opens with a short cinematic transition into the
invitation. Scrolling then plays an orchestrated, GSAP-driven story — save-the-date with a
scratch-card date reveal, countdown, our-story, events, venue, RSVP — over a soft, elegant
cream/sage/gold canvas with falling petals and optional background music.

## 2. How the reference (Invifest) is built — verified from source

| Concern | What Invifest does |
|---|---|
| **Bundler / host** | **Vite** (hashed `index-*.js` ESM + one `index-*.css`), deployed on **Vercel**, with **`@vercel/analytics`**. Single `index.html` shell, `<div id="root">`. SPA — no SSR, no router. |
| **Framework** | **React 19** (`createRoot`, `react.transitional.element`). One scrolling page of `<section>`s. |
| **Styling** | Hybrid: one CSS file holds **design tokens + `@font-face` + component classes**; layout/animation use **inline `style` objects**. No Tailwind. |
| **Animation** | **GSAP 3 + ScrollTrigger** only. `gsap.matchMedia` for desktop/mobile variants; `prefers-reduced-motion` honored. **No Lenis, no Framer Motion.** |
| **Petals** | Custom `<canvas id="petals-canvas">` rain of petals. |
| **Confetti** | `canvas-confetti` on RSVP success + a `kids-saying-yay` sound effect. |
| **Music** | `<audio src="/assets/bg-music.mp3" loop>` with a mute/unmute toggle button. |
| **Song request** | RSVP "song for the dance floor" field queries the **iTunes Search API** (`itunes.apple.com/search?term=…&entity=song&limit=6`) — the only outbound fetch. |
| **Phone input** | `react-phone-number-input` (+ `libphonenumber`) for international RSVP numbers. |
| **Assets** | Photos + audio on a **Cloudflare R2** bucket CDN, lazy-loaded. `favicon.svg`. |
| **Share** | OG + Twitter meta tuned for **WhatsApp previews** (`og:image` 1200×630). Footer "Crafted by Invifest" CTA opens `wa.me/<number>` with a prefilled message. |
| **RSVP submit** | Demo **simulates** success (no backend in the bundle): `Send RSVP → Sending… → success` state. We pick a real lightweight backend (§5, Scene 6). |

**Fonts (verbatim from the reference):**
- Self-hosted **`Distrela`** (`/fonts/Distrela.ttf`) — primary display.
- Google Fonts: **Cormorant Garamond** (body/serif), **Tenor Sans** (sans/labels),
  **Italianno** + **Tangerine** (script accents), **Playfair Display** (serif headings).

## 3. Tech stack (decided — matches Invifest)

- **React 19 + Vite** (SPA, no router, no SSR). One scrolling page of section components.
- **GSAP 3 + ScrollTrigger** for all scroll choreography (free for commercial use since
  April 2025). Use `gsap.matchMedia` + `@gsap/react`'s `useGSAP` hook for cleanup.
- **`canvas-confetti`** for the RSVP celebration; custom `<canvas>` for petals.
- **`react-phone-number-input`** for the RSVP phone field.
- **`@vercel/analytics`** + deploy on **Vercel**.
- Assets on a CDN bucket (**Cloudflare R2** like the reference, or Vercel Blob) — keep
  them out of the JS bundle and lazy-load.
- Styling: **plain CSS tokens file + component CSS + inline styles** (no Tailwind), to
  mirror the reference exactly.
- **Do not** add Lenis or Framer Motion — the reference deliberately uses neither.

## 4. Design tokens (from the reference `:root` — use verbatim)

```css
:root{
  /* base */
  --cream:#fdfbf7; --cream-2:#faf5f0; --cream-3:#f2eae1; --white:#fff;
  /* dusty rose / sage family (primary) */
  --sage-pale:#fff9f8; --sage-light:#f7dcda; --sage:#e2b4b1;
  --sage-border:#eac9c7; --sage-dark:#ba7a76; --sage-deep:#8a4f4c;
  /* gold accent */
  --gold:#d4af37; --gold-light:#e8ce73; --gold-pale:#f7efc8;
  /* type */
  --text-dark:#2c2a29; --text-mid:#5a5552; --text-light:#8c8480; --border:#f0e5db;
  /* shadows */
  --shadow:0 24px 64px -12px #8a4f4c1f;
  --shadow-sm:0 8px 24px #8a4f4c0f;
  --shadow-md:0 16px 48px -8px #8a4f4c24;
  /* fonts */
  --font-display:"Distrela","Italianno",cursive;
  --font-body:"Cormorant Garamond",Georgia,serif;
  --font-serif:"Playfair Display",Georgia,serif;
  --font-sans:"Tenor Sans",sans-serif;
  --font-script:"Italianno",cursive;
  --stable-vh:100svh;
}
```
Direction: **soft, airy, elegant** — cream paper, dusty-rose/sage detailing, restrained
gold. The one dark, dramatic moment is the **wine-maroon wax-seal envelope** that opens
into this light world. Restraint everywhere except the envelope reveal and the scratch
card.

## 5. Scene-by-scene spec (mirrors the reference section order)

**Scene 0 — Envelope intro** (`#root` overlay; no GSAP needed, CSS + a little JS)
- Full-screen embossed **wine-maroon paper**, botanical line-art, an **ivory wax seal**
  with the couple's **monogram**, script "**Tap to Reveal**", subtle sparkle.
- On tap/Enter: seal "breaks", envelope opens with a short cinematic transition (fade
  through dark) into Scene 1. Start background music (muted by default) and petals here.

**Scene 1 — Save the Date + scratch reveal** (`#hero`)
- Hero with names, "Save the Date", "Scroll to see magic" cue.
- **Scratch-to-reveal date**: a `<canvas>` scratch card ("Scratch below to reveal our
  wedding date") — guest scratches to uncover the date. Provide a non-canvas fallback for
  reduced-motion / no-pointer.

**Scene 2 — Countdown** (`#countdown-section`)
- Live countdown (days/hours/min/sec) to the wedding datetime. "The Date".

**Scene 3 — Our Story** (`#main-content`, GSAP + ScrollTrigger)
- "Forever Us" / "Our Story". Photos cross-fade and parallax; headline reveals on scroll.
  Timeline scrubbed to scroll progress, pinned where it reads well on mobile.

**Scene 4 — Events / Festivities** (`#events-section`)
- "The Celebrations Unfold" — cards per event (e.g. Sangeet / Wedding / Reception, plus
  your Haldi/Mehndi). Each: date, time, venue, and a **dress-code colour dot**. Stagger in
  on enter.

**Scene 5 — Venue & Travel** (`#venue-section`)
- "The Venue" — Google Maps embed/link (`maps.google.com`), "Get directions", hotel notes.

**Scene 6 — RSVP** (`#rsvp-section`)
- Form: **name**, **international phone** (`react-phone-number-input`), **party size**,
  **food preference** (Vegetarian / Jain / Gluten-Free / No preference), **song request**
  (iTunes search-as-you-type), and a "**marriage advice for us**" message.
- `Send RSVP → Sending… → success` with **confetti** + "yay" sound. Validate client-side,
  no page reload.
- **Backend (pick the lowest-maintenance):** Google Apps Script → Sheet, Formspree, or a
  tiny Vercel serverless function. (The reference only simulates; we wire a real one.)
  Alternative low-tech option: build a `wa.me` deep link with the answers prefilled.

**Footer** (`#footer-section`)
- "Thank You", **family names** / "Warm regards", contact numbers, **WhatsApp share** CTA,
  optional hashtag. Keep the music toggle reachable.

## 6. Animation & quality rules

- One orchestrated moment per section; ease everything (`power2/3`, `expo` for the
  envelope/scratch feel). Avoid scattered effects.
- Wrap every reveal in `prefers-reduced-motion`; provide instant fallbacks.
- `gsap.matchMedia` for mobile vs desktop; kill ScrollTriggers on teardown/resize.
- Lazy-load photos from the CDN; never block first paint. Target a clean mobile Lighthouse.
- Background music + sound effects start only after a user gesture (tap on the seal).

## 7. Project structure

```
wedding-invite/
├─ index.html              # Vite shell: <div id="root">, OG/Twitter meta, font preconnect
├─ vite.config.js
├─ public/
│  ├─ favicon.svg
│  ├─ fonts/Distrela.ttf   # self-hosted display font
│  └─ assets/              # bg-music.mp3, sfx, (or serve these from the CDN bucket)
├─ src/
│  ├─ main.jsx             # createRoot, @vercel/analytics, mount <App>
│  ├─ App.jsx              # section composition + global providers (music, petals)
│  ├─ data.js             # ALL content: names, dates, events, venue, families, photos
│  ├─ sections/
│  │  ├─ Envelope.jsx      # scene 0 — wax-seal open
│  │  ├─ Hero.jsx          # scene 1 — save-the-date + ScratchCard
│  │  ├─ Countdown.jsx     # scene 2
│  │  ├─ Story.jsx         # scene 3 — GSAP timelines
│  │  ├─ Events.jsx        # scene 4 — cards + dress-code dots
│  │  ├─ Venue.jsx         # scene 5 — map + directions
│  │  ├─ Rsvp.jsx          # scene 6 — form, phone, song search, confetti
│  │  └─ Footer.jsx
│  ├─ components/
│  │  ├─ ScratchCard.jsx   # canvas scratch-to-reveal
│  │  ├─ Petals.jsx        # <canvas id="petals-canvas">
│  │  ├─ MusicToggle.jsx   # bg-music play/mute
│  │  └─ SongSearch.jsx    # iTunes Search API field
│  ├─ hooks/useGsap.js     # useGSAP wrapper + matchMedia helpers
│  └─ styles/
│     ├─ tokens.css        # the :root tokens above
│     ├─ fonts.css         # @font-face Distrela + Google Fonts import
│     └─ base.css
```

Keep **all content in `src/data.js`** so copy/photo/venue edits never touch animation code.

## 8. Build order (one PR per phase)

1. **Scaffold** — Vite + React 19, tokens/fonts, `index.html` meta (WhatsApp OG image),
   `@vercel/analytics`. Empty section shells driven by `data.js`.
2. **Envelope + Hero + ScratchCard** — scene 0 open transition, save-the-date, scratch
   reveal, petals canvas, music toggle (muted default). Verify touch + keyboard.
3. **Scroll story** — wire GSAP/ScrollTrigger, build Countdown + Our Story.
4. **Events + Venue** — content-driven cards with dress-code dots; map embed.
5. **RSVP + footer** — phone input, food prefs, iTunes song search, confetti + sfx; choose
   and wire the real backend; WhatsApp share + footer.
6. **Polish** — reduced-motion, mobile breakpoints, Lighthouse, real photos on the CDN,
   audio licensing, OG/meta final check (most guests open via WhatsApp).
7. **Deploy** — Vercel.

## 9. Open variables to confirm

- Couple names + families + exact date/time + **monogram** for the wax seal.
- Whether to keep your wedding's cultural elements from the original brief (Ganesha
  invocation `॥ श्री गणेशाय नमः ॥`, Hindi via `Tiro Devanagari Sanskrit`, Punjabi/Gurmukhi)
  layered onto the Invifest structure, or go fully Invifest-style.
- Event list + venues (Tricity halls), and dress-code colours per event.
- RSVP backend: Apps Script / Formspree / serverless / WhatsApp deep link — sent where?
- Background-music track (licensing) + whether to keep the iTunes song-request feature.
- WhatsApp share preview image (1200×630) + title.

## 10. Git workflow

- Branch prefix `sandeep/` (e.g. `sandeep/scaffold`, `sandeep/envelope-hero`).
- One phase per branch/PR; commit per logical scene. Content lives in `src/data.js`.

## 11. First message to send Claude Code

> Build phase 1 only. Scaffold a **Vite + React 19** SPA (no router), add `tokens.css` +
> `fonts.css` (self-host `Distrela.ttf`, import Cormorant Garamond / Tenor Sans / Italianno
> / Tangerine / Playfair Display), wire `@vercel/analytics`, and set up `index.html` with
> WhatsApp-ready OG/Twitter meta. Create empty section components driven by `src/data.js`
> in the order: Envelope → Hero → Countdown → Story → Events → Venue → Rsvp → Footer. No
> GSAP yet. Branch: `sandeep/scaffold`. Show me the result before phase 2.
