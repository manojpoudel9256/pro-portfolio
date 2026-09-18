# Portfolio assets

Use lowercase, descriptive, hyphen-separated filenames. Paths in `index.html` and `manifest.json` are relative to the project root.

| Folder | Contents |
| --- | --- |
| `icons/` | Favicon, Apple touch icon, and PWA icons |
| `logos/` | Technology and certification SVG logos |
| `images/portraits/` | Manoj's portrait and retained About image |
| `images/projects/` | Optimized WebP project covers used by cards and dialogs |
| `images/projects/unreal-engine/` | Darts and warehouse covers, responsive variants, and generation prompts |
| `videos/unreal-engine/` | On-demand 1080p WebM previews and MP4 fallbacks |
| `images/education/` | College and Japanese-language academy photographs |
| `images/exports/` | Full-size 4K upscaled GLB artwork PNG exports |
| `images/exports/unreal-engine/` | Native-resolution generated PNG cover masters |
| `images/archive/` | Previous covers and source variants retained for reference |

The website uses the lightweight project covers, not the large exports or archived variants. All images were moved without changing their contents.

The Japanese-language education card and enlarged view use `images/education/hokkaido-japanese-language-academy-sapporo-graduation.jpg`. This is an unchanged copy of the supplied graduation photo: 768 × 1024 pixels, 210,070 bytes, with no resizing or recompression. The previous photo is retained in `images/archive/hokkaido-japanese-language-academy-previous.webp`.

## Photo favicon

The favicon uses the supplied original portrait, cropped around the face and resized without AI changes.
Browser PNGs are 16, 32, and 48 pixels (about 1.1, 1.7, and 2.6 KB), with a 5.5 KB multiresolution ICO fallback.
The 180-pixel Apple icon and 192/512-pixel install icons use the same portrait. The browser favicon links use only the tiny versions.
Icon URLs include a version query so the previous icon is not reused from cache.

## Active project covers

- `images/projects/everest-travel.webp`
- `images/projects/personal-finance-app.webp`
- `images/projects/salary-tracker.webp`
- `images/projects/glb-analyzer.webp`
- `images/projects/glb-optimizer.webp`
- `images/projects/unreal-engine/darts-game.webp`
- `images/projects/unreal-engine/warehouse-simulation.webp`

See [Unreal Engine media notes](videos/unreal-engine/README.md) for sizes,
encoding settings, playback behavior, and validation.

## Archived names

| Previous name | New name in `images/archive/` |
| --- | --- |
| `education/hokkaido-japanese-language-academy.webp` | `hokkaido-japanese-language-academy-previous.webp` |
| `budget.webp` | `budget-legacy.webp` |
| `travel.webp` | `travel-legacy.webp` |
| `glbanalyzer.webp` | `glb-analyzer-legacy.webp` |
| `glboptimizer.webp` | `glb-optimizer-legacy.webp` |
| `GLB_Analyzer.png` | `glb-analyzer-v1.png` |
| `GLBAnalyzer2.png` | `glb-analyzer-v2.png` |
| `Glb_Optimizer.png` | `glb-optimizer-v1.png` |
| `GLBOptimizer2.png` | `glb-optimizer-v2.png` |
