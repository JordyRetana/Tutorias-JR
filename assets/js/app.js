// =========================
// TUTORÍAS JR - JavaScript Principal
// Versión: 6.0 - Optimizado para data-include
// =========================

// Variables globales
let currentToast = null;
let isInitialized = false;

// =========================
// 1. SISTEMA DE INICIALIZACIÓN
// =========================
function initializeApp() {
    if (isInitialized) {
        console.log('⚠️ Aplicación ya inicializada');
        return;
    }
    
    console.log('🚀 Tutorías JR - Inicializando aplicación...');
    
    try {
        // Inicializar componentes en orden con delays apropiados
        setTimeout(initTheme, 100);
        setTimeout(initNavigation, 150);
        setTimeout(initDropdowns, 200);
        setTimeout(initMobileMenu, 250);
        setTimeout(initBackToTop, 300);
        setTimeout(initModals, 350);
        setTimeout(initWhatsAppLinks, 400);
        setTimeout(initForms, 450);
        setTimeout(initEventListeners, 500);
        
        // Marcar como inicializado
        setTimeout(() => {
            isInitialized = true;
            console.log('✅ Aplicación inicializada correctamente');
            
            // Mostrar mensaje de bienvenida después de 1 segundo
            setTimeout(() => {
                showToast('¡Bienvenido a Tutorías JR! 👨‍💻', 'success');
            }, 1000);
        }, 600);
        
    } catch (error) {
        console.error('❌ Error inicializando aplicación:', error);
        showToast('Error al cargar algunas funciones', 'error');
    }
}

// =========================
// 2. SISTEMA DE TEMA OSCURO/CLARO (MEJORADO)
// =========================
function initTheme() {
    // Intentar varias veces si el botón no está disponible
    let attempts = 0;
    const maxAttempts = 10;
    
    function tryInitTheme() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (!themeToggle && attempts < maxAttempts) {
            attempts++;
            console.log(`🔄 Intento ${attempts}/${maxAttempts} - Esperando botón de tema...`);
            setTimeout(tryInitTheme, 200);
            return;
        }
        
        if (!themeToggle) {
            console.warn('❌ Botón de tema no encontrado después de varios intentos');
            return;
        }
        
        const themeIcon = themeToggle.querySelector('i');
        
        // Cargar tema guardado o usar preferencia del sistema
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.setAttribute('data-mode', 'dark');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        } else {
            document.documentElement.setAttribute('data-mode', 'light');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
        }
        
        // Alternar tema al hacer clic
        themeToggle.addEventListener('click', () => {
            const currentMode = document.documentElement.getAttribute('data-mode');
            const newMode = currentMode === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-mode', newMode);
            localStorage.setItem('theme', newMode);
            
            // Cambiar ícono
            if (themeIcon) {
                themeIcon.className = newMode === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            
            // Feedback visual
            themeToggle.style.transform = 'scale(1.1)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 200);
            
            // Mostrar notificación
            showToast(`Modo ${newMode === 'dark' ? 'oscuro' : 'claro'} activado`, 'success');
        });
        
        console.log('✅ Sistema de tema inicializado');
    }
    
    tryInitTheme();
}

// =========================
// 3. NAVEGACIÓN Y DROPDOWNS (MEJORADO)
// =========================
function initNavigation() {
    // Navbar scroll effect
    function handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Ejecutar una vez al inicio
    setTimeout(handleScroll, 100);
    
    // Resaltar enlace activo
    function highlightActiveLink() {
        const currentPage = document.body.getAttribute('data-page');
        if (!currentPage) return;
        
        // Resaltar en desktop
        const activeLink = document.querySelector(`.nav-link[data-page="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Resaltar en menú móvil
        const mobileLinks = document.querySelectorAll('.mobile-menu-item');
        mobileLinks.forEach(link => {
            if (link.getAttribute('href') && link.getAttribute('href').includes(currentPage)) {
                link.classList.add('active');
            }
        });
    }
    
    // Esperar a que el menú móvil se cargue
    setTimeout(highlightActiveLink, 300);
    
    console.log('✅ Navegación inicializada');
}

function initDropdowns() {
    // Esperar a que los dropdowns estén en el DOM
    setTimeout(() => {
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        
        if (dropdowns.length === 0) {
            console.log('⚠️ No se encontraron dropdowns');
            return;
        }
        
        // Cerrar dropdowns al hacer clic fuera
        document.addEventListener('click', (event) => {
            dropdowns.forEach(dropdown => {
                if (!dropdown.contains(event.target)) {
                    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                    if (dropdownMenu) {
                        dropdownMenu.style.opacity = '0';
                        dropdownMenu.style.visibility = 'hidden';
                        dropdownMenu.style.transform = 'translateY(10px)';
                    }
                }
            });
        });
        
        // Smooth hover para dropdowns
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', () => {
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.opacity = '1';
                    dropdownMenu.style.visibility = 'visible';
                    dropdownMenu.style.transform = 'translateY(0)';
                }
            });
            
            dropdown.addEventListener('mouseleave', () => {
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(10px)';
                }
            });
        });
        
        console.log('✅ Dropdowns inicializados');
    }, 400);
}

// =========================
// 4. MENÚ MÓVIL (MEJORADO)
// =========================
function initMobileMenu() {
    // Esperar a que el menú móvil se cargue
    setTimeout(() => {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileOverlay = document.querySelector('.mobile-menu-overlay');
        
        if (!mobileMenuBtn || !mobileMenu) {
            console.log('⚠️ Elementos del menú móvil no encontrados');
            return;
        }
        
        // Abrir menú móvil
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            if (mobileOverlay) mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Cerrar menú móvil
        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Cerrar todos los acordeones
            const accordionBtns = mobileMenu.querySelectorAll('.mobile-menu-accordion-btn');
            accordionBtns.forEach(btn => {
                btn.classList.remove('active');
                const content = btn.nextElementSibling;
                if (content) {
                    content.style.maxHeight = '0';
                }
            });
        }
        
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }
        
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeMobileMenu);
        }
        
        // Acordeones del menú móvil
        const accordionBtns = mobileMenu.querySelectorAll('.mobile-menu-accordion-btn');
        accordionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
        
        // Cerrar menú al hacer clic en un enlace
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        console.log('✅ Menú móvil inicializado');
    }, 500);
}

// =========================
// 5. BOTÓN "VOLVER ARRIBA"
// =========================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) {
        console.log('⚠️ Botón "Volver arriba" no encontrado');
        return;
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    console.log('✅ Botón "Volver arriba" inicializado');
}

// =========================
// 6. SISTEMA DE MODALES (MEJORADO)
// =========================
function initModals() {
    // Esperar a que los modales se carguen
    setTimeout(() => {
        // Detectar clics en botones de modales
        document.addEventListener('click', (e) => {
            // Botones con data-modal
            const modalTrigger = e.target.closest('[data-modal]');
            if (modalTrigger) {
                e.preventDefault();
                const modalId = modalTrigger.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    openModal(modal);
                }
            }
            
            // Botones con onclick que abren modales
            if (e.target.onclick && e.target.onclick.toString().includes('openModal')) {
                const modalMatch = e.target.onclick.toString().match(/openModal\(['"]([^'"]+)['"]\)/);
                if (modalMatch) {
                    const modalId = modalMatch[1];
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        e.preventDefault();
                        openModal(modal);
                    }
                }
            }
            
            // Cerrar modal con botón close
            if (e.target.closest('.modal-close') || e.target.classList.contains('modal-close')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    closeModal(modal);
                }
            }
        });
        
        // Cerrar modal al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeModal(e.target);
            }
        });
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal.active');
                modals.forEach(modal => {
                    closeModal(modal);
                });
            }
        });
        
        console.log('✅ Sistema de modales inicializado');
    }, 600);
}

// Funciones para abrir/cerrar modales
function openModal(modal) {
    if (!modal) {
        console.error('❌ Modal no encontrado');
        return;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Enfocar primer campo de entrada
    setTimeout(() => {
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
    
    console.log(`📋 Modal abierto: ${modal.id}`);
}

function closeModal(modal) {
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Limpiar formularios
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
    }
    
    console.log(`📋 Modal cerrado: ${modal.id}`);
}

// =========================
// 7. TOAST NOTIFICATIONS (MEJORADO)
// =========================
function showToast(message, type = 'info') {
    // Crear contenedor si no existe
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Remover toast anterior si existe
    if (currentToast) {
        currentToast.remove();
    }
    
    // Crear toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="toast-close" aria-label="Cerrar">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    currentToast = toast;
    
    // Mostrar con animación
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Botón para cerrar
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            removeToast(toast);
        });
    }
    
    // Auto-remover después de 5 segundos
    const autoRemove = setTimeout(() => {
        removeToast(toast);
    }, 5000);
    
    // Pausar auto-remover al hover
    toast.addEventListener('mouseenter', () => {
        clearTimeout(autoRemove);
    });
    
    toast.addEventListener('mouseleave', () => {
        setTimeout(() => {
            removeToast(toast);
        }, 5000);
    });
}

function removeToast(toast) {
    if (!toast || !toast.parentNode) return;
    
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
            if (currentToast === toast) {
                currentToast = null;
            }
        }
    }, 300);
}

// =========================
// 8. WHATSAPP LINKS (MEJORADO)
// =========================
function initWhatsAppLinks() {
    setTimeout(() => {
        const waLinks = document.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"]');
        
        waLinks.forEach(link => {
            // Prevenir múltiples event listeners
            if (link.hasAttribute('data-wa-processed')) return;
            link.setAttribute('data-wa-processed', 'true');
            
            link.addEventListener('click', (e) => {
                if (link.hasAttribute('target') && link.getAttribute('target') === '_blank') {
                    return; // Dejar que el navegador maneje el link normal
                }
                
                // Solo procesar si no tiene texto en la URL
                if (!link.href.includes('text=')) {
                    e.preventDefault();
                    
                    const defaultText = 'Hola Jordy! Vi tu página web y me interesan tus tutorías de programación.';
                    const customText = link.getAttribute('data-wa-text') || defaultText;
                    const encodedMessage = encodeURIComponent(customText);
                    
                    window.open(`https://wa.me/50687138971?text=${encodedMessage}`, '_blank');
                    
                    // Mostrar feedback
                    showToast('Redirigiendo a WhatsApp...', 'info');
                }
            });
        });
        
        console.log('✅ Enlaces de WhatsApp inicializados');
    }, 700);
}

// =========================
// 9. FORMULARIOS (MEJORADO)
// =========================
function initForms() {
    setTimeout(() => {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Prevenir múltiples event listeners
            if (form.hasAttribute('data-form-processed')) return;
            form.setAttribute('data-form-processed', 'true');
            
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"]');
                if (!submitBtn) return;
                
                const originalText = submitBtn.innerHTML;
                const originalDisabled = submitBtn.disabled;
                
                // Simular envío
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;
                
                try {
                    // Simular delay de red
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // Éxito
                    showToast('¡Mensaje enviado con éxito! Te contactaré pronto.', 'success');
                    form.reset();
                    
                    // Cerrar modal si existe
                    const modal = form.closest('.modal');
                    if (modal) {
                        setTimeout(() => {
                            closeModal(modal);
                        }, 1000);
                    }
                    
                } catch (error) {
                    showToast('Error al enviar el mensaje. Intenta de nuevo.', 'error');
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = originalDisabled;
                }
            });
        });
        
        console.log('✅ Formularios inicializados');
    }, 800);
}

// =========================
// 10. EVENT LISTENERS GLOBALES (MEJORADO)
// =========================
function initEventListeners() {
    // Smooth scroll para enlaces internos
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link && link.getAttribute('href') !== '#') {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        }
    });
    
    // Copiar al portapapeles
    document.addEventListener('click', (e) => {
        if (e.target.closest('[onclick*="copyToClipboard"]')) {
            const onclickAttr = e.target.closest('[onclick*="copyToClipboard"]').getAttribute('onclick');
            const textMatch = onclickAttr.match(/copyToClipboard\(['"]([^'"]+)['"]\)/);
            if (textMatch) {
                const text = textMatch[1];
                navigator.clipboard.writeText(text).then(() => {
                    showToast(`✅ Copiado: ${text}`, 'success');
                }).catch(err => {
                    console.error('Error al copiar:', err);
                    showToast('❌ Error al copiar', 'error');
                });
            }
        }
    });
    
    console.log('✅ Event listeners globales inicializados');
}

// =========================
// 11. FUNCIONES GLOBALES
// =========================
window.openBookingModal = function() {
    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal) {
        openModal(bookingModal);
    } else {
        // Redirigir a WhatsApp
        window.open('https://wa.me/50687138971?text=Hola Jordy! Quiero agendar una clase de programación.', '_blank');
    }
};

window.openContactModal = function() {
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        openModal(contactModal);
    }
};

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`✅ Copiado: ${text}`, 'success');
    }).catch(err => {
        console.error('Error al copiar:', err);
        showToast('❌ Error al copiar', 'error');
    });
};

// =========================
// 12. INICIALIZACIÓN MANUAL
// =========================
// Permitir inicialización manual
function manualInit() {
    if (!isInitialized) {
        initializeApp();
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', manualInit);
} else {
    // DOM ya está listo
    setTimeout(manualInit, 100);
}

// =========================
// 13. EXPORTAR FUNCIONES
// =========================
window.TutoriasJR = {
    init: manualInit,
    showToast: showToast,
    openModal: openModal,
    closeModal: closeModal,
    openBookingModal: window.openBookingModal,
    openContactModal: window.openContactModal,
    copyToClipboard: window.copyToClipboard
};

console.log('📦 Tutorías JR - Módulo cargado y listo');