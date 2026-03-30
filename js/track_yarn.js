'use strict';

(function () {
    const yarnBall      = document.getElementById('yarn-ball');
    const yarnAnnouncer = document.getElementById('yarn-announcer');
    const mobilePath    = document.getElementById('thread-path-mobile');
    const desktopPath   = document.getElementById('thread-path-desktop');
    const mainElement   = document.querySelector('main');
    const headerEl      = document.querySelector('header');
    const accessBtn     = document.querySelector('button[aria-label="Toggle easy read mode"]');

    if (!yarnBall || !mobilePath || !desktopPath || !mainElement) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        yarnBall.hidden = true;
        return;
    }

    let isAccessModeActive = false;
    let ballOffset = 50;

    let mainHeight   = 0;
    let mainTop      = 0;
    let mainLeft     = 0;
    let headerOffset = 0;
    let activePath   = null;
    let activeLength = 0;

    function cacheMetrics() {
        mainHeight   = mainElement.offsetHeight;
        mainTop      = mainElement.offsetTop;
        mainLeft     = mainElement.offsetLeft;
        headerOffset = (window.innerWidth >= 768 && headerEl) ? headerEl.offsetHeight : 0;
        activePath   = window.innerWidth >= 768 ? desktopPath : mobilePath;
        activeLength = activePath.getTotalLength();
        ballOffset   = yarnBall.offsetWidth / 2 || 50;
    }

    function updateYarnPosition() {
        if (isAccessModeActive) return;

        const scrollTop    = window.pageYOffset || document.documentElement.scrollTop;
        const scrollRange  = mainHeight - window.innerHeight;
        const scrollPercent = scrollRange > 0
            ? Math.min(Math.max((scrollTop - mainTop) / scrollRange, 0), 1)
            : 0;

        const point = activePath.getPointAtLength(scrollPercent * activeLength);
        const viewportX = (point.x / 100) * window.innerWidth;
        const x = viewportX - mainLeft - ballOffset;
        const y = (point.y / 100) * mainHeight - ballOffset + headerOffset;

        yarnBall.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${scrollTop * 0.5}deg)`;
    }

    const sections = mainElement.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && yarnAnnouncer) {
                const heading = entry.target.querySelector('h1, h2');
                if (heading) {
                    yarnAnnouncer.textContent = `The yarn has rolled to the ${heading.innerText} section.`;
                }
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));

    cacheMetrics();
    updateYarnPosition();

    window.addEventListener('scroll', updateYarnPosition, { passive: true });
    window.addEventListener('resize', () => {
        cacheMetrics();
        updateYarnPosition();
    });

    if (accessBtn) {
        accessBtn.addEventListener('click', () => {
            isAccessModeActive = !isAccessModeActive;
            accessBtn.setAttribute('aria-pressed', String(isAccessModeActive));

            if (isAccessModeActive) {
                yarnBall.style.display = 'none';
                if (yarnAnnouncer) yarnAnnouncer.textContent = 'Motion animations paused.';
            } else {
                yarnBall.style.display = '';
                updateYarnPosition();
            }
        });
    }
})();
