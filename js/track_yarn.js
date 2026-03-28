const yarnBall = document.getElementById('yarn-ball');
const yarnAnnouncer = document.getElementById('yarn-announcer');
const threadPath = document.getElementById('thread-path');
const sections = document.querySelectorAll('main section');
const accessBtn = document.querySelector('button[aria-label="Toggle accessibility mode"]');

let isAccessModeActive = false;

const pathLength = threadPath.getTotalLength();

function updateYarnPosition() {
    if (isAccessModeActive) return;

    const mainElement = document.querySelector('main');
    if (!mainElement) return; 

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(Math.max(scrollTop / docHeight, 0), 1);

    const pathLength = threadPath.getTotalLength();
    const point = threadPath.getPointAtLength(scrollPercent * pathLength);
    
    const rect = mainElement.getBoundingClientRect();
    
    const xPos = (point.x * rect.width) / 100;
    const yPos = (point.y * rect.height) / 100;

    const centerX = xPos - 30;
    const centerY = yPos - 30;

    yarnBall.style.transform = `translate3d(${centerX}px, ${centerY}px, 0) rotate(${scrollTop * 0.5}deg)`;
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const heading = entry.target.querySelector('h1, h2');
            if (heading) {
                yarnAnnouncer.textContent = `The yarn has rolled to the ${heading.innerText} section.`;
            }
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => observer.observe(section));

window.addEventListener('scroll', updateYarnPosition);
window.addEventListener('resize', updateYarnPosition);

accessBtn.addEventListener('click', () => {
    isAccessModeActive = !isAccessModeActive;
    const isPressed = accessBtn.getAttribute('aria-pressed') === 'true';
    accessBtn.setAttribute('aria-pressed', !isPressed);
    
    if (isAccessModeActive) {
        yarnBall.style.display = 'none';
        yarnAnnouncer.textContent = "Motion animations paused.";
    } else {
        yarnBall.style.display = 'block';
        updateYarnPosition();
    }
});