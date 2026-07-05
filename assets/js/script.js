// DOM Elements
const header = document.getElementById('header');
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const backToTop = document.querySelector('.back-to-top');
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const themeToggle = document.getElementById('theme-toggle');

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => document.body.classList.add('loaded'), 500);

    initTheme();
    setActiveNavLink();
    setFooterYear();
    trackResumeButtonClicks();
});

// ── Footer year ───────────────────────────────────────────────────────────────
function setFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
}

// ── Header scroll effect ──────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    backToTop.classList.toggle('active', window.scrollY > 500);
    setActiveNavLink();
}, { passive: true });

// ── Mobile menu ───────────────────────────────────────────────────────────────
hamburger.addEventListener('click', toggleNav);
hamburger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleNav(); }
});

function toggleNav() {
    const isOpen = hamburger.classList.toggle('active');
    nav.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// ── Smooth scroll ─────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    });
});

// ── Back to top ───────────────────────────────────────────────────────────────
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Custom cursor (rAF-based, respects reduced-motion) ────────────────────────
if (window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.innerWidth > 1024) {

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
    });

    (function animateFollower() {
        followerX += (mouseX - followerX) * 0.18;
        followerY += (mouseY - followerY) * 0.18;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top  = followerY + 'px';
        requestAnimationFrame(animateFollower);
    })();

    document.querySelectorAll('a, button, .btn, .project-card, .experience-item, .skills-category, .certification-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.backgroundColor = 'rgba(230, 230, 250, 0.2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.backgroundColor = 'transparent';
        });
    });
}

// ── Intersection Observer for scroll animations ───────────────────────────────
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        }),
        { threshold: 0.15, rootMargin: '0px 0px -100px 0px' }
    );
    document.querySelectorAll('.appear-animation').forEach(el => observer.observe(el));
}

// ── Active nav link ───────────────────────────────────────────────────────────
function setActiveNavLink() {
    const scrollPos = window.scrollY;
    sections.forEach(section => {
        const top    = section.offsetTop - header.offsetHeight - 10;
        const bottom = top + section.offsetHeight;
        const id     = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < bottom) {
            navLinks.forEach(l => l.classList.remove('active'));
            const active = document.querySelector(`a[href="#${id}"]`);
            if (active) active.classList.add('active');
        }
    });
}

// ── Hero parallax ─────────────────────────────────────────────────────────────
const heroSection = document.getElementById('hero');
if (heroSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 768) {
            heroSection.style.backgroundPositionY = window.scrollY * 0.5 + 'px';
        }
    }, { passive: true });
}

// ── Dark mode ─────────────────────────────────────────────────────────────────
function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved ? saved === 'dark' : prefersDark);
}

function applyTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (themeToggle) {
        themeToggle.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        applyTheme(!isDark);
    });
}

// ── Contact form ──────────────────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const formStatus = document.getElementById('form-status');
    const submitBtn  = document.getElementById('submit-btn');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
        formStatus.textContent = '';

        fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: { 'Accept': 'application/json' }
        })
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(() => {
            formStatus.innerHTML = '<div class="form-success-msg">Message sent! I\'ll get back to you soon.</div>';
            contactForm.reset();
        })
        .catch(() => {
            formStatus.innerHTML = '<div class="form-error-msg">Something went wrong. Please try again or email me directly.</div>';
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        });
    });
}

// ── Resume click tracking ─────────────────────────────────────────────────────
function trackResumeButtonClicks() {
    document.querySelectorAll('a[href*="drive.google.com"], a[href*="resume"], a[href*="cv"]').forEach(btn => {
        btn.addEventListener('click', function () {
            if (window.gtag) {
                gtag('event', 'resume_download', {
                    event_category: 'engagement',
                    event_label: 'Resume Button Click',
                    button_url: this.href
                });
            }
        });
    });
}
