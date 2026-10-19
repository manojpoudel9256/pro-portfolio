(function () {
    const nav = document.querySelector('.top-nav');
    const headerBottom = () => nav ? Math.max(0, Math.round(nav.getBoundingClientRect().bottom)) : 0;
    const syncVar = () => document.documentElement.style.setProperty('--nav-h', headerBottom() + 'px');
    syncVar();
    window.addEventListener('resize', syncVar, { passive: true });
    if (nav && 'ResizeObserver' in window) new ResizeObserver(syncVar).observe(nav);
    window.scrollToSection = function (target, opts) {
        if (!target) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const top = target.id === 'home' ? 0
            : Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY - headerBottom()));
        if (window.lenis && !reduced) window.lenis.scrollTo(top, { duration: (opts && opts.duration) || 1.1 });
        else window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    };
})();
