// Run: node --test --test-isolation=none tests/mobile-menu.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const code = fs.readFileSync(path.join(__dirname, '../mobile-menu.js'), 'utf8');

function setup({ desktop = false, reduced = false, stopped = false, noLenis = false } = {}) {
    let document;
    function element(extra = {}) {
        const events = {}, attributes = {}, classes = new Set();
        return Object.assign({
            inert: false, isConnected: true,
            classList: { add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name) },
            addEventListener(name, fn, options) { (events[name] ||= []).push({ fn, once: options?.once }); },
            fire(name, data = {}) {
                const event = { defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...data };
                const listeners = events[name] || [];
                events[name] = listeners.filter(listener => !listener.once);
                listeners.forEach(listener => listener.fn(event));
                return event;
            },
            setAttribute(name, value) { attributes[name] = value; },
            getAttribute(name) { return Object.hasOwn(attributes, name) ? attributes[name] : null; },
            removeAttribute(name) { delete attributes[name]; },
            focus() { document.activeElement = this; },
            blur() { document.activeElement = document.body; }
        }, extra);
    }
    const targets = Object.fromEntries(['home', 'work', 'unreal-projects', 'about-me', 'contact'].map((id, i) => [id, element({ getBoundingClientRect: () => ({ top: i * 700 - 800 }) })]));
    const links = Object.keys(targets).map(id => element({ hash: '#' + id }));
    const brand = element({ hash: '#home' }), close = element(), langEn = element(), langJa = element(), theme = element();
    const focusable = [brand, close, ...links, langEn, langJa, theme];
    const panel = element({
        inert: true,
        querySelector: () => close,
        querySelectorAll: selector => selector === '.menu-link' ? links : selector === '[data-menu-link]' ? [brand, ...links] : focusable,
        contains: node => focusable.includes(node)
    });
    const trigger = element(), backdrop = element(), main = element();
    const ids = { ...targets, mobileMenu: panel, mobileMenuTrigger: trigger, menuBackdrop: backdrop, main };
    document = element({ documentElement: { style: { overflow: 'clip' } }, body: { style: { overflow: 'auto' } }, activeElement: trigger, getElementById: id => ids[id] });
    const desktopQuery = element({ matches: desktop }), reducedQuery = { matches: reduced };
    const scroller = {
        isStopped: stopped, stops: 0, starts: 0, scrolls: [],
        stop() { this.stops++; this.isStopped = true; },
        start() { this.starts++; this.isStopped = false; },
        scrollTo(...args) { this.scrolls.push(args); }
    };
    const window = element({
        lenis: noLenis ? undefined : scroller, scrollY: 800, location: { hash: '' },
        matchMedia: query => query.includes('min-width') ? desktopQuery : reducedQuery,
        scrollTo(options) { this.lastScroll = options; }
    });
    window.history = { pushState: (state, title, hash) => { window.location.hash = hash; } };
    vm.runInNewContext(code, { window, document });
    return { window, document, panel, backdrop, trigger, close, main, scroller, links, brand, theme, targets, desktopQuery };
}

test('opening locks native and smooth scrolling and focuses the visible dialog', () => {
    const s = setup(); s.trigger.fire('click');
    assert.equal(s.window.menuOpen, true);
    assert.equal(s.panel.inert, false); assert.equal(s.main.inert, true);
    assert.equal(s.document.activeElement, s.close);
    assert.equal(s.panel.getAttribute('aria-hidden'), 'false');
    assert.equal(s.trigger.getAttribute('aria-expanded'), 'true');
    assert.equal(s.document.documentElement.style.overflow, 'hidden');
    assert.equal(s.document.body.style.overflow, 'hidden');
    assert.equal(s.scroller.isStopped, true);
    assert.equal(s.links[1].getAttribute('aria-current'), 'location');
});
test('close button, backdrop and Escape restore focus and original scroll state', () => {
    for (const method of ['close', 'backdrop', 'Escape']) {
        const s = setup(); s.trigger.fire('click');
        if (method === 'Escape') s.document.fire('keydown', { key: 'Escape' });
        else s[method].fire('click');
        assert.equal(s.window.menuOpen, false); assert.equal(s.main.inert, false); assert.equal(s.panel.inert, true);
        assert.equal(s.document.activeElement, s.trigger); assert.equal(s.scroller.isStopped, false);
        assert.equal(s.document.documentElement.style.overflow, 'clip'); assert.equal(s.document.body.style.overflow, 'auto');
        s.close.fire('click'); assert.equal(s.scroller.starts, 1);
    }
});
test('Tab and Shift+Tab wrap within the dialog', () => {
    const s = setup(); s.trigger.fire('click'); s.theme.focus();
    assert.equal(s.document.fire('keydown', { key: 'Tab', shiftKey: false }).defaultPrevented, true);
    assert.equal(s.document.activeElement, s.brand);
    s.document.fire('keydown', { key: 'Tab', shiftKey: true }); assert.equal(s.document.activeElement, s.theme);
});
test('all menu destinations close the menu, navigate, and focus their section', () => {
    for (let i = 0; i < 5; i++) {
        const s = setup(); s.trigger.fire('click'); s.links[i].fire('click');
        const target = s.targets[s.links[i].hash.slice(1)];
        assert.equal(s.window.menuOpen, false); assert.equal(s.window.location.hash, s.links[i].hash);
        assert.equal(s.scroller.scrolls[0][0], target); assert.equal(s.document.activeElement, target);
        assert.equal(target.getAttribute('tabindex'), '-1'); target.fire('blur'); assert.equal(target.getAttribute('tabindex'), null);
    }
});
test('reduced motion and missing Lenis use immediate native scrolling', () => {
    for (const options of [{ reduced: true }, { noLenis: true }]) {
        const s = setup(options); s.trigger.fire('click'); s.links[2].fire('click');
        assert.equal(s.window.lastScroll.behavior, 'instant'); assert.equal(s.scroller.scrolls.length, 0);
        assert.equal(s.window.lastScroll.top, 1318);
    }
});
test('desktop resize and pagehide release the menu lock; desktop cannot open it', () => {
    const s = setup(); s.trigger.fire('click'); s.desktopQuery.matches = true; s.desktopQuery.fire('change', { matches: true });
    assert.equal(s.window.menuOpen, false); assert.equal(s.main.inert, false);
    s.trigger.fire('click'); assert.equal(s.window.menuOpen, false);
    s.desktopQuery.matches = false; s.trigger.fire('click'); s.window.fire('pagehide'); assert.equal(s.window.menuOpen, false);
});
test('a previously stopped scroller is never unintentionally restarted', () => {
    const s = setup({ stopped: true }); s.trigger.fire('click'); s.close.fire('click');
    assert.equal(s.scroller.starts, 0); assert.equal(s.scroller.isStopped, true);
});
