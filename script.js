// ============================================================
// 1. SECURITY FEATURES
// ============================================================

// Disable right-click context menu
document.addEventListener('contextmenu', e => {
    e.preventDefault();
    return false;
});

// Disable text selection
document.addEventListener('selectstart', e => {
    e.preventDefault();
    return false;
});

// Disable copy, paste, cut
document.addEventListener('copy', e => {
    e.preventDefault();
    return false;
});

document.addEventListener('paste', e => {
    e.preventDefault();
    return false;
});

document.addEventListener('cut', e => {
    e.preventDefault();
    return false;
});

// Disable keyboard shortcuts for dev tools
document.addEventListener('keydown', e => {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
    ) {
        e.preventDefault();
        return false;
    }
});

// Disable drag and drop
document.addEventListener('dragstart', e => {
    e.preventDefault();
    return false;
});

document.addEventListener('drop', e => {
    e.preventDefault();
    return false;
});

// Add debugger to slow down inspection
setInterval(() => {
    debugger;
}, 100);

// Disable image dragging
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', e => {
        e.preventDefault();
        return false;
    });
});

// ============================================================
// 2. LENIS SMOOTH SCROLL
// ============================================================
const lenis = new Lenis({
    duration: 1.4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


// ============================================================
// 2. NAVBAR — blur on scroll
// ============================================================
const navbar = document.getElementById('navbar');
lenis.on('scroll', ({ scroll }) => {
    navbar.classList.toggle('scrolled', scroll > 60);
});
// ============================================================
// 4. CHAR SPLIT — hero heading splits into individual chars
//    and each one animates in with a stagger
// ============================================================
function splitChars(el) {
    const words = el.querySelectorAll('span:not(.c-red), span.c-red');
    words.forEach(word => {
        const text  = word.textContent;
        word.innerHTML = '';
        text.split('').forEach((ch, i) => {
            const span = document.createElement('span');
            span.classList.add('char');
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            span.style.transitionDelay = `${i * 0.04}s`;
            word.appendChild(span);
        });
    });
}

document.querySelectorAll('.split-chars').forEach(splitChars);


// ============================================================
// 5. STAT COUNTER — numbers count up when in view
// ============================================================
function animateCounter(el) {
    const text   = el.textContent.trim();
    const match  = text.match(/(\d+)/);
    if (!match) return;

    const end    = parseInt(match[1]);
    const suffix = text.replace(/[\d]/g, '');
    const dur    = 1500;
    const start  = performance.now();

    function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * end) + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}


// ============================================================
// 5. INTERSECTION OBSERVER — master observer for all effects
// ============================================================
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        // Standard fade animations
        if (el.classList.contains('fade-up') ||
            el.classList.contains('fade-right') ||
            el.classList.contains('fade-left')) {
            el.classList.add('visible');
        }

        // Clip-reveal (text rises from clipped area)
        if (el.classList.contains('clip-reveal')) {
            el.classList.add('visible');
        }

        // Char animation — trigger each char
        if (el.classList.contains('split-chars')) {
            const chars = el.querySelectorAll('.char');
            chars.forEach(c => c.classList.add('visible'));
        }

        // Scale in
        if (el.classList.contains('scale-in')) {
            el.classList.add('visible');
        }

        // Stat counter
        if (el.classList.contains('stat-card')) {
            const h3 = el.querySelector('h3');
            if (h3 && !h3.dataset.counted) {
                h3.dataset.counted = 'true';
                animateCounter(h3);
            }
        }

        io.unobserve(el);
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
});

// Observe everything
[
    '.fade-up', '.fade-right', '.fade-left',
    '.clip-reveal', '.split-chars',
    '.scale-in', '.stat-card'
].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => io.observe(el));
});
