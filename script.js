document.addEventListener('DOMContentLoaded', () => {
    // Presentation Slide Logic
    const slides = document.querySelectorAll('.slide-content');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const slideGlow = document.querySelector('.slide-glow');
    let currentSlide = 0;

    // Theme definitions for slide glow and indicators (extended to 11 slides)
    const slideThemes = [
        { glow: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 1. Gold (Titel)
        { glow: 'radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 2. Red (Incident Summary)
        { glow: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 3. Dark Red (Kritikalität)
        { glow: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 4. Blue (RPO/RTO)
        { glow: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(0,0,0,0) 70%)' }, // 5. Purple (Steps 1-3)
        { glow: 'radial-gradient(circle, rgba(67, 56, 202, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 6. Indigo (Steps 4-6)
        { glow: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 7. Gold (Prioritäten)
        { glow: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 8. Orange (PR & Statement)
        { glow: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 9. Light Blue (AGB Clauses)
        { glow: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 70%)' },  // 10. Violet (Comparison)
        { glow: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)' }   // 11. Green (Quiz & Q&A)
    ];

    function updateButtons() {
        const activeSlide = slides[currentSlide];
        const hasHiddenFragments = Array.from(activeSlide.querySelectorAll('.fragment')).some(f => !f.classList.contains('visible'));
        const hasVisibleFragments = Array.from(activeSlide.querySelectorAll('.fragment')).some(f => f.classList.contains('visible'));
        
        // Prev is disabled only on first slide with no visible fragments
        prevBtn.disabled = (currentSlide === 0 && !hasVisibleFragments);
        
        if (currentSlide === slides.length - 1 && !hasHiddenFragments) {
            nextBtn.textContent = 'Abschliessen';
            nextBtn.classList.add('btn-primary');
        } else {
            nextBtn.textContent = 'Weiter';
            nextBtn.classList.remove('btn-primary');
        }
    }

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

        currentSlide = index;

        // Reset fragments to hidden on the target slide (usually when moving forward to it)
        const fragments = slides[index].querySelectorAll('.fragment');
        fragments.forEach(f => f.classList.remove('visible'));

        updateButtons();
    }

    function goNext() {
        const activeSlide = slides[currentSlide];
        const fragments = activeSlide.querySelectorAll('.fragment');
        const firstHiddenFragment = Array.from(fragments).find(f => !f.classList.contains('visible'));

        if (firstHiddenFragment) {
            firstHiddenFragment.classList.add('visible');
            updateButtons();
        } else {
            if (currentSlide < slides.length - 1) {
                showSlide(currentSlide + 1);
            } else {
                // Close fullscreen and scroll to details
                document.body.classList.remove('fullscreen-active');
                const legalSection = document.getElementById('details-sec');
                if (legalSection) {
                    legalSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }

    function goPrev() {
        const activeSlide = slides[currentSlide];
        const fragments = activeSlide.querySelectorAll('.fragment');
        const lastVisibleFragment = Array.from(fragments).reverse().find(f => f.classList.contains('visible'));

        if (lastVisibleFragment) {
            lastVisibleFragment.classList.remove('visible');
            updateButtons();
        } else {
            if (currentSlide > 0) {
                showSlide(currentSlide - 1);
                // When going back to the previous slide, make all its fragments visible immediately
                // so the user starts at the "end" of the previous slide's content.
                const prevSlideFragments = slides[currentSlide].querySelectorAll('.fragment');
                prevSlideFragments.forEach(f => f.classList.add('visible'));
                updateButtons();
            }
        }
    }

    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

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
                goNext();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goPrev();
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
