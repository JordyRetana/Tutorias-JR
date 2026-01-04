// MANEJO DE FORMULARIOS Y EMAIL PARA TUTORÍAS

class FormHandler {
    constructor() {
        this.emailService = {
            serviceId: 'service_tutorias', // Cambiar por tu service ID de EmailJS
            templateId: 'template_tutorias', // Cambiar por tu template ID
            publicKey: 'YOUR_PUBLIC_KEY' // Cambiar por tu public key
        };
        
        this.initForms();
    }
    
    initForms() {
        // Formulario de contacto
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }
        
        // Formulario de reserva
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => this.handleBookingForm(e));
        }
        
        // Formulario de cotización
        const quoteForm = document.getElementById('quoteForm');
        if (quoteForm) {
            quoteForm.addEventListener('submit', (e) => this.handleQuoteForm(e));
        }
        
        // Formulario de suscripción
        const subscribeForm = document.getElementById('subscribeForm');
        if (subscribeForm) {
            subscribeForm.addEventListener('submit', (e) => this.handleSubscribeForm(e));
        }
    }
    
    async handleContactForm(e) {
        e.preventDefault();
        const form = e.target;
        const formData = this.getFormData(form);
        
        // Validación
        if (!this.validateForm(formData, ['name', 'email', 'message'])) {
            this.showFormError(form, 'Por favor completa todos los campos requeridos');
            return;
        }
        
        try {
            this.showFormLoading(form, 'Enviando mensaje...');
            
            // Enviar por EmailJS
            await this.sendEmail({
                to_email: 'jretanemendez@gmail.com',
                subject: 'Nuevo mensaje de contacto - Tutorías',
                template: 'contact',
                data: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone || 'No especificado',
                    message: formData.message,
                    page: window.location.href,
                    date: new Date().toLocaleString('es-CR')
                }
            });
            
            // También enviar por WhatsApp si es urgente
            if (formData.urgent === 'yes') {
                const whatsappMessage = `📞 Contacto Urgente:
                
Nombre: ${formData.name}
Email: ${formData.email}
Teléfono: ${formData.phone || 'No especificado'}
Mensaje: ${formData.message.substring(0, 100)}...`;
                
                this.sendWhatsApp(whatsappMessage);
            }
            
            this.showFormSuccess(form, '¡Mensaje enviado! Te contactaré en menos de 24 horas.');
            form.reset();
            
        } catch (error) {
            console.error('Error en contacto:', error);
            this.showFormError(form, 'Error al enviar el mensaje. Intenta de nuevo.');
        } finally {
            this.hideFormLoading(form);
        }
    }
    
    async handleBookingForm(e) {
        e.preventDefault();
        const form = e.target;
        const formData = this.getFormData(form);
        
        // Validación
        const requiredFields = ['name', 'contact', 'language', 'level', 'schedule'];
        if (!this.validateForm(formData, requiredFields)) {
            this.showFormError(form, 'Por favor completa todos los campos requeridos');
            return;
        }
        
        try {
            this.showFormLoading(form, 'Procesando tu reserva...');
            
            // Calcular precio
            const priceData = window.tutoriasApp?.calculatePrice(
                formData.language.toLowerCase(),
                formData.level.toLowerCase(),
                parseInt(formData.hours) || 1
            ) || { total: 0 };
            
            // Enviar por EmailJS
            await this.sendEmail({
                to_email: 'jretanemendez@gmail.com',
                subject: '📅 Nueva Reserva de Tutoría',
                template: 'booking',
                data: {
                    ...formData,
                    price: priceData.total,
                    calculated_price: `₡${priceData.total.toLocaleString('es-CR')}`,
                    date: new Date().toLocaleString('es-CR'),
                    page: window.location.href
                }
            });
            
            // Enviar por WhatsApp al estudiante
            const studentMessage = `✅ Reserva Confirmada - Tutorías Jordy Retana
            
Hola ${formData.name},
            
Confirmo tu solicitud para tutoría de ${formData.language} (${formData.level}).
            
📅 Horario: ${formData.schedule}
⏰ Duración: ${formData.hours || 1} hora(s)
💲 Inversión: ₡${priceData.total.toLocaleString('es-CR')}
            
Te contactaré pronto para coordinar los detalles.
            
¡Nos vemos pronto! 👨‍💻
            
Jordy Retana
WhatsApp: 8713-8971`;
            
            this.sendWhatsAppToStudent(formData.contact, studentMessage);
            
            // Enviar por WhatsApp al tutor
            const tutorMessage = `📅 NUEVA RESERVA:
            
Estudiante: ${formData.name}
Contacto: ${formData.contact}
Lenguaje: ${formData.language}
Nivel: ${formData.level}
Horario: ${formData.schedule}
Horas: ${formData.hours || 1}
Precio: ₡${priceData.total.toLocaleString('es-CR')}
Objetivo: ${formData.goal || 'No especificado'}`;
            
            this.sendWhatsApp(tutorMessage);
            
            this.showFormSuccess(form, '¡Reserva confirmada! Te envié los detalles por WhatsApp.');
            form.reset();
            
            // Mostrar confeti
            window.animations?.createConfetti();
            
        } catch (error) {
            console.error('Error en reserva:', error);
            this.showFormError(form, 'Error al procesar la reserva. Intenta de nuevo.');
        } finally {
            this.hideFormLoading(form);
        }
    }
    
    async handleQuoteForm(e) {
        e.preventDefault();
        const form = e.target;
        const formData = this.getFormData(form);
        
        try {
            this.showFormLoading(form, 'Calculando cotización...');
            
            // Calcular precio personalizado
            const language = formData.language.toLowerCase();
            const level = formData.level.toLowerCase();
            const hours = parseInt(formData.hours) || 4;
            const urgency = formData.urgency === 'urgent' ? 1.2 : 1; // 20% extra por urgencia
            
            const priceData = window.tutoriasApp?.calculatePrice(language, level, hours) || { 
                base: 8000, 
                total: 32000 
            };
            
            const finalPrice = Math.round(priceData.total * urgency);
            
            // Mostrar resultado
            const resultHtml = `
                <div class="quote-result">
                    <h4>📊 Tu Cotización</h4>
                    <div class="quote-details">
                        <p><strong>Lenguaje:</strong> ${formData.language}</p>
                        <p><strong>Nivel:</strong> ${formData.level}</p>
                        <p><strong>Horas:</strong> ${hours}</p>
                        <p><strong>Precio base:</strong> ₡${priceData.base.toLocaleString('es-CR')}/hora</p>
                        <p><strong>Descuento:</strong> ${priceData.discount || 0}%</p>
                        ${urgency > 1 ? `<p><strong>Recargo por urgencia:</strong> 20%</p>` : ''}
                        <hr>
                        <p class="total-price"><strong>Total:</strong> ₡${finalPrice.toLocaleString('es-CR')}</p>
                    </div>
                    <button type="button" class="btn btn-primary mt-3" onclick="window.tutoriasApp.openModal('bookingModal')">
                        🗓️ Reservar Ahora
                    </button>
                </div>
            `;
            
            const resultContainer = form.querySelector('.quote-result-container') || 
                                   document.createElement('div');
            resultContainer.className = 'quote-result-container mt-4';
            resultContainer.innerHTML = resultHtml;
            
            if (!form.querySelector('.quote-result-container')) {
                form.appendChild(resultContainer);
            }
            
            // Enviar cotización por email
            await this.sendEmail({
                to_email: formData.email || 'jretanemendez@gmail.com',
                subject: '📋 Cotización de Tutorías',
                template: 'quote',
                data: {
                    ...formData,
                    base_price: priceData.base,
                    hours: hours,
                    discount: priceData.discount || 0,
                    urgency_fee: urgency > 1 ? 20 : 0,
                    final_price: finalPrice,
                    date: new Date().toLocaleDateString('es-CR')
                }
            });
            
        } catch (error) {
            console.error('Error en cotización:', error);
            this.showFormError(form, 'Error al calcular la cotización');
        } finally {
            this.hideFormLoading(form);
        }
    }
    
    async handleSubscribeForm(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        
        if (!this.validateEmail(email)) {
            this.showFormError(form, 'Por favor ingresa un email válido');
            return;
        }
        
        try {
            this.showFormLoading(form, 'Suscribiendo...');
            
            // Aquí iría la integración con tu servicio de email marketing
            // Por ahora, solo enviamos un email de confirmación
            
            await this.sendEmail({
                to_email: email,
                subject: '✅ Suscripción confirmada - Tutorías Jordy Retana',
                template: 'subscribe',
                data: {
                    email: email,
                    date: new Date().toLocaleDateString('es-CR'),
                    unsubscribe_link: `${window.location.origin}/unsubscribe?email=${encodeURIComponent(email)}`
                }
            });
            
            // También guardar en localStorage
            const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
            }
            
            this.showFormSuccess(form, '¡Gracias por suscribirte! Te envié un email de confirmación.');
            form.reset();
            
        } catch (error) {
            console.error('Error en suscripción:', error);
            this.showFormError(form, 'Error al procesar la suscripción');
        } finally {
            this.hideFormLoading(form);
        }
    }
    
    // Métodos auxiliares
    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        return data;
    }
    
    validateForm(data, requiredFields) {
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                return false;
            }
        }
        return true;
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    async sendEmail({ to_email, subject, template, data }) {
        // Integración con EmailJS
        // Descomenta y configura con tus credenciales
        
        /*
        return emailjs.send(
            this.emailService.serviceId,
            this.emailService.templateId,
            {
                to_email,
                subject,
                ...data,
                from_name: 'Tutorías Jordy Retana',
                reply_to: 'jretanemendez@gmail.com'
            },
            this.emailService.publicKey
        );
        */
       
        // Simulación para desarrollo
        console.log('Email enviado:', { to_email, subject, template, data });
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    sendWhatsApp(message) {
        const phone = '50687138971';
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
        
        // Abrir en nueva pestaña
        window.open(whatsappUrl, '_blank');
        
        // También registrar en localStorage
        const messages = JSON.parse(localStorage.getItem('whatsapp_messages') || '[]');
        messages.push({
            message: message,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
        localStorage.setItem('whatsapp_messages', JSON.stringify(messages));
    }
    
    sendWhatsAppToStudent(contact, message) {
        // Limpiar número de teléfono
        let phone = contact.replace(/\D/g, '');
        
        // Si no tiene código de país, agregar +506
        if (!phone.startsWith('506')) {
            phone = '506' + phone;
        }
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
        
        // Abrir en nueva pestaña
        window.open(whatsappUrl, '_blank');
    }
    
    showFormLoading(form, message = 'Procesando...') {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.dataset.originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${message}`;
            submitBtn.disabled = true;
        }
        
        // Ocultar errores anteriores
        this.hideFormError(form);
        this.hideFormSuccess(form);
    }
    
    hideFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn && submitBtn.dataset.originalText) {
            submitBtn.innerHTML = submitBtn.dataset.originalText;
            submitBtn.disabled = false;
        }
    }
    
    showFormError(form, message) {
        this.hideFormError(form);
        this.hideFormSuccess(form);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error alert alert-danger mt-3';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        form.appendChild(errorDiv);
        
        // Scroll al error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remover después de 10 segundos
        setTimeout(() => {
            if (errorDiv.parentNode === form) {
                form.removeChild(errorDiv);
            }
        }, 10000);
    }
    
    hideFormError(form) {
        const error = form.querySelector('.form-error');
        if (error) {
            error.remove();
        }
    }
    
    showFormSuccess(form, message) {
        this.hideFormError(form);
        this.hideFormSuccess(form);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success alert alert-success mt-3';
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        form.appendChild(successDiv);
        
        // Scroll al éxito
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remover después de 10 segundos
        setTimeout(() => {
            if (successDiv.parentNode === form) {
                form.removeChild(successDiv);
            }
        }, 10000);
    }
    
    hideFormSuccess(form) {
        const success = form.querySelector('.form-success');
        if (success) {
            success.remove();
        }
    }
    
    // Método para exportar datos (útil para backup)
    exportFormData() {
        const formsData = {
            contact_submissions: JSON.parse(localStorage.getItem('contact_submissions') || '[]'),
            bookings: JSON.parse(localStorage.getItem('bookings') || '[]'),
            quotes: JSON.parse(localStorage.getItem('quotes') || '[]'),
            subscribers: JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]'),
            whatsapp_messages: JSON.parse(localStorage.getItem('whatsapp_messages') || '[]'),
            export_date: new Date().toISOString()
        };
        
        // Crear archivo JSON descargable
        const dataStr = JSON.stringify(formsData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `tutorias_data_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
}

// Inicializar manejador de formularios
document.addEventListener('DOMContentLoaded', () => {
    const formHandler = new FormHandler();
    window.formHandler = formHandler;
    
    // CSS adicional para formularios
    const style = document.createElement('style');
    style.textContent = `
        .form-error {
            background: #f8d7da;
            color: #721c24;
            padding: 12px 16px;
            border-radius: 8px;
            border-left: 4px solid #dc3545;
            animation: slideIn 0.3s ease;
        }
        
        .form-success {
            background: #d4edda;
            color: #155724;
            padding: 12px 16px;
            border-radius: 8px;
            border-left: 4px solid #28a745;
            animation: slideIn 0.3s ease;
        }
        
        .quote-result {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            border: 2px solid #e9ecef;
            animation: fadeIn 0.5s ease;
        }
        
        .quote-details p {
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
        }
        
        .total-price {
            font-size: 1.2em;
            color: #4361ee;
            font-weight: bold;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px dashed #dee2e6;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .form-control:invalid {
            border-color: #dc3545;
        }
        
        .form-control:valid {
            border-color: #28a745;
        }
        
        .required::after {
            content: ' *';
            color: #dc3545;
        }
    `;
    document.head.appendChild(style);
});