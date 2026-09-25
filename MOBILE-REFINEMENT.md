# Mobile refinement — September 25, 2026

The phone layout uses `mobile-refinements.css`. Its link has
`media="(max-width: 768px)"`, and every declaration is inside the same media
query. Desktop presentation and content are unchanged. Video format selection
has a separate phone-only media guard; desktop retains its existing behavior.

## Changes

- More breathing room around the original burgundy hero lettering, readable
  introduction text, and larger link targets.
- Stacked app cards with full phone screenshots, rounded previews, untruncated
  descriptions, consistent typography, and clearly separated project links.
- Consistent spacing across Unreal Engine projects, experience, qualifications,
  certifications, education, contact, and footer.
- Paired credential tiles with a full-width certification name; Japanese dates
  stay together even at 320px.
- Larger education photo crops while the original full photograph remains
  available in the viewer.
- 44px minimum primary touch targets, 16px contact inputs, and a full-width
  submit button. No change to form submission behavior.
- Stable content while swiping: desktop scroll-reveal transforms and opacity
  are overridden only on phones.
- Phone dialogs use dynamic viewport height. The project close button stays
  accessible when scrolling, and photo captions remain inside the viewport.
- Static instances of the existing Satoshi face provide consistent body weights
  in Chromium and WebKit. Desktop continues using the original variable font.
- Touch phones load the existing fast-start H.264 MP4 preview on demand. This
  avoids a WebKit failure where VP9 support is advertised but no frame arrives.
  Desktop retains WebM-first playback; neither format loads before interaction.

## Browser verification

Screenshots cover every section at 430 × 932 CSS pixels (iPhone 14 Pro Max
portrait dimensions), in English/light and Japanese/dark, with Chromium and
WebKit. Additional Chromium checks cover 320, 360, 390, and 768px widths.
This is browser emulation on Windows, not testing on physical iOS/Android devices.

The browser script checks visible overflow, input text size, primary touch
targets, menu state, language/theme switching, filter results, modal close
visibility, background scroll locking, and on-demand video playback.

Desktop before/after screenshots and computed styles are compared at 1024,
1440, and 1920px in light and dark mode. The test disables only the new mobile
stylesheet for the before capture. Moving marquees and the clock are frozen or
masked identically in both captures to make the comparison deterministic.

Screenshots and machine-readable reports are saved outside the deployed site
in `../portfolio-mobile-review/`, with a local `index.html` review gallery.

## Run the optional browser checks

The site remains static and needs no build dependencies. Install Playwright in
a separate tools folder and start a local server from this repository:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

In a separate terminal, install the optional tools and run checks:

```powershell
npm install --prefix ../portfolio-qa-tools playwright
node ../portfolio-qa-tools/node_modules/playwright/cli.js install chromium webkit
$env:NODE_PATH = (Resolve-Path ../portfolio-qa-tools/node_modules).Path
node tests/mobile-layout.browser.cjs
node tests/mobile-layout.browser.cjs --small
node tests/mobile-layout.browser.cjs --interactions
node tests/mobile-layout.browser.cjs --desktop
$env:QA_BROWSER = 'webkit'
$env:QA_OUTPUT = (Join-Path (Resolve-Path ..) 'portfolio-mobile-review/webkit')
node tests/mobile-layout.browser.cjs
```

`QA_URL` can override the default local server. Existing behavior checks:

```powershell
node --test --test-isolation=none tests/mobile-menu.test.cjs tests/unreal-projects.test.cjs
```
