# Blender Work

The Blender showcase sits after the Unreal Engine projects and before About.
It follows the portfolio's warm ivory and gold content theme, with English and
Japanese copy, dark mode, and stacked phone cards. Both navigation menus link
directly to the section.

## Models and previews

The five supplied models are Delivery Truck, Industrial Robot Arm, Cardboard Box,
Roller Conveyor, and Roll Cage. Their GLB files are unchanged, with normalized
filenames under [`assets/models/blender/`](assets/models/blender/README.md).

Every preview was generated using a rendered view of its actual model as the
image reference. The artwork presents the geometry in a realistic ivory studio
setting; the live inspector always displays the original GLB. The page labels
the previews as AI-styled artwork.

The image generator returned 1672 × 941 PNGs. The **3840 × 2160 WebP exports are
upscaled**, not native 4K generations. Responsive 768 × 432 and 1536 × 864 copies
avoid unnecessary 4K downloads on smaller screens. The 768px images range from
9–36 KB; 4K exports range from 178–549 KB. See the
[artwork prompts and conversion notes](assets/images/projects/blender/ARTWORK.md).

## Inspector

- Drag to orbit, scroll or pinch to zoom, and right-drag or use two fingers to pan.
- Keyboard arrows orbit; `+` / `-` zoom; `Home` resets the camera.
- Studio and dark-studio lighting use environment reflections, soft shadows,
  tone mapping, and the assets' original PBR materials.
- Wireframe and optional automatic rotation expose the model's geometry.
  Automatic rotation is off initially and disabled under reduced motion.
- Statistics show triangles, exported vertices, meshes, materials, textures,
  GLB file size, and exported dimensions.

GLB geometry is triangulated. Triangle counts are not the original Blender
quad/ngon counts, and exported vertices may include UV or normal splits.
Dimensions describe the exported scene in meters, rather than independently
verified product dimensions. Statistics are derived from the GLBs by
`assets/models/blender/audit_metadata.py`.

`blender-work.js` controls the native dialog, translation, loading/error states,
and focus/scroll restoration. `blender-viewer.js` is imported only when the first
inspector opens. It loads the selected GLB and self-hosted Three.js r180 modules,
with no runtime CDN dependency. The initial page loads only the small metadata
file and responsive preview images.

The renderer fits the camera to each model and viewport. It caps pixel density,
renders on demand when idle, and releases textures, geometry, event handlers,
and the WebGL context when the inspector closes. Pending downloads are aborted;
network failures and context loss present a retry action. Background page
scrolling pauses while the dialog is open, and focus returns to the trigger.

## Browser verification

Serve the repository locally on port 4173. The optional checks require Playwright
with Chromium and WebKit installed; expose it through `NODE_PATH` if installed
outside this repository. Test artifacts default to `../portfolio-blender-review`.

```powershell
$env:QA_MODE = 'desktop'
node tests/blender-work.browser.cjs
$env:QA_MODE = 'mobile'
node tests/blender-work.browser.cjs
$env:QA_BROWSER = 'webkit'
node tests/blender-work.browser.cjs
node tests/blender-failures.browser.cjs
```

`QA_URL` overrides the local server URL. `QA_OUTPUT` chooses the screenshot and
report folder. Desktop checks inspect all five models; mobile checks use 430px
and 320px viewports, Japanese/dark and English/light, and screenshot each card.
Assertions cover deferred GLB/library loading, exact model statistics, camera
controls, lighting, wireframe, translation, modal focus, scroll locking, touch
target sizes, and cleanup. Failure checks cover model/metadata retry, closing
during a pending download, WebGL context loss, unavailable WebGL, and
reduced-motion changes. Browser emulation does not replace physical-device testing.
