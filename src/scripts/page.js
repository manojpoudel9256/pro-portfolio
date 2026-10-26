// Smooth scroll and ScrollTrigger start once the motion libraries arrive.
window.__motion.then(function () {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });
    window.lenis = lenis;

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Integrate Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// TOP NAV + hero CTA smooth-scroll (real anchors + Lenis)
document.querySelectorAll('.top-nav a[href^="#"], .hero a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const target = document.getElementById(a.getAttribute('href').slice(1));
        if (target) {
            e.preventDefault();
            window.scrollToSection(target);
            if (location.hash !== '#' + target.id) history.pushState(null, '', '#' + target.id);
        }
    });
});

// TOOLS MARQUEE — real self-hosted logos, duplicated for a seamless loop.
// Movement is driven by requestAnimationFrame (not CSS keyframes), which
// starts immediately and runs reliably on iOS/Android.
(function () {
    const LOGOS = [
        ["unrealengine", "Unreal Engine"], ["blender", "Blender"], ["cplusplus", "C++"],
        ["python", "Python"], ["javascript", "JavaScript"], ["typescript", "TypeScript"],
        ["threejs", "Three.js"], ["react", "React"], ["nodejs", "Node.js"],
        ["php", "PHP"], ["java", "Java"], ["html5", "HTML5"],
        ["css3", "CSS3"], ["tailwindcss", "Tailwind CSS"], ["bootstrap", "Bootstrap"],
        ["mysql", "MySQL"], ["mongodb", "MongoDB"], ["firebase", "Firebase"],
        ["opencv", "OpenCV"], ["docker", "Docker"], ["linux", "Linux"],
        ["git", "Git"], ["github", "GitHub"], ["vscode", "VS Code"],
        ["figma", "Figma"], ["vercel", "Vercel"]
    ];
    // build the hero tech marquee (CSS handles the infinite scroll)
    const tsItem = ([f, n], hidden) =>
        `<span class="ts-item"${hidden ? ' aria-hidden="true"' : ''}><img src="assets/logos/${f}.svg" alt="" width="20" height="20" loading="lazy" decoding="async"> ${n}</span>`;
    const tsTrack = document.querySelector(".hero-techstrip .ts-track");
    if (tsTrack) {
        tsTrack.innerHTML = LOGOS.map(t => tsItem(t, false)).join("") + LOGOS.map(t => tsItem(t, true)).join("");
    }
})();

// SELECTED WORK — category filters. The cards that remain settle in with a
// short rise (260 ms, 40 ms apart) so the change reads as a state transition.
(function () {
    const btns = document.querySelectorAll(".pw-fbtn");
    const cards = [...document.querySelectorAll(".pw-card")];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    btns.forEach(btn => btn.addEventListener("click", () => {
        btns.forEach(b => b.classList.toggle("active", b === btn));
        const f = btn.dataset.filter;
        cards.forEach(c => {
            const show = f === "all" || (c.dataset.cat || "").split(" ").includes(f);
            c.classList.toggle("pw-hide", !show);
        });
        if (window.ScrollTrigger) ScrollTrigger.refresh();
        if (reduce.matches || !Element.prototype.animate) return;
        cards.filter(c => !c.classList.contains("pw-hide")).forEach((c, i) => {
            c.animate([{ opacity: 0, translate: "0 8px" }, { opacity: 1, translate: "0 0" }],
                { duration: 260, delay: i * 40, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" });
        });
    }));
})();

// NAV INDICATOR — one pill slides to the active link (the scroll-spy in
// i18n.js toggles .active; a MutationObserver follows it). It appears in place
// on load, then animates; it re-measures on resize and language change.
(function () {
    const pill = document.querySelector(".top-nav .nav-pill");
    if (!pill) return;
    const ind = document.createElement("span");
    ind.className = "np-indicator no-anim";
    ind.setAttribute("aria-hidden", "true");
    pill.prepend(ind);
    pill.classList.add("has-indicator");
    const place = () => {
        const a = pill.querySelector(".np-link.active");
        if (!a || !a.offsetParent) { ind.style.setProperty("--np-o", "0"); return; }
        ind.style.setProperty("--np-x", a.offsetLeft + "px");
        ind.style.setProperty("--np-w", a.offsetWidth + "px");
        ind.style.setProperty("--np-o", "1");
    };
    new MutationObserver(place).observe(pill, { subtree: true, attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", place, { passive: true });
    window.addEventListener("portfolio:languagechange", () => requestAnimationFrame(place));
    if (document.fonts) document.fonts.ready.then(place);
    place();
    requestAnimationFrame(() => requestAnimationFrame(() => ind.classList.remove("no-anim")));
})();

// PRESS FEEDBACK — controls dip to 97 % while pressed and spring back on
// release (WAAPI on the independent `scale` property, so it never overrides a
// component's own CSS transitions or transforms).
(function () {
    if (!Element.prototype.animate) return;
    const PRESS = ".hero-cta, .pw-view, .pw-fbtn, .pw-viewall, .cred-btn, .cf-submit, .cf-topic, .bi-control, " +
        ".proj-live, .proj-open, .ue-toggle, .menu-text, .theme-toggle, .lang-flag-btn, .edu-more, .bw-inspect, " +
        ".cl-contact, .social-icon, .cl-social, .proj-close, .bi-close, .menu-link, .menu-language-option, .menu-theme";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
    document.addEventListener("pointerdown", e => {
        if (reduce.matches || e.button > 0) return;
        const el = e.target.closest(PRESS);
        if (!el || el.disabled) return;
        if (el._press) el._press.cancel();
        const down = el.animate([{ scale: 1 }, { scale: 0.97 }], { duration: 120, easing: ease, fill: "forwards" });
        el._press = down;
        const events = ["pointerup", "pointercancel", "pointerleave"];
        const release = () => {
            events.forEach(t => el.removeEventListener(t, release));
            const now = getComputedStyle(el).scale;
            down.cancel();
            el._press = el.animate([{ scale: now === "none" ? 1 : now }, { scale: 1 }], { duration: 180, easing: ease });
        };
        events.forEach(t => el.addEventListener(t, release));
    }, { passive: true });
})();

// SCROLL REVEALS — one motion language (docs/MOTION-PLAN.md): cards rise 24px
// and fade in small batches; section headings reveal top-down from a mask line.
// Desktop only (phones keep content static while swiping) and never under
// reduced motion. Elements already on screen at load are left untouched.
window.__motion.then(function () {
    const CARDS = ".pw-card, .ue-card, .bw-card, .xp-item, .lc-card, .cred-card, .edu-card, .fg-card, .contact-card";
    const HEADINGS = ".pw-title, #ue-title, .bw-title, .section-title, .lc-title, .cert-title, .fg-title, .cl-headline";
    const below = el => el.getBoundingClientRect().top > window.innerHeight;
    gsap.matchMedia().add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray(CARDS).filter(below);
        const heads = gsap.utils.toArray(HEADINGS).filter(below);
        gsap.set(cards, { opacity: 0, y: 24 });
        gsap.set(heads, { clipPath: "inset(0 0 100% 0)", y: 16 });
        ScrollTrigger.batch(cards, {
            start: "top 88%", once: true,
            onEnter: batch => gsap.to(batch, {
                opacity: 1, y: 0, duration: 0.64, ease: "power3.out", stagger: 0.07,
                overwrite: true, clearProps: "opacity,transform"
            })
        });
        ScrollTrigger.batch(heads, {
            start: "top 90%", once: true,
            onEnter: batch => gsap.to(batch, {
                clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08,
                overwrite: true, clearProps: "clipPath,transform"
            })
        });
        // leaving the breakpoint (resize to phone / reduced motion on) shows everything
        return () => gsap.set([...cards, ...heads], { clearProps: "opacity,transform,clipPath" });
    });
});

