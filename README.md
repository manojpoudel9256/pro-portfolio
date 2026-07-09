# Manoj Poudel — Portfolio

Personal portfolio of **Manoj Poudel** — Software Engineer, Mobility & Robotics, based in Tokyo.

Design language: **Precision Graphite** — a near-monochrome ivory/graphite palette with a
single signal-orange accent, variable display type (Clash Display / Satoshi / IBM Plex Mono),
a full-bleed portrait hero, cinematic glassmorphism work cards, and GSAP + Lenis motion.

## Tech

- Single-file static site (`index.html`) — no build step
- Self-hosted variable fonts (`/fonts`, woff2); imagery as WebP
- GSAP + ScrollTrigger + Lenis (via CDN) for motion
- Fully responsive; respects `prefers-reduced-motion`

## Run / Deploy

Open `index.html`, or deploy the folder as-is to **Vercel / Netlify / GitHub Pages**
(framework preset: **Other**, no build command, no output directory).

## Structure

```
index.html      — markup, styles, and scripts (single file)
manifest.json   — PWA manifest
fonts/          — Clash Display, Satoshi, IBM Plex Mono (woff2)
*.webp          — optimised imagery
icon-*.png      — app / favicon icons
```

© Manoj Poudel.
