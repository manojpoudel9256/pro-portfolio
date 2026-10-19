document.addEventListener('DOMContentLoaded', () => {
    function updateClock() {
        // Always Tokyo time, whatever the visitor's own time zone is.
        const ja = window.__lang === 'ja';
        const timeString = new Date().toLocaleTimeString(ja ? 'ja-JP' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Tokyo'
        }) + ' JST';
        const timeElement = document.getElementById('time');
        if (timeElement) {
            timeElement.textContent = timeString;
        } else {
            console.error('Clock element not found!');
        }
    }
    setInterval(updateClock, 1000);
    window.addEventListener('portfolio:languagechange', updateClock);
    updateClock();
});
