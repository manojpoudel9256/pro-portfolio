/* Media is attached only after a deliberate hover or play action. No CDN dependency. */
(function () {
    'use strict';
    const section = document.getElementById('unreal-projects');
    if (!section) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const phone = window.matchMedia('(max-width: 768px) and (pointer: coarse)');
    const connection = navigator.connection;
    const players = [];
    const japanese = () => document.documentElement.lang === 'ja';
    const autoAllowed = () => hover.matches && !motion.matches && !(connection && connection.saveData);

    section.querySelectorAll('.ue-card').forEach(card => {
        const video = card.querySelector('video');
        const toggle = card.querySelector('.ue-toggle');
        const mediaLink = card.querySelector('.ue-media-link');
        const label = card.querySelector('.ue-toggle-label');
        const error = card.querySelector('.ue-error');
        const title = card.querySelector('.ue-name');
        let wanted = false, manual = false, request = 0, delay = 0, timeout = 0;
        let fallback = false;

        function labels() {
            label.textContent = manual ? (japanese() ? 'プレーヤーを閉じる' : 'Close player') : (japanese() ? 'デモを再生' : 'Play demo');
            toggle.setAttribute('aria-label', title.textContent + ' — ' + label.textContent);
            mediaLink.setAttribute('aria-label', title.textContent + (japanese() ? 'のデモを再生' : ' — Play demo'));
            toggle.setAttribute('aria-expanded', String(manual));
        }

        function stop() {
            const restoreFocus = document.activeElement === video;
            wanted = false;
            manual = false;
            request++;
            clearTimeout(delay);
            clearTimeout(timeout);
            video.pause();
            video.controls = false;
            video.tabIndex = -1;
            video.preload = 'none';
            if (video.readyState > 0) video.currentTime = 0;
            card.classList.remove('is-ready', 'is-manual', 'is-loading');
            labels();
            if (restoreFocus) toggle.focus({ preventScroll: true });
        }

        function failed() {
            const showError = manual;
            stop();
            error.hidden = !showError;
        }

        function play() {
            const id = ++request;
            const result = video.play();
            if (result && result.catch) result.catch(() => {
                if (id === request && wanted) failed();
            });
        }

        function start(explicit) {
            clearTimeout(delay);
            if (!explicit && !autoAllowed()) return;
            players.forEach(player => { if (player.card !== card) player.stop(); });
            wanted = true;
            manual = explicit;
            error.hidden = true;
            video.muted = true;
            video.controls = explicit;
            video.tabIndex = explicit ? 0 : -1;
            card.classList.toggle('is-manual', explicit);
            card.classList.toggle('is-loading', video.paused || video.readyState < 3);
            labels();
            if (!video.getAttribute('src')) {
                // Prefer the fast-start H.264 preview on touch phones. Some
                // WebKit runtimes advertise VP9 but never deliver a frame.
                // Desktop keeps its existing WebM-first selection.
                fallback = phone.matches || !video.canPlayType('video/webm; codecs="vp9"');
                video.src = fallback ? video.dataset.mp4 : video.dataset.webm;
                video.preload = 'auto';
                video.load();
            }
            clearTimeout(timeout);
            timeout = setTimeout(() => { if (wanted && video.readyState < 3) failed(); }, 15000);
            play();
        }

        video.addEventListener('playing', () => {
            if (!wanted) { video.pause(); return; }
            clearTimeout(timeout);
            card.classList.remove('is-loading');
            card.classList.add('is-ready');
        });
        video.addEventListener('waiting', () => { if (wanted) card.classList.add('is-loading'); });
        video.addEventListener('error', () => {
            if (!wanted) return;
            if (!fallback) {
                fallback = true;
                request++; // Ignore a rejection from the failed WebM play request.
                video.src = video.dataset.mp4;
                video.load();
                play();
            } else failed();
        });
        card.addEventListener('pointerenter', event => {
            if (event.pointerType !== 'mouse' || manual || !autoAllowed()) return;
            delay = setTimeout(() => start(false), 180);
        });
        card.addEventListener('pointerleave', () => { clearTimeout(delay); if (!manual) stop(); });
        card.addEventListener('keydown', event => {
            if (event.key === 'Escape') { stop(); toggle.focus(); }
        });
        toggle.addEventListener('click', event => { event.preventDefault(); manual ? stop() : start(true); });
        mediaLink.addEventListener('click', event => { event.preventDefault(); start(true); video.focus(); });
        players.push({ card, stop, labels, isManual: () => manual });
        labels();
    });

    // Release playback when a card or the page leaves view, including touch playback.
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) players.find(player => player.card === entry.target).stop();
            });
        });
        players.forEach(player => observer.observe(player.card));
    }
    const stopAll = () => players.forEach(player => player.stop());
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });
    window.addEventListener('pagehide', stopAll);
    window.addEventListener('portfolio:languagechange', () => players.forEach(player => player.labels()));
    const preferencesChanged = () => {
        section.classList.toggle('ue-explicit-only', !autoAllowed());
        if (!autoAllowed()) players.forEach(player => { if (!player.isManual()) player.stop(); });
    };
    preferencesChanged();
    if (motion.addEventListener) motion.addEventListener('change', preferencesChanged);
    if (hover.addEventListener) hover.addEventListener('change', preferencesChanged);
    if (connection && connection.addEventListener) connection.addEventListener('change', preferencesChanged);
})();
