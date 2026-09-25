// Run with: node --test tests/unreal-projects.test.cjs
// A deterministic media/DOM harness checks loading decisions and playback lifecycle.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const code = fs.readFileSync(path.join(__dirname, '../unreal-projects.js'), 'utf8');

function setup({ reduced = false, fine = true, saveData = false, webm = true, phone = false } = {}) {
    const timers = new Map();
    let now = 0, timerId = 0, intersection;
    function node() {
        const events = {}, attrs = {}, classes = new Set();
        return {
            dataset: {}, hidden: true, textContent: '',
            addEventListener(name, fn) { (events[name] ||= []).push(fn); },
            fire(name, data = {}) { (events[name] || []).forEach(fn => fn({ preventDefault() {}, ...data })); },
            setAttribute(name, value) { attrs[name] = value; },
            getAttribute(name) { return attrs[name] || null; },
            focus() { document.activeElement = this; },
            classList: {
                add(...names) { names.forEach(n => classes.add(n)); },
                remove(...names) { names.forEach(n => classes.delete(n)); },
                toggle(n, on) { if (on) classes.add(n); else classes.delete(n); },
                contains(n) { return classes.has(n); }
            }
        };
    }
    const document = Object.assign(node(), { documentElement: { lang: 'en' }, hidden: false });
    const motion = Object.assign(node(), { matches: reduced });
    const hover = Object.assign(node(), { matches: fine });
    const connection = Object.assign(node(), { saveData });
    const cards = [0, 1].map(index => {
        const card = node();
        const parts = Object.fromEntries(['video', '.ue-toggle', '.ue-media-link', '.ue-toggle-label', '.ue-error', '.ue-name'].map(key => [key, node()]));
        const video = parts.video;
        Object.assign(video, {
            readyState: 0, paused: true, currentTime: 0, plays: 0, loads: 0,
            dataset: { mp4: `${index}.mp4`, webm: `${index}.webm` },
            canPlayType() { return webm ? 'probably' : ''; },
            load() { this.loads++; this.readyState = 0; },
            play() { this.plays++; this.paused = false; return this.reject ? Promise.reject(new Error('Playback blocked')) : Promise.resolve(); },
            pause() { this.paused = true; }
        });
        Object.defineProperty(video, 'src', { set(value) { this.setAttribute('src', value); }, get() { return this.getAttribute('src'); } });
        parts['.ue-name'].textContent = index ? 'Warehouse Simulation' : 'Darts Game';
        card.querySelector = key => parts[key];
        return Object.assign(card, { parts, video });
    });
    const section = Object.assign(node(), { querySelectorAll: () => cards });
    document.getElementById = () => section;
    const window = Object.assign(node(), { matchMedia: query => query.includes('reduced') ? motion : query.includes('max-width') ? { matches: phone } : hover });
    function IntersectionObserver(fn) { intersection = fn; this.observe = () => {}; }
    window.IntersectionObserver = IntersectionObserver;
    vm.runInNewContext(code, {
        document, window, navigator: { connection }, IntersectionObserver,
        setTimeout(fn, ms) { timers.set(++timerId, { fn, at: now + ms }); return timerId; },
        clearTimeout(id) { timers.delete(id); }
    });
    return {
        cards, document, window, motion, hover, connection,
        leaveViewport(card) { intersection([{ target: card, isIntersecting: false }]); },
        advance(ms) {
            const end = now + ms;
            while (true) {
                const next = [...timers].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
                if (!next) break;
                timers.delete(next[0]); now = next[1].at; next[1].fn();
            }
            now = end;
        }
    };
}
const click = card => card.parts['.ue-toggle'].fire('click');
const hover = (h, card) => { card.fire('pointerenter', { pointerType: 'mouse' }); h.advance(180); };
const playing = card => { card.video.readyState = 4; card.video.fire('playing'); };

test('no video source or download before interaction; brief fly-by does not load', () => {
    const h = setup(), card = h.cards[0];
    assert.equal(card.video.src, null);
    card.fire('pointerenter', { pointerType: 'mouse' }); h.advance(100);
    card.fire('pointerleave'); h.advance(200);
    assert.equal(card.video.loads, 0);
});
test('hover starts muted WebM, reveals actual frames, then restores the cover', () => {
    const h = setup(), card = h.cards[0]; hover(h, card);
    assert.equal(card.video.src, '0.webm'); assert.equal(card.video.muted, true);
    assert.equal(card.video.controls, false);
    playing(card); assert.equal(card.classList.contains('is-ready'), true);
    card.video.currentTime = 5; card.fire('pointerleave');
    assert.equal(card.video.paused, true); assert.equal(card.video.currentTime, 0);
    assert.equal(card.classList.contains('is-ready'), false);
});
test('touch click uses MP4 fallback and native controls; leaving card does not stop explicit play', () => {
    const h = setup({ fine: false, webm: false }), card = h.cards[0]; click(card);
    assert.equal(card.video.src, '0.mp4'); assert.equal(card.video.controls, true);
    card.fire('pointerleave'); assert.equal(card.video.paused, false);
    assert.equal(card.parts['.ue-toggle'].getAttribute('aria-expanded'), 'true');
    click(card); assert.equal(card.video.paused, true);
});
test('touch phones prefer MP4 even when VP9 is advertised; desktop keeps WebM', () => {
    for (const phone of [true, false]) {
        const h = setup({ phone, fine: !phone, webm: true }), card = h.cards[0];
        assert.equal(card.video.src, null);
        click(card);
        assert.equal(card.video.src, phone ? '0.mp4' : '0.webm');
        playing(card);
        assert.equal(card.classList.contains('is-ready'), true);
    }
});

test('only one clip plays and cards stop when offscreen or the tab is hidden', () => {
    const h = setup(), [a, b] = h.cards;
    click(a); click(b); assert.equal(a.video.paused, true);
    h.leaveViewport(b); assert.equal(b.video.paused, true);
    click(a); h.document.hidden = true; h.document.fire('visibilitychange'); assert.equal(a.video.paused, true);
});
test('reduced motion, coarse pointers and data saving suppress hover but permit explicit playback', () => {
    for (const options of [{ reduced: true }, { fine: false }, { saveData: true }]) {
        const h = setup(options), card = h.cards[0]; hover(h, card);
        assert.equal(card.video.src, null); click(card); assert.equal(card.video.plays, 1);
    }
});
test('preference changes cancel automatic playback; Escape closes explicit player', () => {
    const h = setup(), card = h.cards[0]; hover(h, card);
    h.motion.matches = true; h.motion.fire('change'); assert.equal(card.video.paused, true);
    click(card); card.fire('keydown', { key: 'Escape' });
    assert.equal(card.video.paused, true); assert.equal(h.document.activeElement, card.parts['.ue-toggle']);
});
test('WebM media error retries MP4, then exposes a direct link if both fail', () => {
    const h = setup(), card = h.cards[0]; click(card); card.video.fire('error');
    assert.equal(card.video.src, '0.mp4'); card.video.fire('error');
    assert.equal(card.parts['.ue-error'].hidden, false); assert.equal(card.video.paused, true);
});
test('play rejection and load timeout leave the cover and allow retry', async () => {
    const h = setup(), card = h.cards[0]; card.video.reject = true; click(card);
    await Promise.resolve(); await Promise.resolve();
    assert.equal(card.parts['.ue-error'].hidden, false);
    card.video.reject = false; click(card); h.advance(15000);
    assert.equal(card.video.paused, true); assert.equal(card.classList.contains('is-loading'), false);
    click(card); playing(card); assert.equal(card.parts['.ue-error'].hidden, true);
});
test('Japanese labels follow language switches and pagehide stops playback', () => {
    const h = setup(), card = h.cards[0]; h.document.documentElement.lang = 'ja';
    h.window.fire('portfolio:languagechange'); assert.equal(card.parts['.ue-toggle-label'].textContent, 'デモを再生');
    click(card); assert.equal(card.parts['.ue-toggle-label'].textContent, 'プレーヤーを閉じる');
    h.window.fire('pagehide'); assert.equal(card.video.paused, true);
});
