// interactive.js - Efectos y animaciones avanzadas
class InteractiveEffects {
  constructor() {
    this.initParticles();
    this.initParallax();
    this.initCodeAnimation();
    this.initInteractiveCards();
    this.initProgressTracker();
  }

  // Partículas flotantes en el fondo
  initParticles() {
    const particleContainer = document.getElementById('particles');
    if (!particleContainer) return;

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Posición aleatoria
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Tamaño aleatorio
      const size = Math.random() * 4 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Color con transparencia
      particle.style.background = `rgba(67, 97, 238, ${Math.random() * 0.3 + 0.1})`;
      
      // Animación flotante
      particle.style.animation = `float ${Math.random() * 10 + 10}s ease-in-out infinite`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      particleContainer.appendChild(particle);
    }
  }

  // Efecto parallax en scroll
  initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const rate = el.dataset.rate || 0.5;
        const offset = scrolled * rate;
        el.style.transform = `translateY(${offset}px)`;
      });
    });
  }

  // Animación de código typing
  initCodeAnimation() {
    const codePreview = document.querySelector('.code-preview');
    if (!codePreview) return;

    const codeLines = [
      '<span class="code-keyword">class</span> <span class="code-class">Tutor</span> {',
      '  <span class="code-keyword">constructor</span>(nombre, especialidad) {',
      '    <span class="code-keyword">this</span>.nombre = <span class="code-string">"Carlos"</span>;',
      '    <span class="code-keyword">this</span>.especialidad = especialidad;',
      '  }',
      '',
      '  <span class="code-keyword">async</span> <span class="code-function">enseñar</span>(tema) {',
      '    <span class="code-keyword">const</span> resultado = <span class="code-keyword">await</span>',
      '      <span class="code-string">`Aprendé ${tema} con práctica real`</span>;',
      '    <span class="code-keyword">return</span> resultado;',
      '  }',
      '}',
      '',
      '<span class="code-comment">// Crear instancia y empezar</span>',
      '<span class="code-keyword">const</span> tutor = <span class="code-keyword">new</span> <span class="code-class">Tutor</span>();',
      'tutor.<span class="code-function">enseñar</span>(<span class="code-string">"JavaScript"</span>);'
    ];

    let currentLine = 0;
    
    const typeLine = () => {
      if (currentLine < codeLines.length) {
        const line = document.createElement('div');
        line.className = 'code-line';
        line.innerHTML = codeLines[currentLine];
        
        // Efecto de typing
        line.style.opacity = '0';
        codePreview.appendChild(line);
        
        setTimeout(() => {
          line.style.transition = 'opacity 0.5s ease';
          line.style.opacity = '1';
        }, 100);
        
        currentLine++;
        setTimeout(typeLine, 300);
      }
    };

    // Iniciar cuando el elemento es visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeLine();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(codePreview);
  }

  // Tarjetas interactivas con efecto 3D
  initInteractiveCards() {
    const cards = document.querySelectorAll('.interactive-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = (x - centerX) / 25;
        const rotateX = (centerY - y) / 25;
        
        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateZ(10px)
        `;
        
        // Efecto de luz
        const shadowX = (x / rect.width) * 100;
        const shadowY = (y / rect.height) * 100;
        
        card.style.background = `
          radial-gradient(
            circle at ${shadowX}% ${shadowY}%,
            rgba(67, 97, 238, 0.1) 0%,
            transparent 50%
          ),
          var(--surface)
        `;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        card.style.background = 'var(--surface)';
      });
    });
  }

  // Seguimiento de progreso visual
  initProgressTracker() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
      const target = bar.dataset.progress || 100;
      const duration = 1500;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      
      const animate = () => {
        if (current < target) {
          current += increment;
          bar.style.width = `${Math.min(current, target)}%`;
          setTimeout(animate, duration / steps);
        }
      };
      
      // Animar cuando sea visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animate();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(bar);
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new InteractiveEffects();
});