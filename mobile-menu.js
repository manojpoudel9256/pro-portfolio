/* Independent navigation controller: safe with or without the animation CDN. */
(function () {
    'use strict';
    const panel = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('menuBackdrop');
    const trigger = document.getElementById('mobileMenuTrigger');
    const closeButton = panel && panel.querySelector('.menu-close');
    const main = document.getElementById('main');
    if (!panel || !backdrop || !trigger || !closeButton || !main) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 769px)');
    const links = Array.from(panel.querySelectorAll('.menu-link'));
    let saved = null;
    window.menuOpen = false;

    function markCurrent() {
        let current = links[0];
        links.forEach(link => {
            const target = document.getElementById(link.hash.slice(1));
            if (target && target.getBoundingClientRect().top <= 150) current = link;
        });
        links.forEach(link => {
            if (link === current) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }

    function openMenu() {
        if (window.menuOpen || desktop.matches) return;
        saved = {
            rootOverflow: document.documentElement.style.overflow,
            bodyOverflow: document.body.style.overflow,
            mainInert: main.inert,
            focus: document.activeElement,
            scroller: window.lenis,
            wasStopped: window.lenis ? window.lenis.isStopped : true
        };
        markCurrent();
        if (saved.scroller) saved.scroller.stop();
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        panel.inert = false;
        panel.setAttribute('aria-hidden', 'false');
        panel.classList.add('is-open');
        backdrop.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        window.menuOpen = true;
        closeButton.focus({ preventScroll: true });
        main.inert = true;
    }

    function closeMenu(restoreFocus = true) {
        if (!window.menuOpen) return;
        const state = saved;
        main.inert = state.mainInert;
        // Move focus out before hiding/inerting the dialog.
        if (restoreFocus) (state.focus && state.focus.isConnected ? state.focus : trigger).focus({ preventScroll: true });
        else if (panel.contains(document.activeElement)) document.activeElement.blur();
        panel.classList.remove('is-open');
        backdrop.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
        panel.inert = true;
        trigger.setAttribute('aria-expanded', 'false');
        document.documentElement.style.overflow = state.rootOverflow;
        document.body.style.overflow = state.bodyOverflow;
        if (state.scroller && !state.wasStopped) state.scroller.start();
        window.menuOpen = false;
        saved = null;
    }

    window.toggleMenu = () => window.menuOpen ? closeMenu() : openMenu();
    trigger.addEventListener('click', window.toggleMenu);
    closeButton.addEventListener('click', () => closeMenu());
    backdrop.addEventListener('click', () => closeMenu());
    document.addEventListener('keydown', event => {
        if (!window.menuOpen) return;
        if (event.key === 'Escape') { event.preventDefault(); closeMenu(); return; }
        if (event.key !== 'Tab') return;
        const focusable = Array.from(panel.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]'));
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
            event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
            event.preventDefault(); first.focus();
        }
    });

    panel.querySelectorAll('[data-menu-link]').forEach(link => {
        link.addEventListener('click', event => {
            const target = document.getElementById(link.hash.slice(1));
            if (!target) return;
            event.preventDefault();
            closeMenu(false);
            const offset = target.getBoundingClientRect().top + window.scrollY - 82;
            if (window.lenis && !reduced.matches) window.lenis.scrollTo(target, { offset: -82, duration: .85 });
            else window.scrollTo({ top: Math.max(0, offset), behavior: 'instant' });
            if (window.location.hash !== link.hash) window.history.pushState(null, '', link.hash);
            const previousTabindex = target.getAttribute('tabindex');
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
            target.addEventListener('blur', () => {
                if (previousTabindex === null) target.removeAttribute('tabindex');
                else target.setAttribute('tabindex', previousTabindex);
            }, { once: true });
        });
    });
    if (desktop.addEventListener) desktop.addEventListener('change', event => { if (event.matches) closeMenu(false); });
    window.addEventListener('pagehide', () => closeMenu(false));
})();
