(function () {
    function syncThemeUI() {
        var dark = document.documentElement.getAttribute("data-theme") === "dark";
        var lm = document.getElementById("themeLabelM");
        var japanese = document.documentElement.lang === 'ja';
        if (lm) lm.textContent = dark ? (japanese ? 'ライトモード' : 'Light mode') : (japanese ? 'ダークモード' : 'Dark mode');
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", dark ? "#12100b" : "#faf6ee");
    }
    window.toggleTheme = function () {
        var cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
        var next = cur === "dark" ? "light" : "dark";
        document.documentElement.classList.add("theme-anim");
        document.documentElement.setAttribute("data-theme", next);
        try { localStorage.setItem("pp_theme", next); } catch (e) { }
        syncThemeUI();
    };
    window.addEventListener('portfolio:languagechange', syncThemeUI);
    syncThemeUI();
})();
