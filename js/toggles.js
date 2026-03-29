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
            btn.textContent = 'Standard Mode';
            btn.setAttribute('aria-pressed', 'true');
            localStorage.setItem('accessibility', 'on');
        } else {
            btn.textContent = 'Accessibility Mode';
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
                btn.textContent = 'Standard Mode';
                btn.setAttribute('aria-pressed', 'true');
            }
        });
    }
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

            var name = nameField.value.trim();
            var email = emailField.value.trim();
            var message = messageField.value.trim();

            if (!name || !email || !message) {
                showFormStatus(statusEl, 'error', 'Please fill in all fields before sending.');
                return;
            }

            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
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
