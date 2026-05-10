document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksList = document.querySelector('.nav-links');

    const setMenuOpen = (open) => {
        if (!navToggle || !navLinksList) return;
        navLinksList.dataset.visible = open ? 'true' : 'false';
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('nav-open', open);
    };

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            setMenuOpen(!isOpen);
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetTop = targetSection.getBoundingClientRect().top + window.scrollY - navHeight + 1;
                window.scrollTo({ top: targetTop, behavior: 'smooth' });
                history.pushState(null, '', targetId);
            }

            setMenuOpen(false);
        });
    });

    // Close menu on outside click / Escape (mobile)
    document.addEventListener('click', (e) => {
        if (!navbar || !navToggle) return;
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        if (!isOpen) return;
        if (!navbar.contains(e.target)) setMenuOpen(false);
    });

    document.addEventListener('keydown', (e) => {
        if (!navToggle) return;
        if (e.key !== 'Escape') return;
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) setMenuOpen(false);
    });

    // Form submission handler (placeholder)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! (Form submission not implemented yet)');
            // You can integrate with a service like Formspree or Netlify Forms here
        });
    }

    // Animation on scroll (simple)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Active nav link based on scroll position
    const navLinkBySectionId = new Map();
    navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('#')) navLinkBySectionId.set(href.slice(1), link);
    });

    const setActiveLink = (sectionId) => {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = navLinkBySectionId.get(sectionId);
        if (active) active.classList.add('active');
    };

    const activeObserver = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter((e) => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visible && visible.target && visible.target.id) {
                setActiveLink(visible.target.id);
            }
        },
        { threshold: [0.25, 0.5, 0.75] }
    );

    sections.forEach((section) => {
        if (section.id && navLinkBySectionId.has(section.id)) activeObserver.observe(section);
    });

    // Portfolio item hover effect (already in CSS, but can add more)
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Could add more effects here if needed
        });
    });
});
