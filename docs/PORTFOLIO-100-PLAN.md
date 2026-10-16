# Portfolio 78 → 100 plan — October 16, 2026

Starting score: **78 / 100**. Every step below targets a specific deduction from
that review. Steps are done **one at a time**. After each one, the change is pushed
to `pro`, so it shows up on https://pro-portfolio-mocha.vercel.app. The next step
starts only after Manoj confirms the live result.

Legend: ⬜ todo · 🟨 in review · ✅ confirmed · ❓ needs a decision from Manoj first

---

## What "100" means

Taste is subjective, so "100" is defined as a checklist that can be verified:

- [ ] Every claim on the site matches the linked project, repo, or credential
- [ ] No placeholder, stale, or wrong default values (time zone, tags, copy)
- [ ] Every 3D/visual asset shows the real work, not AI imagery
- [ ] Lighthouse (mobile): Performance ≥ 90, Accessibility 100, Best Practices 100, SEO 100
- [ ] Every interactive element works with the keyboard and has a visible focus state
- [ ] Shared links (LinkedIn / X / LINE) show a proper preview card
- [ ] A recruiter sees name, role, and best work within 5 seconds, with no forced intro
- [ ] One clear audience and call to action across hero, projects, and contact
- [ ] Each project explains its problem, Manoj's role, and the result
- [ ] CSS is in a structure Manoj can maintain (no stack of patch files)

---

## Phase A — Accuracy and trust (no decisions needed)

### Step 1 — Make project card tags match the real tech stacks ✅
**Problem:** The cards claim tools that the detail modals (and the real code) don't use:
- Everest card: *Figma · Webflow* → real stack: HTML5, Tailwind CSS, JavaScript, Vercel
- Personal Finance card: *iOS · Android · Figma* → real stack: React, Vite, Tailwind CSS, Gemini AI
- Salary Tracker card: *iOS · Android · Figma* → real stack: React, Vite, Tailwind CSS, Recharts

**Fix:** Replace the chips in `index.html` (Selected Work cards) with the technologies
listed in each project's `stack` data. Keep the `data-cat` filter categories unchanged
so the All / Web / Apps / UI/UX filters still behave the same.
**Verify:** On each card, compare the chips with the "Tech stack" list in its modal.
They must match.

### Step 2 — Default the footer clock to Tokyo time ✅
**Problem:** The HTML placeholder says `00:00 AM GMT+1`. It flashes before JS runs,
and it's what crawlers and no-JS visitors see.
**Fix:** Check that the clock script formats with `timeZone: 'Asia/Tokyo'` (so the
time is right wherever the visitor is). Change the placeholder to `JST`.
**Verify:** Footer shows the current Tokyo time with the label "JST" / "GMT+9",
including with the browser's time zone set to something else.

### Step 3 — Social sharing and SEO metadata ✅
**Problem:** `og:image` is a relative path, which LinkedIn and X often fail to load.
There is no `og:url`, canonical link, or structured data, and the preview image
is a 512px square icon.
**Fix:**
- Create a 1200×630 `assets/images/og-cover.jpg` (portrait + name + role, site palette)
- Absolute URLs for `og:image` / `twitter:image`, plus `og:url`, `og:site_name`,
  `og:locale` (+ `og:locale:alternate` ja_JP), `<link rel="canonical">`
- JSON-LD `Person` schema (name, jobTitle, address Tokyo, sameAs → LinkedIn/GitHub)
**Verify:** Run the LinkedIn Post Inspector and an OG preview checker. The preview card
should show the new image, title, and description.

---

## Phase B — Positioning and content (❓ decisions needed)

### Step 4 — One audience, one call to action ✅ (decision: a — employers/recruiters)
**Problem:** The hero says "robotics and simulation engineer". The contact form
offers "New website / Front-end help", which reads like a freelancer's site.
**Decision:** Who is the site for?
- (a) Employers and recruiters in robotics, simulation, and 3D (recommended, matches Future Goals)
- (b) Freelance clients
- (c) Both, with employers first
**Fix:** Rewrite the contact headline, topics (e.g. "Job opportunity · 3D / simulation
project · Collaboration · Just saying hi"), and hero CTA wording to fit. Update EN + 日本語.

### Step 4b — Accent colour consistency ✅ (decision: golden theme; hero burgundy lettering stays)
**Problem:** The site accent is burgundy (`#9f1239`), but some sections still use a
scoped amber/orange palette: contact icons + "Send message" button (`rgb(184,90,8)`,
`#e8881d`), the mobile "MP" logo, and the Language Credentials block (`--lc-a:#df851d`).
That breaks the single-accent system that replaced orange in August.
**Decision:** Make everything burgundy (recommended), or keep orange only on the
JLPT/TOEIC credential cards as an intentional "certificate gold".
**Fix:** Point the scoped colours at `var(--accent)` (light + dark), screenshot each section.

### Step 5 — Employer line ✅ (default used: description; swap in real name if allowed)
**Problem:** "Japanese Engineering Company · Tokyo" reads like the employer is hidden on purpose.
**Decision:** Can the company be named? If not, use a descriptive line, e.g.
"Industrial automation & DX company · Tokyo".
**Fix:** Update the Experience card (EN + 日本語).

### Step 6 — Contact privacy ✅ (decision: a — keep email, form, LINE, LinkedIn, GitHub)
**Problem:** Phone number, WhatsApp, LINE, and Telegram are all public, which invites
spam and scraping.
**Decision:** Keep which channels? Recommended: email + contact form + LinkedIn + GitHub.
Move LINE/WhatsApp behind "available on request".
**Fix:** Remove or obfuscate the chosen channels. Keep the layout balanced.

### Step 7 — JLPT N1 presentation ✅ (decision: a — B2 is on the report; score 128/180)
**Problem:** "N1 → CEFR B2" can look like it undersells N1 at a glance.
**Decision:** Is B2 printed on the official score report? If yes, keep it but
lead with the N1 score. If no, remove the CEFR line.
**Fix:** Adjust the JLPT card. Optionally add the total score (e.g. "N1 · 1xx/180").

---

## Phase C — Proof of work

### Step 8 — Blender Work: trim to the two strongest models ✅
**Decision (Manoj):** keep the AI previews (they match the models). Keep only Delivery Truck +
Industrial Robot Arm; remove Cardboard Box, Roller Conveyor, Roll Cage to shorten the page.

~~Original idea: replace AI previews with real renders~~
**Problem:** The section says "AI-styled previews". On a 3D portfolio this makes
visitors doubt the real work.
**Fix:** Render each of the 5 GLBs (truck, robot arm, box, conveyor, roll cage) in
Blender with a consistent studio setup: neutral backdrop matching the site palette,
3-point light, same camera focal length. Export a WebP at 1672×941 plus a 960w version.
Optionally add a wireframe overlay toggle on hover to show topology.
Remove the "AI-styled previews" disclaimer.
**Verify:** Every card image visibly matches what the 3D inspector shows.

### Step 9 — Optimise the GLB files with GLB Forge ⏭️ skipped (Manoj)
**Problem:** (box/cage removed in Step 8) Truck = 7.7 MB with 45 textures for 7,876 triangles.
Heavy downloads, and it undercuts the GLB optimisation tool shown on the same page.
**Fix:** Run the models through GLB Forge / glTF-Transform. Resize textures (≤1024 or
2048 for the truck), apply WebP/KTX2 texture compression, and meshopt where it's safe.
Update the triangle/size numbers in `models.json`. Add a small "Optimised with GLB Forge:
7.7 MB → x MB" note, which turns this into proof that the tool works.
**Verify:** Models look the same in the inspector. Sizes drop by at least 60%.

### Step 10 — Case-study depth for each project ✅
**Problem:** The modals list features and stack, but not problem → role → result.
**Fix:** Add three short lines per project modal (EN + 日本語):
**Problem**, **What I did**, **Result** (with numbers where possible, e.g.
"cut a 120 MB model to 9 MB so it loads in UE5 without hanging").
**Decision during this step:** Manoj supplies or confirms any real numbers. Nothing gets made up.

---

## Phase D — Performance, UX, and accessibility

### Step 11 — Preloader: fast and respectful ✅
**Fix:** Show the "hello" intro only on the first visit per session (sessionStorage),
cap it at about 1.2 s, skip it entirely for `prefers-reduced-motion`, and keep "Skip intro".
**Verify:** Reloading the page shows content immediately.

### Step 12 — Performance pass ✅
**Fix:**
- Merge the two Google Fonts requests (Archivo Black + Playfair Display) into one, or self-host them
- `defer` GSAP / ScrollTrigger / Lenis; check that nothing blocks the first render
- Hero portrait: serve a 900w/1200w `srcset` instead of always 1800px
- Check that the Unreal videos and GLBs load only on interaction (already mostly true)
**Verify:** Lighthouse mobile Performance ≥ 90, LCP < 2.5 s, CLS < 0.05.

### Step 13 — Accessibility pass ✅
**Known issue:** Education cards use `onclick` on an `<article>` without
`role="button"`, `tabindex`, or key handlers, so keyboard users can't open them.
**Fix:** Make every clickable element keyboard-operable with a visible `:focus-visible`
style. Check colour contrast in light and dark modes, check that the modals trap and return
focus, and keep `lang` in sync when switching to 日本語.
**Verify:** Lighthouse Accessibility 100. Every action works with Tab / Enter / Esc.

---

## Phase E — Maintainability and finish

### Step 14 — Consolidate CSS ✅ (re-scoped: render-critical CSS was inlined in Step 12; this step removes dead code)
**Problem:** Large inline `<style>` + `refinements.css`, `mobile-refinements.css`,
`mobile-menu.css`, `preloader.css`, `unreal-projects.css`, `blender-work.css`,
`future-goals.css`, all layered as patches.
**Fix:** Move the inline CSS into `styles/` files organised by section. Fold each
"refinements" override into the rule it overrides. Screenshot before and after at
375 / 768 / 1440 px in light and dark modes. Visuals must stay the same.

### Step 15 — Repo tidy-up 🟨
**Fix:** Handle the untracked files (`GRADUATION-EDIT.md`, exports PNG). Move working
notes into `docs/`. Update the README (stack, deploy rule: push to `pro`).

### Step 16 — Final audit and re-score ⬜
Go through the "What 100 means" checklist item by item, run Lighthouse on mobile and
desktop, test real phones (iOS Safari + Android Chrome), and re-score.

---

## Phase F — Navigation, order and mobile density (added Oct 16 at Manoj's request)

- **F1 Nav jumps:** one `scrollToSection()` aligns every section top to the fixed header's bottom (desktop nav, hero buttons, mobile menu, direct #links). Before: 14–16px of the previous section showed on most jumps. Desktop nav: + Unreal Engine, − Home (logo goes home).
- **F2 Order:** section order kept (Work → Unreal → Blender → About → Goals → Contact). Inside Selected Work, the team-used GLB tools now lead, ahead of personal web projects.
- **F3 Mobile density:** the Sept mobile pass had enlarged everything (card titles 23–28px, all copy 16px/1.65, tall tiles/frames). Retuned in place to a mobile scale (section 30 / card title 20 / body 15px), slimmer card padding, half-height JLPT/TOEIC tiles, shorter app/photo frames, credential IDs hidden on phones. Inputs stay 16px; tap targets stay ≥44px; desktop pixel-identical. Page: 22.7 → 19.4 screens.

## Progress log

| Step | Status | Commit | Notes |
|---|---|---|---|
| 1 | ✅ | 304090a | Chips now mirror each modal's stack |
| 2 | ✅ | 2c7d394 | Clock pinned to Asia/Tokyo; label "Tokyo Time / 東京時間" |
| 3 | ✅ | d567b64 | og-cover.jpg 1200×630, absolute OG/Twitter tags, canonical, JSON-LD Person, robots.txt + sitemap.xml |
| 4 | ✅ | 3845c41 | Contact copy, topics, placeholder rewritten for employers (EN + 日本語); aria-pressed on topic pills |
| 4b | ✅ | e88a987 | v1 muted antique gold rejected ("not golden enough"); v2: saturated gold text #8f6b0a, metallic gradient fills, black-and-gold dark mode |
| 5 | ✅ | 9d35b3c | "Industrial Software & DX Company · Tokyo" / 産業向けソフトウェア・DX企業 · 東京 |
| 6 | ✅ | 196f88b | Phone, WhatsApp, Telegram removed; LinkedIn card + GitHub icon added; LINE kept |
| 7 | ✅ | 7f7f72a | Result tile → Total Score 128 / 180 (Passed); CEFR B2 labelled "JLPT official guide" |
| 8 | ✅ | 348d3c7 | 3 cards + their GLBs/previews/metadata removed (−3.6 MB GLB); tests updated to 2 cards |
| 9 | ⏭️ skipped | — | Truck GLB left at 7.7 MB by choice |
| 10 | ✅ | fea6f1a | Problem / What I did / Result in all 5 modals (EN + 日本語), facts supplied by Manoj |
| 11 | ✅ | ddf7964 | Intro once per session, skipped on deep links; ~3.4 s → ~1.7 s; reload 0.24 s |
| 12 | ✅ | d7f8f89, 20a2ab0, 6030486, 179e3d1 | Mobile Lighthouse 68 → 86 median (81–93), desktop 99. Self-hosted fonts, srcset images, vercel.json caching, inlined critical CSS + intro, async below-fold CSS, motion libs after idle, no LCP fade. Weight 1.35 MB → ~0.9 MB |

> Measuring note: ESET antivirus on Manoj's work PC intercepts browser HTTPS ("ESET SSL Filter CA") and strips compression, so Lighthouse in Edge is skewed. Use chrome-headless-shell (not intercepted) against the live URL.
| 13 | ✅ | 7890e00 | Lighthouse a11y 100 (mobile+desktop, light+dark). Real buttons on project/education cards, dialog focus in/trap/return, image viewer role=dialog + button close, skip link, focus ring, contrast fixes |
| 14 | ✅ | c2aced7 | Removed 81 dead CSS rules (30 unused classes), dead text-modal/timeline/magnetic JS, 116 unused i18n entries, a stray `}`; −27 KB HTML. 20-state screenshot diff: identical |
| F1–F3 | ✅ | 7956a60, 65851c2, (this commit) | Nav lands exactly; GLB tools first; mobile density pass |
| F4–F8 | ✅ | 64e9267 … abea24e | Animated menu icons, mobile popup scale, 2×2 certifications, no leftover focus ring after taps, popups open at top |
| 15 | 🟨 in review | (this commit) | Notes → docs/, README rewritten for current site + new screenshot, .vercelignore (16 MB of source-only images, notes, tests no longer public) |
