# Manoj Poudel — Portfolio

Personal portfolio of **Manoj Poudel** — Software Engineer, Mobility & Robotics, based in Tokyo.

Design language: a graphite landing section with burgundy accents and Archivo Black backdrop type,
followed by warm ivory content sections with orange accents and Playfair Display headings,
supported by Satoshi body text and IBM Plex Mono labels,
a full-bleed portrait hero, consistent quiet card surfaces, and GSAP + Lenis motion.

## Tech

- Static site (`index.html` and `refinements.css`) — no build step
- Self-hosted variable fonts (`/fonts`, woff2); imagery as WebP
- GSAP + ScrollTrigger + Lenis (via CDN) for motion
- Fully responsive; respects `prefers-reduced-motion`

## Run / Deploy

Open `index.html`, or deploy the folder as-is to **Vercel / Netlify / GitHub Pages**
(framework preset: **Other**, no build command, no output directory).

## Structure

```
index.html      — markup, base styles, and scripts
refinements.css — shared typography, spacing, cards and responsive refinements
DESIGN-REFINEMENT.md — design review, image prompts and output-resolution details
assets/
  icons/        — favicon, Apple touch icon and PWA icons
  logos/        — technology and certification SVG logos
  images/
    portraits/  — portrait and About photography
    projects/   — current optimized project covers
    education/  — college and language-school photography
    exports/    — 3840 × 2160 upscaled artwork PNGs
    archive/    — previous covers and source variants
manifest.json   — PWA manifest
fonts/          — Clash Display, Satoshi, IBM Plex Mono (woff2)
```

See [the asset guide](assets/README.md) for filenames and archive mappings.

© Manoj Poudel.
