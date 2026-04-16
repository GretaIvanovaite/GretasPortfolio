(function () {
    var desktopBreakpoint = 1100;
    var timelineWidth = 6600;

    var section, track, entries;
    var active = false;

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function isDesktop() {
        return window.innerWidth >= desktopBreakpoint;
    }

    function setup() {
        section = document.getElementById('timeline');
        track = section ? section.querySelector('.timeline-track') : null;
        entries = track ? track.querySelector('.timeline-entries') : null;
        if (!section || !track || !entries) return;
        onResize();
    }

    function enable() {
        if (active) return;
        active = true;

        track.style.height = (timelineWidth + window.innerHeight) + 'px';
        entries.style.position = 'sticky';
        entries.style.top = '0';
        entries.style.transform = 'translateX(0)';

        window.addEventListener('scroll', onScroll, {passive: true});
        onScroll();
    }

    function disable() {
        if (!active) return;
        active = false;

        window.removeEventListener('scroll', onScroll);

        if (track) track.style.height = '';
        if (entries) {
            entries.style.position = '';
            entries.style.top = '';
            entries.style.transform = '';
        }
    }

    function onScroll() {
        if (!track || !entries) return;

        var trackTop = track.getBoundingClientRect().top + window.scrollY;
        var scrolled = window.scrollY - trackTop;
        var scrollRange = track.offsetHeight - window.innerHeight;

        if (scrollRange <= 0) return;

        if (scrolled < 0) scrolled = 0;
        if (scrolled > scrollRange) scrolled = scrollRange;

        var progress = scrolled / scrollRange;
        var maxTranslate = timelineWidth - window.innerWidth;
        if (maxTranslate < 0) maxTranslate = 0;

        entries.style.transform = 'translateX(' + -(progress * maxTranslate) + 'px)';
    }

    function onResize() {
        if (isDesktop() && !prefersReducedMotion()) {
            if (active) {
                track.style.height = (timelineWidth + window.innerHeight) + 'px';
                onScroll();
            } else {
                enable();
            }
        } else {
            disable();
        }
    }

    window.addEventListener('load', setup);
    window.addEventListener('resize', onResize);

    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.addEventListener) {
        motionQuery.addEventListener('change', onResize);
    }
}());
