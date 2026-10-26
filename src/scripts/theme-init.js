(function () {
    try {
        var t = localStorage.getItem("pp_theme");
        var q = new URLSearchParams(location.search).get("theme");
        if (q === "dark" || q === "light") t = q;
        if (!t) t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", t);
    } catch (e) { }
})();
// Hero entrance: hold the hero's small elements before first paint (motion
// allowed only); the intro releases them as its curtain lifts. The timeout
// guarantees the hero is never left hidden.
(function () {
    try {
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        var root = document.documentElement;
        root.classList.add("hero-wait");
        window.__heroPlay = function () {
            root.classList.remove("hero-wait");
            root.classList.add("hero-play");
        };
        setTimeout(window.__heroPlay, 3200);
    } catch (e) { }
})();
// Input modality: focus rings are for keyboard users. After a tap/click,
// focus that scripts hand back (closing a dialog) must not leave a ring.
(function () {
    var root = document.documentElement;
    root.setAttribute("data-input", "pointer");
    addEventListener("pointerdown", function () { root.setAttribute("data-input", "pointer"); }, true);
    addEventListener("keydown", function (e) {
        if (e.key === "Tab" || e.key.indexOf("Arrow") === 0) root.setAttribute("data-input", "keyboard");
    }, true);
})();
