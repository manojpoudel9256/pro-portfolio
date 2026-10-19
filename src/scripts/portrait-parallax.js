(function () {
    const portrait = document.getElementById('portrait');
    const hero = document.getElementById('home');
    if (!portrait || !hero) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    window.__motion.then(() => {
    hero.addEventListener('mousemove', (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top - r.height / 2) / r.height;
        gsap.to(portrait, { x: x * 30, y: y * 30, duration: 0.9, ease: 'power3.out' });
    });
    hero.addEventListener('mouseleave', () => {
        gsap.to(portrait, { x: 0, y: 0, duration: 1, ease: 'power3.out' });
    });
    });
})();
