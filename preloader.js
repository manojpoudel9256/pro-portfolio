/* A short, staggered type-style sequence. Independent of GSAP and CDN scripts. */
(function () {
    'use strict';
    var pre = document.getElementById('preloader');
    if (!pre) return;
    var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var params = new URLSearchParams(window.location.search);
    if (params.has('nopreload') || motion.matches) {
        pre.remove();
        return;
    }

    var letters = Array.from(pre.querySelectorAll('.pl-letter'));
    var skip = pre.querySelector('.pl-skip');
    var timers = [];
    var done = false;
    var oldOverflow = document.documentElement.style.overflow;
    var oldBodyOverflow = document.body.style.overflow;
    var pixelLetters = {
        h: ['10000', '10000', '10110', '11001', '10001', '10001', '10001'],
        e: ['00000', '00000', '01110', '10001', '11111', '10000', '01111'],
        l: ['10', '10', '10', '10', '10', '10', '11'],
        o: ['00000', '00000', '01110', '10001', '10001', '10001', '01110']
    };

    // Small SVG squares form the pixel-font phase, keeping the entire effect in code.
    letters.forEach(function (letter) {
        var rows = pixelLetters[letter.dataset.letter];
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 ' + rows[0].length + ' 7');
        svg.setAttribute('class', 'pl-pixels');
        svg.setAttribute('shape-rendering', 'crispEdges');
        svg.setAttribute('aria-hidden', 'true');
        rows.forEach(function (row, y) {
            Array.from(row).forEach(function (pixel, x) {
                if (pixel !== '1') return;
                var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', x);
                rect.setAttribute('y', y);
                rect.setAttribute('width', '1');
                rect.setAttribute('height', '1');
                svg.appendChild(rect);
            });
        });
        letter.appendChild(svg);
    });

    var lang = params.get('lang');
    if (!lang) {
        try { lang = localStorage.getItem('pp_lang'); } catch (e) { /* Storage is optional. */ }
    }
    if (lang === 'ja') {
        skip.textContent = '\u30b9\u30ad\u30c3\u30d7';
        pre.setAttribute('aria-label', '\u30dd\u30fc\u30c8\u30d5\u30a9\u30ea\u30aa\u3092\u8aad\u307f\u8fbc\u307f\u4e2d');
    }

    function finish() {
        pre.remove();
        document.documentElement.style.overflow = oldOverflow;
        document.body.style.overflow = oldBodyOverflow;
    }

    function dismiss(immediate) {
        if (done) return;
        done = true;
        timers.forEach(clearTimeout);
        document.removeEventListener('keydown', onKey, true);
        window.removeEventListener('pagehide', onPageHide);
        if (motion.removeEventListener) motion.removeEventListener('change', onMotionChange);
        if (immediate) {
            finish();
        } else {
            pre.classList.add('pl-done');
            setTimeout(finish, 680);
        }
    }

    function onKey(event) {
        if (event.key === 'Escape') dismiss(false);
        if (event.key === 'Tab') {
            event.preventDefault();
            skip.focus();
        }
    }
    function onMotionChange(event) { if (event.matches) dismiss(true); }
    function onPageHide() { dismiss(true); }

    skip.addEventListener('click', function () { dismiss(false); });
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('pagehide', onPageHide);
    if (motion.addEventListener) motion.addEventListener('change', onMotionChange);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    pre.hidden = false;

    // Changes travel left to right, producing mixed letterforms like the reference.
    for (var style = 1; style <= 8; style++) {
        letters.forEach(function (letter, index) {
            var nextStyle = style;
            timers.push(setTimeout(function () {
                letter.dataset.style = String(nextStyle);
            }, 260 * nextStyle + index * 55));
        });
    }
    timers.push(setTimeout(function () { dismiss(false); }, 2750));
    timers.push(setTimeout(function () { dismiss(true); }, 5000));
})();
