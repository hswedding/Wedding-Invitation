# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev        # Vite dev server → http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the built dist/ (--host)
```

There is no test runner, linter, or type checker configured — `dev`, `build`, and `preview` are the only scripts. Verify changes by running the dev server and viewing the page.

## What this is

A single-page, mobile-first digital wedding invitation. React 19 + Vite, GSAP + Lenis for animation/scroll, **no backend and no router**. One deployed site serves every guest variant; which sections and functions a guest sees is encoded entirely in the URL query string. Built to deploy as a static SPA on Vercel (`@vercel/analytics` is injected in `main.jsx`).

## Architecture

**URL is the state.** `src/lib/config.js` is the core: `parseInvitation(search)` turns the query string into an `invite` config object; `buildQuery`/`buildShareUrl` do the reverse for the host panel. There is no store or context — `src/hooks/useConfig.js` reads the URL into React state and re-parses on `popstate` and a custom `urlchange` event. The host control panel live-previews by calling `applyQuery()` (which does `history.replaceState` + dispatches `urlchange`) — so URL edits reflow the whole page without reload.

Query params (see the header comment in `src/lib/config.js` and README for the full table): `side` (bride/groom/joint → hosting voice + default functions), `fns` (csv of event ids), `preset`, `to` (guest name), `countdown|story|venue|rsvp=0` (hide section), and bare `host` (presence opens the control panel). A param-less URL = full joint invitation, everything on.

**Content vs. code separation is deliberate.** All copy, names, dates, venues, phone numbers, events, presets, and global config live in `src/data.js` — placeholders are marked `⟵ EDIT`. Section/animation components read from it and should not hardcode content. Event `id`s in `data.js` are the vocabulary for the `fns` param and presets; renaming or removing one silently invalidates existing shared links. `sanitiseIds` drops unknown ids and re-sorts to canonical chronological order (`event.order`), so unknown/stale ids fail closed rather than erroring.

**Render flow** (`src/App.jsx`): an `Envelope` gate covers the page and locks `body` scroll until opened (skipped when `isHost`, so the panel sees the page). On open, a `Lenis` smooth-scroll instance is created and synced to GSAP `ScrollTrigger` via `gsap.ticker`; it is exposed as `window.__lenis` — **programmatic scrolls must go through `lenis.scrollTo`**, not `window.scrollTo`, or they fight the smooth-scroll loop. Sections are conditionally mounted from `invite.sections`. `useReducedMotion` disables Lenis and GSAP effects for users who prefer reduced motion — honor it in any new animation.

**Shared GSAP instance.** Always import gsap/ScrollTrigger/useGSAP from `src/lib/gsap.js` (plugins are registered there once) — never import from `gsap` directly in components.

**Directory map:** `src/sections/` = full-width page scenes (Hero, Countdown, Story, EventFilms, Venue, Rsvp, Footer, Envelope, ControlPanel). `src/components/` = reusable pieces (Petals, ScratchCard, Icons). `src/styles/` = plain CSS; `base.css` `@import`s `tokens.css` (design tokens/CSS variables) and `fonts.css`, and `main.jsx` also imports `components.css`. Icons are keyed by string in `Icons.jsx` and referenced by name from event data.

## External integrations (no backend)

- **RSVP and sharing go through WhatsApp deep links** built in `config.js` (`buildRsvpWhatsApp`, `buildWhatsAppShare`) — the RSVP form does not POST anywhere; it opens a `wa.me` link to `config.rsvpWhatsApp`. There is no server to receive submissions.
- **Media** lives in `public/` (`/videos/*.mp4` referenced by event `video` fields, `og-image.jpg`).

## Platform notes

Windows + Vite: `vite.config.js` ignores `**/.vs/**` and `**/.git/**` in the dev watcher — Visual Studio's `.vs` index locks `.vsidx` files and crashes the watcher (EBUSY) otherwise. `cssCodeSplit` is off (single CSS bundle) and build target is `es2020`.
