/**
 * Servicio de envío de formularios con Formspree
 * Para Tutorías JR - Jordy Retana
 */

class FormspreeService {
    constructor() {
        this.endpoint = 'https://formspree.io/f/xaqnplrw';
        console.log('✅ FormspreeService inicializado con endpoint:', this.endpoint);
    }

    /**
     * Enviar formulario genérico a Formspree
     */
    async sendForm(formData, formType = 'booking') {
        try {
            console.log(`📤 Enviando formulario ${formType}...`);
            
            // Crear objeto con los datos
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
                console.log(`📝 Campo: ${key} = ${value}`);
            }
            
            // Agregar campos adicionales
            data['_subject'] = formType === 'booking' 
                ? '🎓 Nueva Solicitud de Tutoría - Tutorías JR' 
                : '📧 Consulta - Tutorías JR';
            
            data['_replyto'] = data.email || '';
            
            console.log('📊 Datos completos:', data);
            
            // Enviar a Formspree
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            console.log('📨 Respuesta de Formspree:', response.status, response.ok);
            
            if (response.ok) {
                console.log('✅ Formulario enviado exitosamente');
                return {
                    success: true,
                    message: formType === 'booking' 
                        ? '¡Solicitud enviada con éxito! Te contactaré en menos de 2 horas.' 
                        : '¡Mensaje enviado! Te responderé pronto.'
                };
            } else {
                const errorText = await response.text();
                console.error('❌ Error de Formspree:', response.status, errorText);
                
                // Verificar si necesita confirmación de email
                if (response.status === 302 || errorText.includes('confirm')) {
                    return {
                        success: false,
                        message: '⚠️ Por favor, confirma tu email en Formspree primero. Revisa tu bandeja de entrada o spam de jretanamendez@gmail.com'
                    };
                }
                
                return {
                    success: false,
                    message: 'Error al enviar. Por favor intenta de nuevo.'
                };
            }
            
        } catch (error) {
            console.error('❌ Error de conexión:', error);
            return {
                success: false,
                message: 'Error de conexión. Intenta de nuevo.'
            };
        }
    }

    /**
     * Validar formulario
     */
    validateForm(form) {
        console.log('🔍 Validando formulario...');
        let isValid = true;
        const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        // Limpiar errores anteriores
        requiredInputs.forEach(input => {
            input.classList.remove('error');
            const errorMsg = input.parentNode.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
        
        // Validar campos
        requiredInputs.forEach(input => {
            const value = input.value.trim();
            
            if (!value) {
                isValid = false;
                this.showError(input, 'Este campo es requerido');
                console.log(`❌ Campo vacío: ${input.name || input.id}`);
                return;
            }
            
            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    this.showError(input, 'Email inválido');
                    console.log(`❌ Email inválido: ${value}`);
                }
            }
            
            if (input.type === 'tel') {
                if (value.length < 8) {
                    isValid = false;
                    this.showError(input, 'Teléfono inválido (mínimo 8 dígitos)');
                }
            }
        });
        
        console.log(`✅ Validación ${isValid ? 'exitosa' : 'fallida'}`);
        return isValid;
    }

    /**
     * Mostrar error
     */
    showError(input, message) {
        input.classList.add('error');
        
        let errorElement = input.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('small');
            errorElement.className = 'error-message';
            errorElement.style.cssText = 'color: #ef4444 !important; font-size: 0.875rem !important; margin-top: 5px !important; display: block !important;';
            input.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    /**
     * Estado del botón
     */
    setButtonState(button, loading, text = '') {
        if (loading) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            button.disabled = true;
            button.style.opacity = '0.7';
        } else {
            button.innerHTML = text || '<i class="fas fa-paper-plane"></i> Enviar';
            button.disabled = false;
            button.style.opacity = '1';
        }
    }
}

// Crear instancia global
window.FormspreeService = new FormspreeService();

console.log('🚀 FormspreeService listo para usar');