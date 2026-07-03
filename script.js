document.addEventListener('DOMContentLoaded', () => {
    // Presentation Slide Logic
    const slides = document.querySelectorAll('.slide-content');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const slideGlow = document.querySelector('.slide-glow');
    let currentSlide = 0;

    // Theme definitions for slide glow and indicators (extended to 8 slides)
    const slideThemes = [
        { glow: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 1. Gold (Titel)
        { glow: 'radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 2. Red (Incident)
        { glow: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 3. Blue (RPO/RTO)
        { glow: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(0,0,0,0) 70%)' }, // 4. Purple (Steps 1-3)
        { glow: 'radial-gradient(circle, rgba(67, 56, 202, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 5. Indigo (Steps 4-6)
        { glow: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 6. Gold (Prioritäten)
        { glow: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 7. Orange (PR & Recht)
        { glow: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)' }   // 8. Green (Quiz & Q&A)
    ];

    function showSlide(index) {
        // Remove active states
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Set new active states
        slides[index].classList.add('active');
        dots[index].classList.add('active');

        // Apply slide theme colors dynamically
        if (slideGlow && slideThemes[index]) {
            slideGlow.style.background = slideThemes[index].glow;
        }

        // Handle navigation buttons
        prevBtn.disabled = index === 0;
        
        if (index === slides.length - 1) {
            nextBtn.textContent = 'Abschliessen';
            nextBtn.classList.add('btn-primary');
        } else {
            nextBtn.textContent = 'Nächster Schritt';
            nextBtn.classList.remove('btn-primary');
        }

        currentSlide = index;
    }

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
        } else {
            // Close fullscreen and scroll to legal
            document.body.classList.remove('fullscreen-active');
            const legalSection = document.getElementById('details-sec');
            if (legalSection) {
                legalSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Dot click triggers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Fullscreen Mode triggers
    const startPresBtn = document.getElementById('start-pres-btn');
    const closePresBtn = document.getElementById('close-pres-btn');

    if (startPresBtn) {
        startPresBtn.addEventListener('click', () => {
            document.body.classList.add('fullscreen-active');
            // Shift focus to the modal key listener
            document.documentElement.focus();
        });
    }

    if (closePresBtn) {
        closePresBtn.addEventListener('click', () => {
            document.body.classList.remove('fullscreen-active');
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.body.classList.contains('fullscreen-active')) {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                if (currentSlide < slides.length - 1) {
                    showSlide(currentSlide + 1);
                }
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (currentSlide > 0) {
                    showSlide(currentSlide - 1);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                document.body.classList.remove('fullscreen-active');
            }
        }
    });

    // Tab Switching Logic
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Set buttons active state
            tabButtons.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');

            // Set tab content active state
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Initial load
    showSlide(0);
});
