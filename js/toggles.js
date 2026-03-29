function darkMode() {
    const html = document.documentElement;
    // .toggle() returns true if it added the class, false if it removed it
    const isNowDark = html.classList.toggle('dark-mode');
    
    const btn = document.querySelector('button[onclick="darkMode()"]');
    
    if (btn) {
        // This is the "Switching" logic
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


(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        
        // We wait for the DOM to be ready to update the button text
        window.addEventListener('DOMContentLoaded', () => {
            const btn = document.querySelector('button[onclick="darkMode()"]');
            if (btn) {
                btn.textContent = 'Light Mode';
                btn.setAttribute('aria-pressed', 'true');
            }
        });
    }
})();