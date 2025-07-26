// Particles.js configuration for animated background
const particlesConfig = {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": ["#3B82F6", "#2563eb", "#1d4ed8"]
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 0.5,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 3,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 2,
                "size_min": 0.1,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#3B82F6",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 2,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 140,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
};

// Dark theme particles configuration
const particlesConfigDark = {
    ...particlesConfig,
    "particles": {
        ...particlesConfig.particles,
        "color": {
            "value": ["#818cf8", "#a78bfa", "#22d3ee"]
        },
        "line_linked": {
            ...particlesConfig.particles.line_linked,
            "color": "#818cf8",
            "opacity": 0.3
        }
    }
};

// Initialize particles based on theme
function initializeParticles() {
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const config = isDarkTheme ? particlesConfigDark : particlesConfig;
    
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', config);
    }
}

// Update particles when theme changes
function updateParticlesTheme() {
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    if (window.pJSDom && window.pJSDom.length > 0) {
        const pJS = window.pJSDom[0].pJS;
        
        if (isDarkTheme) {
            pJS.particles.color.value = ["#818cf8", "#a78bfa", "#22d3ee"];
            pJS.particles.line_linked.color = "#818cf8";
            pJS.particles.line_linked.opacity = 0.3;
        } else {
            pJS.particles.color.value = ["#6366f1", "#8b5cf6", "#06b6d4"];
            pJS.particles.line_linked.color = "#6366f1";
            pJS.particles.line_linked.opacity = 0.4;
        }
        
        // Update existing particles
        pJS.particles.array.forEach(particle => {
            const colors = isDarkTheme ? ["#818cf8", "#a78bfa", "#22d3ee"] : ["#6366f1", "#8b5cf6", "#06b6d4"];
            particle.color.value = colors[Math.floor(Math.random() * colors.length)];
        });
    }
}

// Responsive particles configuration
function updateParticlesForDevice() {
    if (window.pJSDom && window.pJSDom.length > 0) {
        const pJS = window.pJSDom[0].pJS;
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024;
        
        if (isMobile) {
            // Reduce particles on mobile for better performance
            pJS.particles.number.value = 30;
            pJS.particles.line_linked.enable = false;
            pJS.particles.move.speed = 1;
        } else if (isTablet) {
            // Medium settings for tablets
            pJS.particles.number.value = 50;
            pJS.particles.line_linked.enable = true;
            pJS.particles.move.speed = 1.5;
        } else {
            // Full settings for desktop
            pJS.particles.number.value = 80;
            pJS.particles.line_linked.enable = true;
            pJS.particles.move.speed = 2;
        }
        
        // Refresh particles
        pJS.fn.particlesRefresh();
    }
}

// Export configuration for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        particlesConfig,
        particlesConfigDark,
        initializeParticles,
        updateParticlesTheme,
        updateParticlesForDevice
    };
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for particles.js to load
    setTimeout(() => {
        initializeParticles();
        
        // Listen for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    updateParticlesTheme();
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        // Listen for resize events
        window.addEventListener('resize', () => {
            setTimeout(updateParticlesForDevice, 100);
        });
        
        // Initial device optimization
        updateParticlesForDevice();
    }, 100);
});

// Pause particles when page is not visible (performance optimization)
document.addEventListener('visibilitychange', () => {
    if (window.pJSDom && window.pJSDom.length > 0) {
        const pJS = window.pJSDom[0].pJS;
        
        if (document.visibilityState === 'hidden') {
            pJS.fn.vendors.destroypJS();
        } else {
            initializeParticles();
        }
    }
});
