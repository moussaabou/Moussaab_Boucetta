// Advanced animations and interactions for the portfolio website
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        this.setupIntersectionObservers();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupTypingAnimation();
        this.setupCounterAnimations();
        this.setupParallaxEffects();
        
        // Listen for motion preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            this.handleMotionPreference();
        });
    }

    setupIntersectionObservers() {
        // Main content observer
        const contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all sections and cards
        const elementsToObserve = document.querySelectorAll(
            'section, .project-card, .article-card, .skill-category, .social-link'
        );
        
        elementsToObserve.forEach(el => {
            contentObserver.observe(el);
        });

        this.observers.set('content', contentObserver);
    }

    animateElement(element) {
        if (this.isReducedMotion) return;

        const animationType = element.dataset.animation || this.getDefaultAnimation(element);
        const delay = element.dataset.delay || 0;

        setTimeout(() => {
            element.classList.add('animate-in');
            this.applyAnimation(element, animationType);
        }, delay);
    }

    getDefaultAnimation(element) {
        if (element.tagName === 'SECTION') return 'fadeInUp';
        if (element.classList.contains('project-card')) return 'slideInUp';
        if (element.classList.contains('article-card')) return 'fadeInUp';
        if (element.classList.contains('skill-category')) return 'zoomIn';
        if (element.classList.contains('social-link')) return 'slideInLeft';
        
        return 'fadeIn';
    }

    applyAnimation(element, type) {
        const animations = {
            fadeIn: 'animate__fadeIn',
            fadeInUp: 'animate__fadeInUp',
            slideInUp: 'animate__slideInUp',
            slideInLeft: 'animate__slideInLeft',
            slideInRight: 'animate__slideInRight',
            zoomIn: 'animate__zoomIn',
            bounceIn: 'animate__bounceIn'
        };

        if (animations[type]) {
            element.style.animationDuration = '0.8s';
            element.style.animationFillMode = 'both';
            element.classList.add('animate__animated', animations[type]);
        }
    }

    setupScrollAnimations() {
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');

        if (hero && heroContent) {
            window.addEventListener('scroll', () => {
                if (this.isReducedMotion) return;
                
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                
                heroContent.style.transform = `translateY(${rate}px)`;
            });
        }

        // Navigation bar transparency
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const opacity = Math.min(scrolled / 100, 0.98);
            
            if (navbar) {
                navbar.style.backgroundColor = `rgba(${
                    document.body.classList.contains('dark-theme') ? '15, 23, 42' : '255, 255, 255'
                }, ${opacity})`;
            }
        });
    }

    setupHoverEffects() {
        // Project cards hover effect
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (this.isReducedMotion) return;
                
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = 'var(--shadow-light)';
            });
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                if (this.isReducedMotion) return;
                
                btn.style.transform = 'translateY(-2px)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });

        // Social links animation
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (this.isReducedMotion) return;
                
                const icon = link.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(5deg)';
                }
            });

            link.addEventListener('mouseleave', () => {
                const icon = link.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    setupTypingAnimation() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.typingSpeed) || 50;
            
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-color)';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length && !this.isReducedMotion) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, speed);
                } else {
                    element.textContent = text;
                    element.style.borderRight = 'none';
                }
            };

            // Start typing animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 1000);
                        observer.unobserve(element);
                    }
                });
            });

            observer.observe(element);
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.counter);
            const duration = parseInt(counter.dataset.duration) || 2000;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(counter, target, duration);
                        observer.unobserve(counter);
                    }
                });
            });

            observer.observe(counter);
        });
    }

    animateCounter(element, target, duration) {
        if (this.isReducedMotion) {
            element.textContent = target;
            return;
        }

        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0 || this.isReducedMotion) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        });
    }

    // Skill bars animation
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            const progress = parseInt(bar.dataset.progress);
            
            setTimeout(() => {
                if (this.isReducedMotion) {
                    bar.style.width = `${progress}%`;
                } else {
                    bar.style.width = '0%';
                    bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    
                    setTimeout(() => {
                        bar.style.width = `${progress}%`;
                    }, 100);
                }
            }, index * 200);
        });
    }

    // Language stars animation
    animateLanguageStars() {
        const languageItems = document.querySelectorAll('.language-item');
        
        languageItems.forEach((item, index) => {
            const stars = item.querySelectorAll('.language-level i');
            
            setTimeout(() => {
                stars.forEach((star, starIndex) => {
                    setTimeout(() => {
                        if (!this.isReducedMotion) {
                            star.style.animation = 'starGlow 0.5s ease forwards';
                        }
                        star.style.opacity = '1';
                    }, starIndex * 100);
                });
            }, index * 300);
        });
    }

    // Form focus animations
    setupFormAnimations() {
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                input.addEventListener('focus', () => {
                    if (!this.isReducedMotion) {
                        label.style.transform = 'translateY(-1.5rem) scale(0.85)';
                        label.style.color = 'var(--primary-color)';
                    }
                });

                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.style.transform = 'translateY(0) scale(1)';
                        label.style.color = 'var(--text-muted)';
                    }
                });
            }
        });
    }

    // Handle reduced motion preference
    handleMotionPreference() {
        if (this.isReducedMotion) {
            // Remove all animations
            document.querySelectorAll('*').forEach(el => {
                el.style.animation = 'none';
                el.style.transition = 'none';
            });
        } else {
            // Re-enable animations
            this.init();
        }
    }

    // Page transition animation
    animatePageTransition() {
        if (this.isReducedMotion) return;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);
        }, 1000);
    }

    // Cleanup method
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animations.clear();
    }
}

// CSS for additional animations
const additionalStyles = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    @keyframes starGlow {
        0% {
            transform: scale(1);
            filter: brightness(1);
        }
        50% {
            transform: scale(1.2);
            filter: brightness(1.5);
        }
        100% {
            transform: scale(1);
            filter: brightness(1);
        }
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }

    .pulse {
        animation: pulse 2s infinite;
    }

    /* Smooth transitions for all elements */
    * {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                   opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                   background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                   color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize animation controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}
