# Aarav & Diya — Wedding Invitation

A single-page, mobile-first digital wedding invitation (React 19 + Vite, GSAP,
no backend). One site serves **every guest variant** — you control which
functions each guest sees from a private builder and share a link.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the built site
```

## Editing content — only one file

All copy, names, dates, venues, phone numbers and functions live in
[`src/data.js`](src/data.js). Every placeholder is marked `⟵ EDIT`. You never
need to touch animation or layout code.

Things to fill in:

- **Couple & monogram** — `couple` (names, wax-seal initials, hashtag).
- **Wedding date/time** — `wedding.dateTimeISO` (drives the countdown + hero).
- **Families** — `families.bride / groom / joint` (hosting line, sign-off, contact numbers).
- **Functions** — `events[]`: each has a `side` (`bride` / `groom` / `together`),
  date, time, `venue`, and a dress-code colour `dot`. Two Mehndis are already
  split by side.
- **WhatsApp number** — `config.rsvpWhatsApp` (digits + country code, no `+`).
  RSVPs and the share CTA go here.
- **Optional** — background music (`public/assets/bg-music.mp3`), the
  `public/og-image.jpg` WhatsApp preview (1200×630), and a self-hosted
  `public/fonts/Distrela.ttf` (uncomment the block in `src/styles/fonts.css`).

## Sending different guests different functions

Open the **host control panel** at:

```
http://localhost:5173/?host        (or  https://your-site/?host  once deployed)
```

There you pick the guest's functions (checkboxes or a quick preset), the hosting
side, optional sections, and an optional guest name. The page previews live, and
you get a **shareable link** + a **Share on WhatsApp** button. Send each guest
their own link.

> The `?host` panel is hidden, not secured — anyone with the URL (or who edits
> the query string) can change the view. That's fine for a wedding invite; don't
> put anything private behind it.

### The link format (you rarely need this — the panel builds it)

| Param | Meaning | Example |
|---|---|---|
| `side` | hosting voice + default functions | `?side=bride` |
| `preset` | a named set | `?preset=shagun-wedding` |
| `fns` | exact functions (ids from `data.js`) | `?fns=haldi,wedding` |
| `to` | personalised greeting | `?to=Sharma%20Family` |
| `countdown` `story` `venue` `rsvp` `music` | set to `0` to hide | `?rsvp=0` |

A bare URL with no params = the full joint invitation, everything on.

Presets: `all`, `wedding`, `shagun-wedding`, `bride`, `groom`.

## Deploy

Built for **Vercel** (static SPA + `@vercel/analytics`). `npm run build` and
deploy `dist/`, or point Vercel at the repo (framework preset: Vite).
