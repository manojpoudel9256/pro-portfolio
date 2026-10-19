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

// SELECTED WORK — category filters
(function () {
    const btns = document.querySelectorAll(".pw-fbtn");
    const cards = document.querySelectorAll(".pw-card");
    btns.forEach(btn => btn.addEventListener("click", () => {
        btns.forEach(b => b.classList.toggle("active", b === btn));
        const f = btn.dataset.filter;
        cards.forEach(c => {
            const show = f === "all" || (c.dataset.cat || "").split(" ").includes(f);
            c.classList.toggle("pw-hide", !show);
        });
        if (window.ScrollTrigger) ScrollTrigger.refresh();
    }));
})();

window.__motion.then(function () {
    // SELECTED WORK — scroll reveal (skip under reduced motion)
    if (!prefersReducedMotion) {
        gsap.utils.toArray(".pw-card").forEach((card) => {
            gsap.from(card, {
                y: 60,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: { trigger: card, start: "top 85%" }
            });
        });

        // EDUCATION — cards slide in from opposite sides
        gsap.utils.toArray(".edu-card").forEach((card, i) => {
            gsap.from(card, {
                x: i % 2 === 0 ? -90 : 90,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: { trigger: card, start: "top 85%" }
            });
        });

        // EXPERIENCE — card fades up, milestones stagger in
        gsap.utils.toArray(".xp-item").forEach((card) => {
            gsap.from(card, {
                y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
                scrollTrigger: { trigger: card, start: "top 85%" }
            });
            gsap.from(card.querySelectorAll(".xp-phases li"), {
                y: 18, opacity: 0, duration: 0.55, stagger: 0.1, ease: "power2.out",
                scrollTrigger: { trigger: card.querySelector(".xp-phases"), start: "top 88%" }
            });
        });
    }

    // FOOTER ANIMATION
    gsap.from(".footer-container", {
        y: 100,
        opacity: 0,
        scrollTrigger: {
            trigger: ".footer",
            start: "top 80%",
            end: "top 50%",
            scrub: true
        }
    });
});



