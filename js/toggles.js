function darkMode() {
    const html = document.documentElement;
    const isNowDark = html.classList.toggle('dark-mode');
    const btn = document.querySelector('button[onclick="darkMode()"]');
    if (btn) {
        if (isNowDark) {
            btn.textContent = 'Light Mode';
            btn.setAttribute('aria-pressed', 'true');
            localStorage.setItem('theme', 'dark');
        } else {
            btn.textContent = 'Dark Mode';
            btn.setAttribute('aria-pressed', 'false');
            localStorage.setItem('theme', 'light');
        }
    }
}

function accessibilityMode() {
    const html = document.documentElement;
    const isNowOn = html.classList.toggle('accessibility-on');
    const btn = document.querySelector('button[onclick="accessibilityMode()"]');
    if (btn) {
        if (isNowOn) {
            btn.textContent = 'Standard View';
            btn.setAttribute('aria-pressed', 'true');
            localStorage.setItem('accessibility', 'on');
        } else {
            btn.textContent = 'Easy Read';
            btn.setAttribute('aria-pressed', 'false');
            localStorage.setItem('accessibility', 'off');
        }
    }
}

(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        window.addEventListener('DOMContentLoaded', function() {
            const btn = document.querySelector('button[onclick="darkMode()"]');
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
            const btn = document.querySelector('button[onclick="accessibilityMode()"]');
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
