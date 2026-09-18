# Unreal Engine previews

Short silent previews of the user's original recordings. The originals remain in
the user's Videos folder. Full videos are linked from each card to the supplied
LinkedIn posts; they are not embedded or downloaded by the portfolio.

| Project | Original MP4 | WebM / VP9 | MP4 / H.264 fallback |
| --- | ---: | ---: | ---: |
| Darts Game | 27.70 MB | 1.73 MB | 3.33 MB |
| Warehouse Simulation | 34.71 MB | 3.97 MB | 6.12 MB |

Sizes use decimal MB. Both outputs retain 1920 × 1080 at 30 fps and the full
approximately 16-second excerpt. Audio is omitted for silent inline previews.
The darts recording's bottom 48 pixels (Windows taskbar) were removed and the
remaining image centered with 24-pixel letterboxing, without stretching it.
Warehouse captions are retained.

## Encoding

FFmpeg, `yuv420p`, no audio (`-an`), original resolution and frame rate:

- WebM: `-c:v libvpx-vp9 -b:v 0 -crf 30 -row-mt 1 -cpu-used 3`
- MP4: `-c:v libx264 -preset slow -crf 21 -movflags +faststart`
- Darts filter: `crop=1920:1032:0:0,pad=1920:1080:0:24:black,setsar=1`
- Warehouse filter: `setsar=1`

MP4 metadata precedes media data for progressive playback. Video sources are
attached only on intentional hover (180 ms) or explicit play, and the markup
uses `preload="none"`. The player prefers VP9 where supported and retries MP4
on a WebM media error. Responsive WebP posters are lazy-loaded separately.

Hover is disabled for touch/coarse pointers, reduced motion, and Save-Data.
Explicit playback enables native controls. Pointer exit restores the cover for
automatic previews; offscreen cards and hidden tabs stop all playback. Direct
MP4 links remain usable without JavaScript or if playback fails.

## Validation

- All four outputs decoded successfully; 1080p, 30 fps, duration and absence of audio verified.
- MP4 atom order verified for fast start.
- Compressed darts and warehouse frames inspected visually.
- At 5 fps sampling, WebM SSIM against the original (with the same darts crop)
  was 0.9934 for darts and 0.9884 for warehouse. This is a compression check,
  not a guarantee of identical perceived quality.
- Player lifecycle tests: `node --test --test-isolation=none tests/unreal-projects.test.cjs`.
- Browser layout/playback QA was unavailable in the connected environment.

See [cover artwork and prompts](../../images/projects/unreal-engine/ARTWORK.md).
