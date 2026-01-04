// ANIMACIONES AVANZADAS PARA TUTORÍAS

class AnimationsManager {
    constructor() {
        this.initScrollAnimations();
        this.initParallax();
        this.initCounterAnimations();
        this.initTypingEffect();
        this.initHoverEffects();
        this.initPageTransitions();
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar todos los elementos con data-animate
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        const animation = element.getAttribute('data-animate') || 'fade-up';
        
        switch(animation) {
            case 'fade-up':
                element.style.animation = 'fadeUp 0.8s ease-out forwards';
                break;
            case 'fade-in':
                element.style.animation = 'fadeIn 1s ease-out forwards';
                break;
            case 'slide-left':
                element.style.animation = 'slideLeft 0.8s ease-out forwards';
                break;
            case 'slide-right':
                element.style.animation = 'slideRight 0.8s ease-out forwards';
                break;
            case 'zoom-in':
                element.style.animation = 'zoomIn 0.8s ease-out forwards';
                break;
            case 'bounce':
                element.style.animation = 'bounce 1s ease-out forwards';
                break;
        }
    }

    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Efecto parallax en elementos específicos
            document.querySelectorAll('[data-parallax]').forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
            
            // Efecto parallax en background
            document.querySelectorAll('[data-bg-parallax]').forEach(el => {
                const speed = parseFloat(el.getAttribute('data-bg-parallax-speed')) || 0.3;
                const yPos = scrolled * speed;
                el.style.backgroundPosition = `center ${yPos}px`;
            });
        });
    }

    initCounterAnimations() {
        const counters = document.querySelectorAll('.animated-counter');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const update = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        };
        
        requestAnimationFrame(update);
    }

    initTypingEffect() {
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(element => {
            const texts = JSON.parse(element.getAttribute('data-typing')) || [element.textContent];
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            
            const type = () => {
                const currentText = texts[textIndex];
                
                if (isDeleting) {
                    element.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    element.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                }
                
                let typeSpeed = isDeleting ? 50 : 100;
                
                if (!isDeleting && charIndex === currentText.length) {
                    typeSpeed = 2000; // Pausa al final
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    typeSpeed = 500; // Pausa antes de empezar nuevo texto
                }
                
                setTimeout(type, typeSpeed);
            };
            
            setTimeout(type, 1000);
        });
    }

    initHoverEffects() {
        // Efecto de elevación en tarjetas
        document.querySelectorAll('.hover-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            });
        });
        
        // Efecto de brillo en botones
        document.querySelectorAll('.btn-glow').forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                const x = e.pageX - button.offsetLeft;
                const y = e.pageY - button.offsetTop;
                
                const ripple = document.createElement('span');
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 1000);
            });
        });
    }

    initPageTransitions() {
        // Transición suave entre páginas
        document.querySelectorAll('a:not([target="_blank"])').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.href && !link.href.includes('#') && !link.href.includes('javascript:')) {
                    e.preventDefault();
                    
                    // Agregar clase de salida
                    document.body.classList.add('page-exit');
                    
                    // Navegar después de la animación
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 500);
                }
            });
        });
        
        // Animación de entrada
        window.addEventListener('load', () => {
            document.body.classList.add('page-enter');
        });
    }

    // Efectos especiales para elementos específicos
    createParticles(container) {
        if (!container) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Posición aleatoria
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Tamaño aleatorio
            const size = Math.random() * 10 + 5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Animación
            const duration = Math.random() * 3 + 2;
            particle.style.animation = `float ${duration}s infinite ease-in-out`;
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            container.appendChild(particle);
        }
    }

    createConfetti() {
        const colors = ['#4361ee', '#06d6a0', '#7209b7', '#f72585', '#ff9e00'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Estilo
            confetti.style.width = '10px';
            confetti.style.height = '20px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.position = 'fixed';
            confetti.style.top = '-20px';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '2px';
            
            // Animación
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            confetti.style.animation = `confettiFall ${duration}s linear ${delay}s forwards`;
            
            document.body.appendChild(confetti);
            
            // Remover después de la animación
            setTimeout(() => {
                confetti.remove();
            }, (duration + delay) * 1000);
        }
    }
}

// Animaciones CSS para keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-20px);
        }
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 1s linear;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .page-enter {
        animation: fadeIn 0.5s ease-out;
    }
    
    .page-exit {
        animation: fadeOut 0.5s ease-out;
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 10000;
    }
    
    .toast.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .toast-success {
        border-left: 4px solid #06d6a0;
    }
    
    .toast-error {
        border-left: 4px solid #f72585;
    }
`;
document.head.appendChild(style);

// Inicializar animaciones
document.addEventListener('DOMContentLoaded', () => {
    const animations = new AnimationsManager();
    window.animations = animations;
});