class PricingSystem {
    constructor() {
        this.prices = {
            python: { beginner: 6000, intermediate: 7500, advanced: 9000, description: 'Lógica, POO, APIs, Django/Flask, Data Science' },
            javascript: { beginner: 6500, intermediate: 8000, advanced: 9500, description: 'Frontend, Node.js, React, APIs, FullStack' },
            java: { beginner: 7000, intermediate: 8500, advanced: 10000, description: 'POO, Spring Boot, Android, Enterprise' },
            csharp: { beginner: 7000, intermediate: 8500, advanced: 10000, description: '.NET, ASP.NET, Unity, Windows Apps' },
            web: { beginner: 6000, intermediate: 7500, advanced: 9000, description: 'HTML/CSS, JavaScript, Responsive, UX/UI' },
            sql: { beginner: 6000, intermediate: 7500, advanced: 9000, description: 'Consultas, JOINS, Procedures, Optimization' },
            logica: { beginner: 5500, intermediate: 7000, advanced: 8500, description: 'Algoritmos, Estructuras, Resolución Problemas' },
            cpp: { beginner: 6500, intermediate: 8000, advanced: 9500, description: 'Programación Sistemas, Juegos, Performance' },
            php: { beginner: 6000, intermediate: 7500, advanced: 9000, description: 'WordPress, Laravel, Backend Web' },
            swift: { beginner: 7000, intermediate: 8500, advanced: 10000, description: 'iOS, macOS, Apple Ecosystem' }
        };

        this.discounts = {
            packages: { 4: 0.05, 6: 0.10, 8: 0.15, 10: 0.20, 12: 0.25 },
            students: 0.15,
            referrals: 0.10,
            group: 0.25
        };
    }

    calculatePrice(language, level, hours = 1) {
        const basePrice = this.prices[language]?.[level] ?? this.prices.python.beginner;

        const safeHours = Math.max(1, Number(hours) || 1);
        const subtotal = basePrice * safeHours;

        const discounts = [];
        let totalDiscount = 0;

        const packageDiscount = this.discounts.packages[safeHours] || 0;
        if (packageDiscount > 0) {
            const discountAmount = subtotal * packageDiscount;
            discounts.push({ type: 'package', percentage: packageDiscount * 100, amount: discountAmount });
            totalDiscount += discountAmount;
        }

        const total = subtotal - totalDiscount;
        const pricePerHour = total / safeHours;

        return {
            language,
            level,
            hours: safeHours,
            basePrice,
            subtotal,
            discounts,
            totalDiscount,
            total: Math.round(total),
            pricePerHour: Math.round(pricePerHour),
            description: this.prices[language]?.description || 'Tutoría personalizada'
        };
    }

    _isDarkMode() {
        return document.documentElement.getAttribute('data-mode') === 'dark';
    }

    _pdfColors(isDarkMode) {
        return {
            primary: isDarkMode ? [99, 102, 241] : [0, 102, 204],
            secondary: isDarkMode ? [16, 185, 129] : [0, 153, 102],
            background: isDarkMode ? [14, 16, 26] : [255, 255, 255],
            cardBg: isDarkMode ? [24, 28, 44] : [248, 249, 250],
            text: isDarkMode ? [241, 242, 246] : [30, 30, 46],
            muted: isDarkMode ? [170, 180, 200] : [110, 110, 110],
            line: isDarkMode ? [45, 55, 80] : [210, 210, 210],
        };
    }

    _stripEmoji(text) {
        return String(text || '').replace(/[\u{1F300}-\u{1FAFF}]/gu, '').replace(/\s{2,}/g, ' ').trim();
    }

    _money(amount, { forPDF = false } = {}) {
        const n = Number(amount) || 0;
        const formatted = n.toLocaleString('es-CR');
        return forPDF ? `CRC ${formatted}` : `₡${formatted}`;
    }

    _safeText(text) {
        return this._stripEmoji(text)
            .replace(/\u00A0/g, ' ')
            .trim();
    }

    generatePDF(type = 'cotizacion', payload = null) {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            this._toast('Error: No se pudo cargar la librería PDF.', 'error');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });

        const isDark = this._isDarkMode();
        const colors = this._pdfColors(isDark);

        doc.setFillColor(...colors.background);
        doc.rect(0, 0, 210, 297, 'F');

        if (type === 'cotizacion') {
            this._generateQuotationPDF(doc, colors, payload);
        } else if (type === 'solicitud') {
            this._generateRequestPDF(doc, colors, payload);
        } else if (type === 'presupuesto') {
            this._generateBudgetPDF(doc, colors, payload);
        }

        doc.setFontSize(9);
        doc.setTextColor(...colors.muted);
        doc.text(
            this._safeText(`Modo: ${isDark ? 'Nocturno' : 'Claro'} • Generado: ${new Date().toLocaleString('es-CR')}`),
            105, 290, { align: 'center' }
        );

        const fileName = `${type}_${Date.now()}.pdf`;
        doc.save(fileName);

        this._toast(`PDF generado (${isDark ? 'nocturno' : 'claro'})`, 'success');
    }

    _generateQuotationPDF(doc, colors, calcData) {
        const language = calcData?.language || document.getElementById('languageSelect')?.value || 'python';
        const level = calcData?.level || document.getElementById('levelSelect')?.value || 'beginner';
        const hours = Number(calcData?.hours || document.getElementById('hoursDisplay')?.textContent || 4);

        const price = this.calculatePrice(language, level, hours);

        const languageNames = {
            python: 'Python',
            javascript: 'JavaScript',
            java: 'Java',
            csharp: 'C# .NET',
            web: 'Desarrollo Web',
            sql: 'SQL y Bases de Datos',
            logica: 'Lógica de Programación',
            cpp: 'C++',
            php: 'PHP',
            swift: 'Swift'
        };

        const levelNames = { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' };

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(...colors.primary);
        doc.text(this._safeText('COTIZACION - TUTORIAS JR'), 105, 24, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(...colors.muted);
        doc.text(
            this._safeText(`Fecha: ${new Date().toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' })}`),
            20, 34
        );

        doc.setFillColor(...colors.cardBg);
        doc.roundedRect(15, 44, 180, 62, 3, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(...colors.primary);
        doc.text(this._safeText('DETALLES DE LA COTIZACION'), 105, 54, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(...colors.text);

        doc.text(this._safeText(`Lenguaje: ${languageNames[language] || language}`), 22, 66);
        doc.text(this._safeText(`Nivel: ${levelNames[level] || level}`), 22, 74);
        doc.text(this._safeText(`Horas de tutoria: ${price.hours}`), 22, 82);
        doc.setFontSize(10);
        doc.setTextColor(...colors.muted);
        doc.text(this._safeText(`Descripcion: ${price.description}`), 22, 90);

        doc.setFillColor(...colors.cardBg);
        doc.roundedRect(15, 112, 180, 88, 3, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(...colors.primary);
        doc.text(this._safeText('DETALLE DE PRECIOS'), 105, 122, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(...colors.text);

        const leftX = 22;
        const rightX = 190;

        doc.text(this._safeText('Precio base por hora:'), leftX, 136);
        doc.text(this._safeText(this._money(price.basePrice, { forPDF: true })), rightX, 136, { align: 'right' });

        doc.text(this._safeText(`Subtotal (${price.hours} horas):`), leftX, 146);
        doc.text(this._safeText(this._money(price.subtotal, { forPDF: true })), rightX, 146, { align: 'right' });

        let y = 156;

        if (price.discounts.length > 0) {
            doc.setTextColor(...colors.muted);
            doc.text(this._safeText('Descuentos aplicados:'), leftX, y);
            y += 8;

            price.discounts.forEach((d) => {
                const label = d.type === 'package'
                    ? `Paquete ${Math.round(d.percentage)}%`
                    : 'Descuento';

                doc.setTextColor(...colors.text);
                doc.text(this._safeText(`- ${label}:`), leftX + 2, y);
                doc.setTextColor(...colors.secondary);
                doc.text(this._safeText(`-${this._money(Math.round(d.amount), { forPDF: true })}`), rightX, y, { align: 'right' });
                y += 7;
            });
        } else {
            doc.setTextColor(...colors.muted);
            doc.text(this._safeText('Descuentos: Ninguno'), leftX, y);
            doc.text(this._safeText(this._money(0, { forPDF: true })), rightX, y, { align: 'right' });
            y += 10;
        }

        doc.setDrawColor(...colors.line);
        doc.line(22, y, 188, y);
        y += 10;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(...colors.secondary);
        doc.text(this._safeText('TOTAL A PAGAR:'), leftX, y);
        doc.text(this._safeText(this._money(price.total, { forPDF: true })), rightX, y, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...colors.muted);
        doc.text(this._safeText(`(${this._money(price.pricePerHour, { forPDF: true })} por hora)`), rightX, y + 6, { align: 'right' });

        doc.setFontSize(12);
        doc.setTextColor(...colors.text);
        doc.text(this._safeText('INFORMACION DE CONTACTO'), 105, 216, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(...colors.muted);
        doc.text(this._safeText('Jordy Retana - Tutor de Programacion'), 105, 224, { align: 'center' });
        doc.text(this._safeText('WhatsApp: 8713-8971'), 105, 231, { align: 'center' });
        doc.text(this._safeText('Email: jretanemendez@gmail.com'), 105, 238, { align: 'center' });
        doc.text(this._safeText('Sitio web: tutoriasjr.com'), 105, 245, { align: 'center' });

        doc.setFontSize(9);
        doc.setTextColor(...colors.muted);
        const notes = [
            '• Esta cotizacion es valida por 7 dias naturales.',
            '• El horario se reserva con el 50% del pago.',
            '• Cancelacion gratuita con 24 horas de anticipacion.',
            '• Descuentos no son acumulables con otras promociones.'
        ];
        notes.forEach((note, i) => doc.text(this._safeText(note), 20, 262 + (i * 5)));
    }

    _generateRequestPDF(doc, colors, formData) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(...colors.primary);
        doc.text(this._safeText('SOLICITUD DE TUTORIA'), 105, 24, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(...colors.muted);
        doc.text(this._safeText(`Recibida el: ${new Date().toLocaleDateString('es-CR')}`), 20, 34);

        doc.setFillColor(...colors.cardBg);
        doc.roundedRect(15, 44, 180, 92, 3, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(...colors.primary);
        doc.text(this._safeText('INFORMACION DEL CLIENTE'), 105, 54, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(...colors.text);

        const get = (k) => (formData?.get?.(k) ? String(formData.get(k)) : 'No especificado');

        const fields = [
            ['Nombre:', get('name')],
            ['Correo:', get('email')],
            ['Telefono:', get('phone')],
            ['Nivel:', get('level')],
            ['Horas por semana:', get('hours')],
            ['Presupuesto:', get('budget')]
        ];

        let y = 68;
        fields.forEach(([label, value]) => {
            doc.setTextColor(...colors.muted);
            doc.text(this._safeText(label), 22, y);
            doc.setTextColor(...colors.text);
            doc.text(this._safeText(value), 70, y);
            y += 10;
        });

        const message = formData?.get?.('message');
        if (message) {
            doc.setFillColor(...colors.cardBg);
            doc.roundedRect(15, 144, 180, 50, 3, 3, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(13);
            doc.setTextColor(...colors.primary);
            doc.text(this._safeText('OBJETIVOS'), 105, 154, { align: 'center' });

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(...colors.text);
            const lines = doc.splitTextToSize(this._safeText(message), 170);
            doc.text(lines, 20, 164);
        }
    }

    _generateBudgetPDF(doc, colors, formData) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(...colors.primary);
        doc.text(this._safeText('OPCIONES DE PRESUPUESTO'), 105, 24, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(...colors.muted);
        doc.text(this._safeText(`Solicitud: ${new Date().toLocaleDateString('es-CR')}`), 20, 34);

        doc.setFillColor(...colors.cardBg);
        doc.roundedRect(15, 44, 180, 82, 3, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(...colors.primary);
        doc.text(this._safeText('DATOS DEL SOLICITANTE'), 105, 54, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(...colors.text);

        const get = (k) => (formData?.get?.(k) ? String(formData.get(k)) : 'No especificado');
        const fields = [
            ['Nombre:', get('name')],
            ['Correo:', get('email')],
            ['Telefono:', get('phone')],
            ['Presupuesto mensual:', get('budget_amount')],
            ['Opcion:', get('budget_option')]
        ];

        let y = 68;
        fields.forEach(([label, value]) => {
            doc.setTextColor(...colors.muted);
            doc.text(this._safeText(label), 22, y);
            doc.setTextColor(...colors.text);
            doc.text(this._safeText(value), 85, y);
            y += 10;
        });

        doc.setFillColor(...colors.cardBg);
        doc.roundedRect(15, 136, 180, 90, 3, 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(...colors.primary);
        doc.text(this._safeText('OPCIONES DISPONIBLES'), 105, 146, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...colors.text);

        const options = [
            '• Sesiones en grupo (2-4 personas): hasta 40% menos',
            '• Plan estudiantil: 15% con comprobante',
            '• Frecuencia reducida: sesiones cada 2 semanas',
            '• Paquetes extendidos: mas descuento por mas horas',
            '• Pago en cuotas: opciones disponibles'
        ];
        options.forEach((line, i) => doc.text(this._safeText(line), 22, 160 + (i * 8)));
    }

    _toast(message, type = 'info') {
        if (window.TutoriasJR && typeof window.TutoriasJR.showToast === 'function') {
            window.TutoriasJR.showToast(message, type);
            return;
        }
        if (typeof window.showMessage === 'function') {
            window.showMessage(message, type);
            return;
        }
        alert((type === 'error' ? '❌ ' : type === 'success' ? '✅ ' : 'ℹ️ ') + message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.pricingSystem = new PricingSystem();

    window.generateRequestPDF = function(formData) {
        if (window.pricingSystem) window.pricingSystem.generatePDF('solicitud', formData);
    };

    window.generateBudgetPDF = function(formData) {
        if (window.pricingSystem) window.pricingSystem.generatePDF('presupuesto', formData);
    };
});