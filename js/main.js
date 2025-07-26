// Main JavaScript file for portfolio website
class PortfolioApp {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.languages = {};
        this.isLoading = true;
        
        this.init();
    }

    async init() {
        try {
            // Load language data
            await this.loadLanguages();
            
            // Initialize components
            this.initializeTheme();
            this.initializeLanguage();
            this.initializeNavigation();
            this.initializeAnimations();
            this.initializeContactForm();
            this.initializeSkillBars();
            this.initializeParticles();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            console.log('Portfolio app initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio app:', error);
            this.hideLoadingScreen();
        }
    }

    async loadLanguages() {
        try {
            const response = await fetch('data/languages.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.languages = await response.json();
        } catch (error) {
            console.error('Error loading languages:', error);
            // Fallback to English if language file fails to load
            this.languages = {
                en: {
                    name: "Moussaab Boucetta",
                    loading: "Loading..."
                }
            };
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                this.isLoading = false;
                
                // Trigger entrance animations
                this.triggerEntranceAnimations();
            }, 1000);
        }
    }

    initializeTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle.querySelector('i');

        // Apply saved theme
        body.className = `${this.currentTheme}-theme`;
        this.updateThemeIcon(themeIcon);

        // Theme toggle event listener
        themeToggle.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            body.className = `${this.currentTheme}-theme`;
            this.updateThemeIcon(themeIcon);
            
            // Save theme preference
            localStorage.setItem('theme', this.currentTheme);
            
            // Add animation class
            body.style.transition = 'all 0.3s ease';
        });
    }

    updateThemeIcon(icon) {
        if (this.currentTheme === 'light') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    }

    initializeLanguage() {
        const langButtons = document.querySelectorAll('.lang-btn');
        const html = document.documentElement;

        // Set initial language
        this.setLanguage(this.currentLanguage);

        // Language button event listeners
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const newLang = btn.dataset.langCode;
                if (newLang !== this.currentLanguage) {
                    this.setLanguage(newLang);
                }
            });
        });
    }

    setLanguage(langCode) {
        const html = document.documentElement;
        const langButtons = document.querySelectorAll('.lang-btn');
        
        // Update current language
        this.currentLanguage = langCode;
        
        // Update HTML attributes
        html.lang = langCode;
        html.dir = langCode === 'ar' ? 'rtl' : 'ltr';
        
        // Update active language button
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.langCode === langCode);
        });
        
        // Update all text content
        this.updateContent();
        
        // Save language preference
        localStorage.setItem('language', langCode);
        
        // Add body class for language-specific styling
        document.body.classList.remove('lang-en', 'lang-fr', 'lang-ar');
        document.body.classList.add(`lang-${langCode}`);
    }

    updateContent() {
        const elements = document.querySelectorAll('[data-lang]');
        const currentLangData = this.languages[this.currentLanguage];
        
        if (!currentLangData) {
            console.warn(`Language data not found for: ${this.currentLanguage}`);
            return;
        }
        
        elements.forEach(element => {
            const key = element.dataset.lang;
            const translation = currentLangData[key];
            
            if (translation) {
                // Handle different element types
                if (element.tagName === 'INPUT' && element.type !== 'submit') {
                    element.placeholder = translation;
                } else if (element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            } else {
                console.warn(`Translation not found for key: ${key} in language: ${this.currentLanguage}`);
            }
        });
    }

    initializeNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileToggle = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        // Scroll effect for navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = this.currentTheme === 'light' 
                    ? 'rgba(255, 255, 255, 0.98)' 
                    : 'rgba(15, 23, 42, 0.98)';
            } else {
                navbar.style.backgroundColor = this.currentTheme === 'light' 
                    ? 'rgba(255, 255, 255, 0.95)' 
                    : 'rgba(15, 23, 42, 0.95)';
            }
        });

        // Mobile menu toggle
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                // Update active link
                this.updateActiveNavLink(link);
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavLinkOnScroll();
        });
    }

    updateActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    updateActiveNavLinkOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    initializeAnimations() {
        // Initialize Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Special handling for skill bars
                    if (entry.target.classList.contains('skills')) {
                        this.animateSkillBars();
                    }
                }
            });
        }, observerOptions);

        // Observe sections for animations
        const sections = document.querySelectorAll('section');
        sections.forEach(section => observer.observe(section));

        // Observe cards and other elements
        const animatedElements = document.querySelectorAll('.project-card, .article-card, .skill-category');
        animatedElements.forEach(element => observer.observe(element));
    }

    triggerEntranceAnimations() {
        const heroElements = document.querySelectorAll('.hero-name, .hero-title, .hero-quote, .hero-buttons');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.animation = `slideInUp 1s ease ${index * 0.2}s both`;
            }, 200);
        });
    }

    initializeSkillBars() {
        this.skillBarsAnimated = false;
    }

    animateSkillBars() {
        if (this.skillBarsAnimated) return;
        
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const progress = bar.dataset.progress;
                bar.style.width = `${progress}%`;
            }, index * 100);
        });
        
        this.skillBarsAnimated = true;
    }

    initializeContactForm() {
        const form = document.getElementById('contact-form');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Clear previous errors
            this.clearFormErrors();
            
            // Validate form
            const isValid = this.validateForm();
            
            if (isValid) {
                this.submitForm();
            }
        });

        // Real-time validation
        nameInput.addEventListener('blur', () => this.validateName());
        emailInput.addEventListener('blur', () => this.validateEmail());
        messageInput.addEventListener('blur', () => this.validateMessage());
    }

    validateForm() {
        const nameValid = this.validateName();
        const emailValid = this.validateEmail();
        const messageValid = this.validateMessage();
        
        return nameValid && emailValid && messageValid;
    }

    validateName() {
        const nameInput = document.getElementById('name');
        const nameError = document.getElementById('name-error');
        const name = nameInput.value.trim();
        
        if (!name) {
            this.showError(nameError, this.getTranslation('error-name-required') || 'Name is required');
            return false;
        }
        
        if (name.length < 2) {
            this.showError(nameError, this.getTranslation('error-name-short') || 'Name must be at least 2 characters');
            return false;
        }
        
        this.clearError(nameError);
        return true;
    }

    validateEmail() {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const email = emailInput.value.trim();
        
        if (!email) {
            this.showError(emailError, this.getTranslation('error-email-required') || 'Email is required');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError(emailError, this.getTranslation('error-email-invalid') || 'Please enter a valid email address');
            return false;
        }
        
        this.clearError(emailError);
        return true;
    }

    validateMessage() {
        const messageInput = document.getElementById('message');
        const messageError = document.getElementById('message-error');
        const message = messageInput.value.trim();
        
        if (!message) {
            this.showError(messageError, this.getTranslation('error-message-required') || 'Message is required');
            return false;
        }
        
        if (message.length < 10) {
            this.showError(messageError, this.getTranslation('error-message-short') || 'Message must be at least 10 characters');
            return false;
        }
        
        this.clearError(messageError);
        return true;
    }

    showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    clearError(errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    clearFormErrors() {
        const errors = document.querySelectorAll('.form-error');
        errors.forEach(error => this.clearError(error));
    }

    async submitForm() {
        const form = document.getElementById('contact-form');
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = `
            <span>${this.getTranslation('sending') || 'Sending...'}</span>
            <i class="fas fa-spinner fa-spin"></i>
        `;
        submitButton.disabled = true;
        
        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert(this.getTranslation('error-submission') || 'There was an error sending your message. Please try again.');
            
        } finally {
            // Restore button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    showSuccessMessage() {
        const successMessage = document.getElementById('success-message');
        successMessage.classList.add('show');
        
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
    }

    getTranslation(key) {
        const currentLangData = this.languages[this.currentLanguage];
        return currentLangData ? currentLangData[key] : null;
    }

    initializeParticles() {
        // Initialize particles.js with configuration
        if (typeof particlesJS !== 'undefined') {
            particlesJS.load('particles-js', 'js/particles-config.js', () => {
                console.log('Particles.js loaded successfully');
            });
        }
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Page became visible
        console.log('Page is now visible');
    } else {
        // Page is hidden
        console.log('Page is now hidden');
    }
});

// Handle resize events
window.addEventListener('resize', debounce(() => {
    // Handle responsive changes
    console.log('Window resized');
}, 250));

// Handle scroll events
window.addEventListener('scroll', throttle(() => {
    // Handle scroll-based animations
}, 16)); // ~60fps

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Add keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'k':
                e.preventDefault();
                // Focus search or navigation
                break;
            case 'b':
                e.preventDefault();
                // Toggle theme
                document.getElementById('theme-toggle').click();
                break;
        }
    }
});

// Export for external use
window.PortfolioUtils = {
    debounce,
    throttle
};
