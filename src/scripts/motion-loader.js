window.__motion = new Promise(function (resolve) {
    function load(src) {
        return new Promise(function (ok, fail) {
            var el = document.createElement('script');
            el.src = src; el.onload = ok; el.onerror = fail;
            document.head.appendChild(el);
        });
    }
    function start() {
        load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js')
            .then(function () {
                return Promise.all([
                    load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'),
                    load('https://unpkg.com/@studio-freight/lenis@1.0.33/dist/lenis.min.js')
                ]);
            })
            .then(resolve, function () { /* motion is optional */ });
    }
    function idle() {
        if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1500 });
        else setTimeout(start, 200);
    }
    if (document.readyState === 'complete') idle();
    else window.addEventListener('load', idle, { once: true });
});
