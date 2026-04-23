function darkMode() {
    const html = document.documentElement;
    const isNowDark = html.classList.toggle('dark-mode');
    localStorage.setItem('theme', isNowDark ? 'dark' : 'light');
    const btn = document.getElementById('btn-dark-mode');
    if (btn) {
        btn.textContent = isNowDark ? 'Light Mode' : 'Dark Mode';
        btn.setAttribute('aria-pressed', String(isNowDark));
    }
}

function accessibilityMode() {
    const html = document.documentElement;
    const isNowOn = html.classList.toggle('accessibility-on');
    const btn = document.getElementById('btn-easy-read');
    if (btn) {
        btn.textContent = isNowOn ? 'Standard View' : 'Easy Read';
        btn.setAttribute('aria-pressed', String(isNowOn));
        localStorage.setItem('accessibility', isNowOn ? 'on' : 'off');
    }
}

(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        window.addEventListener('DOMContentLoaded', function() {
            const btn = document.getElementById('btn-dark-mode');
            if (btn) {
                btn.textContent = 'Light Mode';
                btn.setAttribute('aria-pressed', 'true');
            }
        });
    }

    const savedA11y = localStorage.getItem('accessibility');
    if (savedA11y === 'on') {
        document.documentElement.classList.add('accessibility-on');
        window.addEventListener('DOMContentLoaded', function() {
            const btn = document.getElementById('btn-easy-read');
            if (btn) {
                btn.textContent = 'Standard View';
                btn.setAttribute('aria-pressed', 'true');
            }
        });
    }
})();

(function() {
    window.addEventListener('DOMContentLoaded', function() {
        var headerEl = document.querySelector('header');
        var mainEl   = document.querySelector('main');
        if (headerEl && mainEl && window.ResizeObserver) {
            new ResizeObserver(function() {
                if (window.innerWidth >= 768) {
                    mainEl.style.paddingTop = headerEl.offsetHeight + 'px';
                } else {
                    mainEl.style.paddingTop = '';
                }
            }).observe(headerEl);
        }
    });
})();

(function() {
    window.addEventListener('DOMContentLoaded', function() {
        var form = document.querySelector('#contact form');
        if (!form) return;

        var statusEl = document.createElement('div');
        statusEl.className = 'form-status';
        statusEl.setAttribute('role', 'status');
        statusEl.setAttribute('aria-live', 'polite');
        form.insertBefore(statusEl, form.querySelector('button[type="submit"]'));

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var nameField = document.getElementById('contact-name');
            var emailField = document.getElementById('contact-email');
            var messageField = document.getElementById('contact-message');

            nameField.removeAttribute('aria-invalid');
            emailField.removeAttribute('aria-invalid');
            messageField.removeAttribute('aria-invalid');

            var name = nameField.value.trim();
            var email = emailField.value.trim();
            var message = messageField.value.trim();

            var missing = [];
            if (!name) { nameField.setAttribute('aria-invalid', 'true'); missing.push('name'); }
            if (!email) { emailField.setAttribute('aria-invalid', 'true'); missing.push('email address'); }
            if (!message) { messageField.setAttribute('aria-invalid', 'true'); missing.push('message'); }

            if (missing.length > 0) {
                showFormStatus(statusEl, 'error', 'Please fill in your ' + missing.join(', ') + '.');
                return;
            }

            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                emailField.setAttribute('aria-invalid', 'true');
                showFormStatus(statusEl, 'error', 'Please enter a valid email address.');
                return;
            }

            var subject = encodeURIComponent('Portfolio enquiry from ' + name);
            var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
            window.location.href = 'mailto:greta.ivanovaite@gmail.com?subject=' + subject + '&body=' + body;

            showFormStatus(statusEl, 'success', 'Your email client has opened with your message. Thanks for getting in touch.');
            form.reset();
        });
    });
})();

function showFormStatus(el, type, message) {
    el.textContent = message;
    el.className = 'form-status visible ' + type;
}

(function() {
    window.addEventListener('DOMContentLoaded', function() {
        var figures = document.querySelectorAll('main > article figure img');
        if (!figures.length) return;

        var lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Image preview');

        var lightboxImg = document.createElement('img');
        lightboxImg.alt = '';

        var closeBtn = document.createElement('button');
        closeBtn.id = 'lightbox-close';
        closeBtn.setAttribute('aria-label', 'Close image preview');
        closeBtn.textContent = '×';

        lightbox.appendChild(lightboxImg);
        lightbox.appendChild(closeBtn);
        document.body.appendChild(lightbox);

        var previousFocus = null;

        function openLightbox(src, alt) {
            previousFocus = document.activeElement;
            lightboxImg.src = src;
            lightboxImg.alt = alt;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
            if (previousFocus) previousFocus.focus();
        }

        figures.forEach(function(img) {
            img.tabIndex = 0;
            img.addEventListener('click', function() { openLightbox(img.src, img.alt); });
            img.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(img.src, img.alt);
                }
            });
        });

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });

        closeBtn.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
        });
    });
})()
