// ===== SISTEMA DE CONTATO =====
document.addEventListener('DOMContentLoaded', function() {
    initContactSystem();
});

function initContactSystem() {
    // Configurar formulário de contato
    setupContactForm();

    // Configurar botão do WhatsApp
    setupWhatsAppButton();
}

// ===== FORMULÁRIO DE CONTATO =====
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validar formulário
        if (!validateContactForm()) {
            return;
        }

        // Coletar dados do formulário
        const formData = getFormData();

        // Enviar formulário
        sendContactForm(formData);
    });
}

function validateContactForm() {
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmailInput');
    const subject = document.getElementById('contactSubject');
    const message = document.getElementById('contactMessage');

    let isValid = true;

    // Limpar erros anteriores
    clearFormErrors();

    // Validar nome
    if (!name.value.trim()) {
        showFieldError(name, 'Por favor, insira seu nome');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showFieldError(name, 'O nome deve ter pelo menos 2 caracteres');
        isValid = false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showFieldError(email, 'Por favor, insira seu email');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showFieldError(email, 'Por favor, insira um email válido');
        isValid = false;
    }

    // Validar assunto
    if (!subject.value.trim()) {
        showFieldError(subject, 'Por favor, insira um assunto');
        isValid = false;
    } else if (subject.value.trim().length < 3) {
        showFieldError(subject, 'O assunto deve ter pelo menos 3 caracteres');
        isValid = false;
    }

    // Validar mensagem
    if (!message.value.trim()) {
        showFieldError(message, 'Por favor, insira sua mensagem');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showFieldError(message, 'A mensagem deve ter pelo menos 10 caracteres');
        isValid = false;
    } else if (message.value.trim().length > 1000) {
        showFieldError(message, 'A mensagem não pode exceder 1000 caracteres');
        isValid = false;
    }

    return isValid;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');

    if (!formGroup) return;

    // Adicionar classe de erro
    formGroup.classList.add('has-error');

    // Criar elemento de erro
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

    // Adicionar estilos se não existirem
    const styleId = 'field-error-styles';
    let style = document.getElementById(styleId);

    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .form-group.has-error input,
            .form-group.has-error textarea {
                border-color: #e74c3c;
                box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
            }
            
            .field-error {
                color: #e74c3c;
                font-size: 0.9rem;
                margin-top: 5px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
        `;
        document.head.appendChild(style);
    }

    // Verificar se já existe um erro
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        formGroup.removeChild(existingError);
    }

    // Adicionar após o campo
    formGroup.appendChild(errorElement);

    // Focar no campo com erro
    field.focus();

    // Remover erro quando o usuário começar a digitar
    const clearError = function() {
        formGroup.classList.remove('has-error');
        if (formGroup.contains(errorElement)) {
            formGroup.removeChild(errorElement);
        }
        field.removeEventListener('input', clearError);
        field.removeEventListener('change', clearError);
    };

    field.addEventListener('input', clearError);
    field.addEventListener('change', clearError);
}

function clearFormErrors() {
    const errors = document.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());

    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => group.classList.remove('has-error'));
}

function getFormData() {
    return {
        name: document.getElementById('contactName').value.trim(),
        email: document.getElementById('contactEmailInput').value.trim(),
        subject: document.getElementById('contactSubject').value.trim(),
        message: document.getElementById('contactMessage').value.trim(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        pageUrl: window.location.href
    };
}

async function sendContactForm(formData) {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.innerHTML;
    const originalDisabled = submitButton.disabled;

    try {
        // Mostrar estado de carregamento
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;

        // Em um sistema real, você faria uma requisição para o servidor
        // Exemplo:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });

        // Simular tempo de envio
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simular resposta (90% de sucesso)
        const success = Math.random() > 0.1;

        if (success) {
            // Sucesso
            showSuccessMessage(formData.name);
            resetContactForm();

            // Em um sistema real, você poderia enviar para analytics
            console.log('Formulário enviado:', formData);
        } else {
            // Erro
            throw new Error('Falha no envio da mensagem. Por favor, tente novamente.');
        }
    } catch (error) {
        // Erro no envio
        showNotification(`Erro: ${error.message}`, 'error');
    } finally {
        // Restaurar botão
        submitButton.innerHTML = originalText;
        submitButton.disabled = originalDisabled;
    }
}

function showSuccessMessage(name) {
    // Criar mensagem de sucesso
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';

    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <div>
                <h4 style="margin: 0 0 5px 0; color: #2ecc71;">Mensagem enviada com sucesso!</h4>
                <p style="margin: 0; color: #333;">Obrigado, ${name}! Entrarei em contato em breve.</p>
            </div>
        </div>
    `;

    // Adicionar estilos se não existirem
    const styleId = 'success-message-styles';
    let style = document.getElementById(styleId);

    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .success-message {
                background-color: rgba(46, 204, 113, 0.1);
                border: 2px solid #2ecc71;
                border-radius: 10px;
                padding: 20px;
                margin-top: 20px;
                animation: fadeIn 0.5s ease;
            }
            
            .success-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .success-content i {
                font-size: 2.5rem;
                color: #2ecc71;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // Inserir após o formulário
    const contactForm = document.getElementById('contactForm');
    const existingSuccess = contactForm.parentNode.querySelector('.success-message');

    if (existingSuccess) {
        contactForm.parentNode.removeChild(existingSuccess);
    }

    contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);

    // Remover após 5 segundos
    setTimeout(() => {
        if (document.body.contains(successMessage)) {
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(-10px)';
            successMessage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

            setTimeout(() => {
                if (document.body.contains(successMessage)) {
                    document.body.removeChild(successMessage);
                }
            }, 300);
        }
    }, 5000);
}

function resetContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.reset();
    }
}

// ===== BOTÃO DO WHATSAPP =====
function setupWhatsAppButton() {
    const whatsappBtn = document.getElementById('whatsappBtn');

    if (!whatsappBtn) return;

    // Adicionar evento de clique para analytics (se necessário)
    whatsappBtn.addEventListener('click', function(e) {
        // Em um sistema real, você poderia rastrear cliques aqui
        console.log('WhatsApp button clicked');

        // Você poderia adicionar analytics aqui
        // Exemplo: gtag('event', 'whatsapp_click', { ... });
    });
}

// ===== NOTIFICAÇÕES (fallback se não estiver no main.js) =====
if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(message);
    }
}