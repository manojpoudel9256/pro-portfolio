# Motion & colour refinement plan — October 26, 2026

Skills applied: **motion-design** (one motif, a lead action per moment, purposeful
timing and reading holds), **emilkowalski-motion** (quick, useful UI motion;
transform/opacity only; one motion language; reduced-motion fallbacks) and
**impeccable-design-polish** (fix the highest-impact issues; remove generic tells).

Fixed constraints: the burgundy **SOFTWARE ENGINEER** lettering and the portrait
stay exactly as they are. The lettering also stays static, because it is the LCP
element (Step 12). Everything else in the hero may change.

## Audit (before)

| Area | Finding |
|---|---|
| Colour | Hero + nav use a cool grey off-white (`#f2f1ee`); every section below is warm champagne cream (`#fcf8ee`): a visible seam. Dark mode: cool `#0f0f11` against warm `#12100b`. |
| Hero copy | "Hey there! I'm a Software Engineer…" repeats the giant headline; "// VIEW PROJECTS →" reads like a code comment, not a primary action; the right-hand list has no label or order. |
| Motion language | 7+ different durations (0.35–1 s) and easings; reveals move 40–90 px; education cards slide in sideways; the footer fade is scrubbed to scroll position (it can sit half-visible). |
| Feedback | No press feedback on buttons; filtering snaps instantly; popups only fade; the nav's active pill jumps between links. |

## Motion language (one system)

| Token | Value | Used for |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | arrivals, reveals, hover |
| `--ease-in` | `cubic-bezier(0.55, 0, 1, 0.45)` | exits (closing popups) |
| `--dur-press` | 120 ms | press feedback |
| `--dur-fast` | 180 ms | hover, small controls |
| `--dur-base` | 260 ms | state changes (popups, filters, nav) |
| `--dur-reveal` | 640 ms | scroll reveals, hero entrance |

Motif: **rise from a baseline**. Elements arrive with a short 12–24 px rise and a
fade, and headings reveal from a mask line, echoing the hero lettering. No
bounce: this is a precise-instrument portfolio, not a playful one.

## Steps

1. **Motion tokens:** define the system above in the foundation styles and use
   it everywhere below.
2. **Colour harmony:** move the hero and nav to the same warm ivory family as the
   sections, and dark mode to the same warm black. Burgundy lettering unchanged.
   Verify AA contrast.
3. **Hero small type + entrance:** eyebrow (name · Tokyo), a one-line value
   statement instead of "Hey there!", a solid primary button + underline link,
   a numbered focus list (EN + 日本語). A choreographed entrance that starts as
   the intro curtain lifts: portrait leads, copy follows, under 1.2 s, all CSS.
4. **Scroll reveals:** one batched reveal (24 px rise, fade, 70 ms stagger) for
   cards on desktop; mask-line reveal for section headings; remove the sideways
   education slide and the scrubbed footer. Phones keep content static (as now).
5. **Micro-interactions:** press feedback on buttons, arrow nudges, a growing
   underline, unified card hover timing, and an animated filter transition.
6. **State transitions:** a sliding active indicator in the desktop nav; popups
   rise and scale in, and leave faster with ease-in; the 3D inspector opens the
   same way.
7. **QA + score:** reduced motion, keyboard, phone layouts, Lighthouse, final score.

## Progress

| Step | Status | Commit | Notes |
|---|---|---|---|
| 1–2 | ✅ | (this commit) | Motion tokens; hero/nav moved to the warm ivory/black of the sections — seam gone; contrast 7.2–17:1 |
| 3 | ✅ | (this commit) | Hero small type redesigned (eyebrow, value statement, solid primary button, growing-underline link, numbered focus list; EN+JA). CSS entrance starts as the intro curtain lifts, ~1.1 s, lettering static |
| 4 | ✅ | (this commit) | One batched reveal (24px rise, 70ms stagger, 640ms) for all cards; mask-line wipe for section headings; sideways education slide and scrubbed footer removed; desktop only; verified nothing stays hidden |
| 5 | ✅ | (this commit) | Press feedback (97% dip, WAAPI on scale) on 24 control types; arrow nudges; one 260ms card hover; filter state transition (260ms, 40ms stagger) |
