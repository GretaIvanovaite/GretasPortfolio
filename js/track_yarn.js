'use strict';

(function () {
    const TIMELINE_WIDTH = 2900;

    const yarnBall       = document.getElementById('yarn-ball');
    const yarnAnnouncer  = document.getElementById('yarn-announcer');
    const mobileSVGPath  = document.getElementById('thread-path-mobile');
    const desktopSVGPath = document.getElementById('thread-path-desktop');
    const mainEl         = document.querySelector('main');
    const headerEl       = document.querySelector('header');
    const timelineTrack  = document.querySelector('.timeline-track');
    const accessBtn      = document.querySelector('button[aria-label="Toggle easy read mode"]');

    if (!yarnBall || !mobileSVGPath || !desktopSVGPath || !mainEl) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        yarnBall.hidden = true;
        return;
    }

    const SECTION_SIDES = [
        { id: 'hero',       desktop: 'right', mobile: 'right', desktopSkip: false },
        { id: 'about',      desktop: 'right', mobile: 'left',  desktopSkip: false },
        { id: 'skills',     desktop: 'left',  mobile: 'right', desktopSkip: false },
        { id: 'projects',   desktop: 'right', mobile: 'left',  desktopSkip: false },
        { id: 'education',  desktop: 'left',  mobile: 'right', desktopSkip: false },
        { id: 'work',       desktop: 'right', mobile: 'left',  desktopSkip: false },
        { id: 'timeline',   desktop: 'right', mobile: 'right', desktopSkip: true  },
    ];

    let isAccessModeActive = false;
    let ballOffset         = 50;
    let headerH            = 0;
    let mainAbsTop         = 0;
    let activePath         = null;
    let activeLength       = 0;
    let isDesktop          = false;
    let trackAbsTop        = 0;
    let pathScrollEnd      = 0;

    function clamp(v, lo, hi) {
        return v < lo ? lo : v > hi ? hi : v;
    }

    function docY(el) {
        return el.getBoundingClientRect().top + window.scrollY;
    }

    function topInMain(el) {
        return docY(el) - mainAbsTop;
    }

    function buildPath(desktopMode) {
        const mainW   = mainEl.offsetWidth;
        const navW    = headerEl ? headerEl.offsetWidth : 72;
        const rCenter = desktopMode ? mainW * 0.92 : mainW - navW - ballOffset - 20;
        const lCenter = desktopMode ? mainW * 0.08 : mainW * 0.15;

        if (!desktopMode) {
            let d    = '';
            let curX = rCenter;
            for (const cfg of SECTION_SIDES) {
                const el = document.getElementById(cfg.id);
                if (!el) continue;
                const sTop  = topInMain(el);
                const sBot  = sTop + el.offsetHeight;
                const nextX = curX === rCenter ? lCenter : rCenter;
                const vPull = (sBot - sTop) * 0.4;
                if (d === '') d = `M ${curX} ${sTop}`;
                d += ` C ${curX} ${sTop + vPull},${nextX} ${sBot - vPull},${nextX} ${sBot}`;
                curX = nextX;
            }
            return d;
        }

        const pull    = (rCenter - lCenter) * 0.38;
        let d         = '';
        let prevX     = -1;
        let prevY     = -1;

        for (const cfg of SECTION_SIDES) {
            if (cfg.desktopSkip) continue;
            const el = document.getElementById(cfg.id);
            if (!el) continue;

            const sTop = topInMain(el);
            const sBot = sTop + el.offsetHeight;
            const x    = cfg.desktop === 'right' ? rCenter : lCenter;

            if (d === '') {
                d = `M ${x} ${sTop} L ${x} ${sBot}`;
            } else if (prevX === x) {
                d += ` L ${x} ${sBot}`;
            } else {
                d += ` C ${prevX} ${prevY + pull},${x} ${sTop - pull},${x} ${sTop} L ${x} ${sBot}`;
            }

            prevX = x;
            prevY = sBot;
        }

        if (timelineTrack) {
            const trackTopInMain = topInMain(timelineTrack);
            const railY          = trackTopInMain + (window.innerHeight - headerH) * 0.52;
            d += ` C ${prevX} ${prevY + pull},${lCenter} ${railY - pull},${lCenter} ${railY}`;
        }

        return d;
    }

    function cacheMetrics() {
        isDesktop  = window.innerWidth >= 900;
        headerH    = headerEl ? headerEl.offsetHeight : 0;
        ballOffset = yarnBall.offsetWidth / 2 || 50;
        mainAbsTop = docY(mainEl);

        activePath = isDesktop ? desktopSVGPath : mobileSVGPath;
        const inactivePath = isDesktop ? mobileSVGPath : desktopSVGPath;
        inactivePath.setAttribute('d', '');

        activePath.setAttribute('d', buildPath(isDesktop));
        activeLength = activePath.getTotalLength() || 0;

        if (isDesktop && timelineTrack) {
            trackAbsTop = docY(timelineTrack);
        }

        const lastSectionId = isDesktop ? 'work' : 'timeline';
        const lastEl = document.getElementById(lastSectionId);
        if (lastEl) {
            pathScrollEnd = mainAbsTop + topInMain(lastEl) + lastEl.offsetHeight - window.innerHeight;
        }
    }

    function updateBall() {
        if (isAccessModeActive) return;

        const scrollY = window.scrollY;

        if (isDesktop && timelineTrack) {
            const scrolled = scrollY - trackAbsTop;

            if (scrolled > TIMELINE_WIDTH) {
                yarnBall.style.transform = 'translate3d(-300px,-300px,0)';
                return;
            }

            if (scrolled >= 0) {
                const progress = clamp(scrolled / TIMELINE_WIDTH, 0, 1);
                const mainW    = mainEl.offsetWidth;
                const lCenter  = mainW * 0.08;
                const rCenter  = mainW * 0.92;
                const ballTX   = lCenter - ballOffset + progress * (rCenter - lCenter);
                const railVY   = 0.52 * (window.innerHeight - headerH);
                const ballTY   = scrollY - mainAbsTop + railVY - ballOffset;
                yarnBall.style.transform = `translate3d(${ballTX}px,${ballTY}px,0) rotate(${scrollY * 0.3}deg)`;
                return;
            }
        }

        const scrollEnd = (isDesktop && trackAbsTop > 0) ? trackAbsTop : (pathScrollEnd > 0 ? pathScrollEnd : 1);
        const t         = clamp(scrollY / scrollEnd, 0, 1);
        const pt        = activePath.getPointAtLength(t * activeLength);
        yarnBall.style.transform = `translate3d(${pt.x - ballOffset}px,${pt.y - ballOffset}px,0) rotate(${scrollY * 0.3}deg)`;
    }

    const sectObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && yarnAnnouncer) {
                const heading = entry.target.querySelector('h1, h2');
                if (heading) yarnAnnouncer.textContent = `The yarn has rolled to the ${heading.innerText} section.`;
            }
        });
    }, { threshold: 0.3 });

    mainEl.querySelectorAll('section').forEach(s => sectObs.observe(s));

    const resObs = new ResizeObserver(() => {
        requestAnimationFrame(() => {
            cacheMetrics();
            updateBall();
        });
    });
    resObs.observe(mainEl);

    cacheMetrics();
    updateBall();

    window.addEventListener('scroll', updateBall, { passive: true });
    window.addEventListener('resize', () => {
        cacheMetrics();
        updateBall();
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
                updateBall();
            }
        });
    }
})();
