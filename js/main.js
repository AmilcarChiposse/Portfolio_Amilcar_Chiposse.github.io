// ===== CONFIGURAÇÕES GERAIS =====
const CONFIG = {
    userName: 'Amílcar Chiposse',
    userEmail: 'chiposseamilcar239@gmail.com',
    userPhone: '(258) 84262-4612',
    userLocation: 'Moçambique, Zambezia-Quelimane',
    whatsappNumber: '258842624612',
    whatsappMessage: 'Olá! Vi seu portfólio e gostaria de conversar.',
    socialLinks: {
        linkedin: '#',
        github: '#',
        instagram: '#',
        twitter: '#'
    }
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== PORTFOLIO INICIALIZANDO ===');
    initApp();
});

function initApp() {
    try {
        console.log('1. Configurando informações do usuário...');
        setUserInfo();

        console.log('2. Configurando menu responsivo...');
        setupMobileMenu();

        console.log('3. Configurando scroll suave...');
        setupSmoothScroll();

        console.log('4. Configurando animações...');
        setupAnimations();

        console.log('5. Atualizando ano do copyright...');
        updateCopyrightYear();

        console.log('6. Animando barras de habilidades...');
        animateSkillBars();

        console.log('7. Configurando botões do WhatsApp...');
        setupWhatsAppButtons();

        console.log('8. Configurando sistema de preview...');
        setupPreviewSystem();

        console.log('=== PORTFOLIO INICIALIZADO COM SUCESSO ===');
    } catch (error) {
        console.error('Erro na inicialização:', error);
    }
}

// ===== CONFIGURAR INFORMAÇÕES DO USUÁRIO =====
function setUserInfo() {
    try {
        // Atualizar informações pessoais
        const elements = {
            userName: CONFIG.userName,
            userEmail: CONFIG.userEmail,
            userPhone: CONFIG.userPhone,
            userLocation: CONFIG.userLocation
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = elements[id];
        });

        // Atualizar título da página
        document.title = `Portfólio - ${CONFIG.userName} | Desenvolvedor`;

        // Atualizar nome no hero
        const heroName = document.querySelector('.highlight');
        if (heroName) {
            heroName.textContent = CONFIG.userName;
        }

        // Atualizar copyright
        const copyright = document.querySelector('.copyright');
        if (copyright) {
            copyright.innerHTML = copyright.innerHTML.replace(/\[Seu Nome\]/g, CONFIG.userName);
        }

        // Atualizar links sociais
        updateSocialLinks();
    } catch (error) {
        console.error('Erro ao configurar informações do usuário:', error);
    }
}

function updateSocialLinks() {
    try {
        const socialLinks = document.querySelectorAll('.social-link');

        socialLinks.forEach(link => {
            const title = link.getAttribute('title');
            if (title && CONFIG.socialLinks[title.toLowerCase()]) {
                link.href = CONFIG.socialLinks[title.toLowerCase()];
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar links sociais:', error);
    }
}

// ===== MENU RESPONSIVO =====
function setupMobileMenu() {
    try {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');

        if (!menuToggle || !navMenu) {
            console.warn('Elementos do menu não encontrados');
            return;
        }

        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });

        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target) && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Fechar menu com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        function toggleMenu() {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.replace('fa-bars', 'fa-times');
                } else {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            }
        }

        function closeMenu() {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) icon.classList.replace('fa-times', 'fa-bars');
        }

        // Expor funções para uso fora deste escopo (por exemplo, scroll suave)
        window.closeMenu = closeMenu;
        window.toggleMenu = toggleMenu;
    } catch (error) {
        console.error('Erro ao configurar menu responsivo:', error);
    }
}

// ===== SCROLL SUAVE =====
function setupSmoothScroll() {
    try {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Ignorar links vazios
                if (href === '#' || href === '#!') return;

                const targetElement = document.querySelector(href);
                if (!targetElement) return;

                e.preventDefault();

                // Calcular posição considerando o header fixo
                const headerEl = document.querySelector('header');
                const headerHeight = headerEl ? headerEl.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Fechar menu mobile se aberto
                const navMenu = document.getElementById('navMenu');
                if (navMenu && navMenu.classList.contains('active')) {
                    if (typeof window.closeMenu === 'function') {
                        window.closeMenu();
                    } else {
                        // fallback: apenas remover a classe
                        navMenu.classList.remove('active');
                        const menuToggle = document.getElementById('menuToggle');
                        const icon = menuToggle ? menuToggle.querySelector('i') : null;
                        if (icon) icon.classList.replace('fa-times', 'fa-bars');
                    }
                }
            });
        });
    } catch (error) {
        console.error('Erro ao configurar scroll suave:', error);
    }
}

// ===== ANIMAÇÕES =====
function setupAnimations() {
    try {
        // Animação de entrada das seções
        const sections = document.querySelectorAll('section');

        const sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Animação de cards
        const cards = document.querySelectorAll('.download-item, .skill-category, .contact-item');

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        const cardObserver = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            cardObserver.observe(card);
        });
    } catch (error) {
        console.error('Erro ao configurar animações:', error);
    }
}

// ===== ANIMAÇÃO DAS BARRAS DE HABILIDADES =====
function animateSkillBars() {
    try {
        const skillBars = document.querySelectorAll('.skill-level');

        const skillObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillLevel = entry.target;
                    const level = skillLevel.getAttribute('data-level');

                    setTimeout(() => {
                        skillLevel.style.width = `${level}%`;
                    }, 300);

                    skillObserver.unobserve(skillLevel);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    } catch (error) {
        console.error('Erro ao animar barras de habilidades:', error);
    }
}

// ===== ATUALIZAR ANO DO COPYRIGHT =====
function updateCopyrightYear() {
    try {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    } catch (error) {
        console.error('Erro ao atualizar ano do copyright:', error);
    }
}

// ===== HEADER FIXO COM EFEITO =====
let lastScroll = 0;
const header = document.querySelector('header');

if (header) {
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.padding = '0.8rem 0';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '1.2rem 0';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });
}

// ===== SISTEMA DE PREVIEW =====
function setupPreviewSystem() {
    try {
        console.log('Inicializando sistema de preview...');
        setupPreviewModal();
    } catch (error) {
        console.error('Erro ao configurar sistema de preview:', error);
    }
}

function setupPreviewModal() {
    try {
        const modal = document.getElementById('previewModal');
        const closeButtons = document.querySelectorAll('.modal-close, #closePreviewBtn');
        const downloadBtn = document.getElementById('downloadPreviewBtn');

        if (!modal) {
            console.error('Modal de preview não encontrado!');
            return;
        }

        // Fechar modal ao clicar fora
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePreviewModal();
            }
        });

        // Fechar modal com botões
        closeButtons.forEach(btn => {
            btn.addEventListener('click', closePreviewModal);
        });

        // Fechar com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closePreviewModal();
            }
        });

        // Download do preview
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                const fileName = this.getAttribute('data-file');
                const fileType = this.getAttribute('data-type');

                if (fileName && fileType) {
                    downloadFileDirect(fileName, fileType);
                    closePreviewModal();
                }
            });
        }
    } catch (error) {
        console.error('Erro ao configurar modal de preview:', error);
    }
}

// ===== FUNÇÕES DO MODAL DE PREVIEW =====
function openPreviewModal(fileName, fileType) {
    try {
        const modal = document.getElementById('previewModal');
        const downloadBtn = document.getElementById('downloadPreviewBtn');

        if (!modal || !downloadBtn) {
            console.error('Elementos do modal não encontrados');
            return;
        }

        // Configurar botão de download
        downloadBtn.setAttribute('data-file', fileName);
        downloadBtn.setAttribute('data-type', fileType);

        // Atualizar informações do arquivo
        updateFileInfo(fileName);

        // Mostrar preview apropriado
        showPreview(fileType, fileName);

        // Mostrar modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('Erro ao abrir modal de preview:', error);
        showNotification('Erro ao carregar preview', 'error');
    }
}

function closePreviewModal() {
    try {
        const modal = document.getElementById('previewModal');
        if (!modal) return;

        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        clearPreview();
    } catch (error) {
        console.error('Erro ao fechar modal:', error);
    }
}

function updateFileInfo(fileName) {
    try {
        const fileSizes = {
            'curriculo.pdf': '1.2 MB',
            'curriculo.docx': '850 KB',
            'portfolio.pdf': '2.5 MB'
        };

        const fileDates = {
            'curriculo.pdf': 'Atualizado: 20/12/2023',
            'curriculo.docx': 'Atualizado: 20/12/2023',
            'portfolio.pdf': 'Atualizado: 15/12/2023'
        };

        const fileSize = fileSizes[fileName] || '1.0 MB';
        const fileDate = fileDates[fileName] || `Atualizado: ${new Date().toLocaleDateString('pt-BR')}`;

        const fileNameElement = document.getElementById('previewFileName');
        const fileSizeElement = document.getElementById('previewFileSize');
        const fileDateElement = document.getElementById('previewFileDate');

        if (fileNameElement) fileNameElement.textContent = fileName;
        if (fileSizeElement) fileSizeElement.textContent = fileSize;
        if (fileDateElement) fileDateElement.textContent = fileDate;
    } catch (error) {
        console.error('Erro ao atualizar informações do arquivo:', error);
    }
}

function showPreview(fileType, fileName) {
    try {
        const pdfPreview = document.getElementById('pdfPreview');
        const docxPreview = document.getElementById('docxPreview');

        if (!pdfPreview || !docxPreview) {
            console.error('Elementos de preview não encontrados');
            return;
        }

        if (fileType === 'pdf') {
            pdfPreview.style.display = 'block';
            docxPreview.style.display = 'none';

            // Verificar se a função está disponível
            if (typeof window.loadPdfPreview === 'function') {
                window.loadPdfPreview(fileName);
            } else {
                showFallbackPdfPreview(fileName);
            }
        } else {
            pdfPreview.style.display = 'none';
            docxPreview.style.display = 'flex';
            showDocxPreview(fileName);
        }
    } catch (error) {
        console.error('Erro ao mostrar preview:', error);
    }
}

function showFallbackPdfPreview(fileName) {
    try {
        const placeholder = document.querySelector('.pdf-placeholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-file-pdf" style="font-size: 4rem; color: #e74c3c; margin-bottom: 1rem;"></i>
                    <h4 style="color: #2c3e50; margin-bottom: 0.5rem;">${fileName}</h4>
                    <p style="color: #777; margin-bottom: 1rem;">
                        Clique em "Baixar Agora" para obter o arquivo PDF completo.
                    </p>
                    <p style="color: #777; font-size: 0.9rem;">
                        <i class="fas fa-info-circle"></i> O preview do PDF está temporariamente indisponível.
                    </p>
                </div>
            `;
            placeholder.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao mostrar fallback do PDF:', error);
    }
}

function showDocxPreview(fileName) {
    try {
        const placeholder = document.querySelector('.docx-placeholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <i class="fas fa-file-word"></i>
                <p>Visualização do documento Word</p>
                <p class="file-info">Para visualizar o conteúdo completo, faça o download do arquivo.</p>
                <p class="file-info">Arquivo: ${fileName}</p>
            `;
        }
    } catch (error) {
        console.error('Erro ao mostrar preview do DOCX:', error);
    }
}

function clearPreview() {
    try {
        // Limpar canvas do PDF
        const canvas = document.getElementById('pdfCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = 'none';
        }

        // Resetar placeholder do PDF
        const placeholder = document.querySelector('.pdf-placeholder');
        if (placeholder) {
            placeholder.style.display = 'block';
            placeholder.innerHTML = `
                <i class="fas fa-file-pdf"></i>
                <p>Pronto para carregar o PDF</p>
            `;
        }

        // Resetar variáveis de paginação
        if (window.pageNum) window.pageNum = 1;
    } catch (error) {
        console.error('Erro ao limpar preview:', error);
    }
}

// ===== FUNÇÃO DE DOWNLOAD =====
function downloadFileDirect(fileName, fileType) {
    try {
        // Simular download (substituir por lógica real)
        showNotification(`Iniciando download de ${fileName}...`, 'info');

        setTimeout(() => {
            // Aqui você adicionaria a lógica real de download
            showNotification(`Download de ${fileName} concluído!`, 'success');
        }, 1500);
    } catch (error) {
        console.error('Erro no download:', error);
        showNotification(`Erro ao baixar ${fileName}`, 'error');
    }
}

// ===== BOTÕES DO WHATSAPP =====
function setupWhatsAppButtons() {
    try {
        // Botão de mensagem personalizada
        const customBtn = document.getElementById('customWhatsappBtn');
        const customContainer = document.getElementById('customMessageContainer');
        const customMessageInput = document.getElementById('customWhatsappMessage');
        const sendCustomBtn = document.getElementById('sendCustomMessage');
        if (customBtn && customContainer) {
            customBtn.addEventListener('click', function(e) {
                e.preventDefault();
                customContainer.style.display = customContainer.style.display === 'none' ? 'block' : 'none';
                if (customContainer.style.display === 'block' && customMessageInput) {
                    customMessageInput.focus();
                }
            });

            if (sendCustomBtn && customMessageInput) {
                sendCustomBtn.addEventListener('click', sendCustomWhatsAppMessage);
                customMessageInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendCustomBtn.click();
                    }
                });
            }
        }

        // Atualizar todos os links do WhatsApp
        updateAllWhatsAppLinks();
    } catch (error) {
        console.error('Erro ao configurar botões do WhatsApp:', error);
    }
}

function sendCustomWhatsAppMessage() {
    try {
        const customMessageInput = document.getElementById('customWhatsappMessage');
        if (!customMessageInput) return;

        const message = customMessageInput.value.trim();
        if (message) {
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');

            // Limpar e ocultar
            customMessageInput.value = '';
            document.getElementById('customMessageContainer').style.display = 'none';
        } else {
            showNotification('Por favor, digite uma mensagem', 'warning');
            customMessageInput.focus();
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem do WhatsApp:', error);
    }
}

function updateAllWhatsAppLinks() {
    try {
        const whatsappLinks = document.querySelectorAll('a[href*="whatsapp"]');

        whatsappLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.includes('wa.me/')) {
                const newHref = href.replace(/(wa\.me\/)\d+/, `$1${CONFIG.whatsappNumber}`);
                link.setAttribute('href', newHref);
            }
        });
    } catch (error) {
        console.error('Erro ao atualizar links do WhatsApp:', error);
    }
}

// ===== NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    try {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };

        notification.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

        // Adicionar estilos se não existirem
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 5px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 300px;
                    max-width: 400px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    z-index: 9999;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                }
                .notification.show { transform: translateX(0); }
                .notification-success { background-color: #2ecc71; }
                .notification-error { background-color: #e74c3c; }
                .notification-info { background-color: #3498db; }
                .notification-warning { background-color: #f39c12; }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    margin-left: auto;
                    padding: 0;
                }
            `;
            document.head.appendChild(style);
        }

        // Adicionar ao body
        document.body.appendChild(notification);

        // Mostrar notificação
        setTimeout(() => notification.classList.add('show'), 10);

        // Configurar botão de fechar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });

        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    } catch (error) {
        console.error('Erro ao mostrar notificação:', error);
    }
}

// ===== EXPORTAR FUNÇÕES PARA USO GLOBAL =====
window.openPreviewModal = openPreviewModal;
window.closePreviewModal = closePreviewModal;
window.downloadFileDirect = downloadFileDirect;
window.showNotification = showNotification;

console.log('main.js carregado com sucesso');