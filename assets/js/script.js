// DOM Elements
const header = document.getElementById('header');
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const backToTop = document.querySelector('.back-to-top');
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const appearElements = document.querySelectorAll('.appear-animation');
const contactForm = document.getElementById('contact-form');

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Enable animations after initial load
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);

    // Initial check for animations
    checkAppearAnimations();
    setActiveNavLink();
});

// Handle header scroll effect
window.addEventListener('scroll', () => {
    // Show/hide header background on scroll
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Show/hide back to top button
    if (window.scrollY > 500) {
        backToTop.classList.add('active');
    } else {
        backToTop.classList.remove('active');
    }

    // Check for elements to animate as they come into view
    checkAppearAnimations();
    
    // Update active navigation link based on scroll position
    setActiveNavLink();
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Get header height for offset
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Back to top button functionality
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Custom cursor effects
if (window.innerWidth > 1024) {
    document.addEventListener('mousemove', (e) => {
        // Update cursor position
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Update follower with slight delay for effect
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .experience-item, .skills-category, .certification-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.backgroundColor = 'rgba(230, 230, 250, 0.2)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.backgroundColor = 'transparent';
        });
    });
}

// Check for elements to animate as they come into view
function checkAppearAnimations() {
    appearElements.forEach(element => {
        // Get element position relative to viewport
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150; // Distance from bottom of viewport to trigger animation
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate');
        }
    });
}

// Set active navigation link based on scroll position
function setActiveNavLink() {
    // Get current scroll position
    let currentPos = window.scrollY;
    
    // Check each section and update nav accordingly
    sections.forEach(section => {
        const sectionTop = section.offsetTop - header.offsetHeight - 10;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (currentPos >= sectionTop && currentPos < sectionBottom) {
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to corresponding nav link
            const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Form submission handling
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Here you would normally send data to a server
        // For demo purposes, we'll just show a success message
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('form-success');
        successMessage.innerHTML = `
            <div style="background-color: #e6e6fa; padding: 20px; border-radius: 4px; text-align: center; margin-top: 20px;">
                <h3 style="margin-bottom: 10px;">Message Sent!</h3>
                <p>Thank you ${name}, your message has been received. I'll get back to you soon.</p>
            </div>
        `;
        
        // Replace form with success message
        contactForm.innerHTML = '';
        contactForm.appendChild(successMessage);
    });
}

// Typewriter effect for skills (alternative to CSS animation if needed)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Intersection Observer API for more efficient animations
if ('IntersectionObserver' in window) {
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const appearOnScroll = new IntersectionObserver(
        (entries, appearOnScroll) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('animate');
                appearOnScroll.unobserve(entry.target);
            });
        }, 
        appearOptions
    );
    
    appearElements.forEach(element => {
        appearOnScroll.observe(element);
    });
}

// Handle resize events
window.addEventListener('resize', () => {
    // Disable custom cursor on mobile/tablet
    if (window.innerWidth <= 1024) {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
    } else {
        cursor.style.display = 'block';
        cursorFollower.style.display = 'block';
    }
});

// Add parallax effect to hero section
const heroSection = document.getElementById('hero');
if (heroSection) {
    window.addEventListener('scroll', () => {
        // Only apply effect if not on mobile
        if (window.innerWidth > 768) {
            const scrollPosition = window.scrollY;
            heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
    });
}