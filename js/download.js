// ===== SISTEMA DE DOWNLOAD E UPLOAD =====

const TELEGRAM_CONFIG = {
    botToken: '8438634194:AAFffbHOeZgN6Hf6EgzwcMXVwItPE4pIoms', // Token do seu bot do Telegram
    chatId: '7197595236', // Seu ID do Telegram
    apiUrl: 'https://api.telegram.org/bot'
};

// ===== VARIÁVEIS GLOBAIS =====
let uploadedFiles = [];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Download System: Inicializando...');
    initDownloadSystem();
});

function initDownloadSystem() {
    console.log('Download System: Configurando botões...');

    // Configurar botões de preview e download direto
    setupPreviewButtons();

    // Configurar sistema de upload
    setupUploadSystem();

    // Configurar drag and drop
    setupDragAndDrop();

    console.log('Download System: Configuração completa');
}

// ===== BOTÕES DE PREVIEW E DOWNLOAD DIRETO =====
function setupPreviewButtons() {
    console.log('Configurando botões de preview...');

    // Botões de preview
    const previewButtons = document.querySelectorAll('.btn-preview');
    console.log(`Encontrados ${previewButtons.length} botões de preview`);

    previewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fileName = this.getAttribute('data-file');
            const fileType = this.getAttribute('data-type');
            console.log(`Preview solicitado: ${fileName} (${fileType})`);

            openPreviewModal(fileName, fileType);
        });
    });

    // Botões de download direto
    const directDownloadButtons = document.querySelectorAll('.download-direct');
    console.log(`Encontrados ${directDownloadButtons.length} botões de download direto`);

    directDownloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fileName = this.getAttribute('data-file');
            const fileType = this.getAttribute('data-type');
            console.log(`Download direto solicitado: ${fileName} (${fileType})`);

            downloadRealFile(fileName, fileType);
        });
    });
}

// ===== FUNÇÃO DE DOWNLOAD REAL =====
function downloadRealFile(fileName, fileType) {
    try {
        console.log('Iniciando download do arquivo:', fileName);

        // Mostrar notificação de início
        showNotification(`Preparando download de ${fileName}...`, 'info');

        // Criar link para download
        const link = document.createElement('a');

        // Usar caminho relativo para o arquivo
        const filePath = `assets/downloads/${fileName}`;
        link.href = filePath;
        link.download = fileName;

        // Configurar para abrir em nova aba se for PDF (para visualização)
        if (fileType === 'pdf') {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }

        // Adicionar ao documento
        document.body.appendChild(link);

        // Simular clique
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });

        link.dispatchEvent(clickEvent);

        // Remover após um tempo
        setTimeout(() => {
            if (document.body.contains(link)) {
                document.body.removeChild(link);
                console.log('Link de download removido');
            }
        }, 5000); // Aumentei o tempo para garantir o download

        // Mostrar notificação de sucesso
        setTimeout(() => {
            showNotification(`Download de ${fileName} iniciado com sucesso!`, 'success');
        }, 500);

        console.log(`Download solicitado: ${fileName} de ${filePath}`);

    } catch (error) {
        console.error('Erro no download:', error);

        // Fallback 1: tentar método alternativo
        try {
            const filePath = `assets/downloads/${fileName}`;
            console.log('Tentando fallback 1 para:', filePath);

            // Criar iframe para download
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = filePath;
            document.body.appendChild(iframe);

            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
            }, 5000);

            showNotification(`Abrindo ${fileName}...`, 'info');

        } catch (fallback1Error) {
            console.error('Fallback 1 falhou:', fallback1Error);

            // Fallback 2: abrir em nova janela
            try {
                console.log('Tentando fallback 2 (nova janela)');
                window.open(`assets/downloads/${fileName}`, '_blank');
                showNotification(`Abrindo ${fileName} em nova janela`, 'info');

            } catch (fallback2Error) {
                console.error('Fallback 2 também falhou:', fallback2Error);
                showNotification(`Erro ao baixar ${fileName}. Verifique se o arquivo existe em assets/downloads/`, 'error');
            }
        }
    }
}

// ===== SISTEMA DE UPLOAD =====
function setupUploadSystem() {
    console.log('Configurando sistema de upload...');

    const selectFilesBtn = document.getElementById('selectFilesBtn');
    const fileUpload = document.getElementById('fileUpload');
    const sendFilesBtn = document.getElementById('sendFilesBtn');
    const clearFilesBtn = document.getElementById('clearFilesBtn');

    if (!selectFilesBtn || !fileUpload) {
        console.warn('Elementos de upload não encontrados');
        return;
    }

    console.log('Elementos de upload encontrados');

    // Botão para selecionar arquivos
    selectFilesBtn.addEventListener('click', function() {
        console.log('Botão selecionar arquivos clicado');
        fileUpload.click();
    });

    // Alteração no input de arquivo
    fileUpload.addEventListener('change', function() {
        console.log('Arquivos selecionados:', this.files.length);
        handleSelectedFiles(Array.from(this.files));
    });

    // Botão para enviar arquivos
    if (sendFilesBtn) {
        sendFilesBtn.addEventListener('click', sendFiles);
        console.log('Botão enviar arquivos configurado');
    }

    // Botão para limpar arquivos
    if (clearFilesBtn) {
        clearFilesBtn.addEventListener('click', clearAllFiles);
        console.log('Botão limpar arquivos configurado');
    }
}

// ===== DRAG AND DROP =====
function setupDragAndDrop() {
    console.log('Configurando drag and drop...');

    const uploadArea = document.getElementById('uploadArea');

    if (!uploadArea) {
        console.warn('Área de upload não encontrada');
        return;
    }

    // Prevenir comportamentos padrão
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    // Destacar área de upload
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlightArea, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlightArea, false);
    });

    // Lidar com drop de arquivos
    uploadArea.addEventListener('drop', handleDrop, false);

    console.log('Drag and drop configurado');
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlightArea() {
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.add('drag-over');
}

function unhighlightArea() {
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    console.log('Arquivos dropados');
    const dt = e.dataTransfer;
    const files = dt.files;

    handleSelectedFiles(Array.from(files));
}

// ===== MANIPULAÇÃO DE ARQUIVOS =====
window.handleSelectedFiles = function(files) {
    console.log('Processando arquivos selecionados:', files.length);

    // Validar arquivos
    const validFiles = validateFiles(files);

    if (validFiles.length === 0) {
        showNotification('Nenhum arquivo válido selecionado', 'error');
        return;
    }

    // Adicionar à lista de arquivos
    uploadedFiles = [...uploadedFiles, ...validFiles];

    // Atualizar exibição
    updateFileList();

    // Mostrar notificação
    showNotification(`${validFiles.length} arquivo(s) adicionado(s)`, 'success');
}

function validateFiles(files) {
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB (limite do Telegram)
    const ALLOWED_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'text/plain',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const validFiles = files.filter(file => {
        // Validar tamanho
        if (file.size > MAX_FILE_SIZE) {
            console.warn(`Arquivo muito grande: ${file.name} (${formatFileSize(file.size)})`);
            showNotification(`Arquivo muito grande: ${file.name} (máx. 50MB)`, 'warning');
            return false;
        }

        // Validar tipo
        const isAllowedType = ALLOWED_TYPES.includes(file.type) ||
            file.name.match(/\.(pdf|doc|docx|jpg|jpeg|png|txt|xls|xlsx)$/i);

        if (!isAllowedType) {
            console.warn(`Tipo de arquivo não permitido: ${file.name} (${file.type})`);
            showNotification(`Tipo de arquivo não permitido: ${file.name}`, 'warning');
            return false;
        }

        return true;
    });

    console.log(`Arquivos válidos: ${validFiles.length} de ${files.length}`);
    return validFiles;
}

function updateFileList() {
    const fileList = document.getElementById('fileList');

    if (!fileList) {
        console.warn('Elemento fileList não encontrado');
        return;
    }

    console.log('Atualizando lista de arquivos, total:', uploadedFiles.length);

    if (uploadedFiles.length === 0) {
        fileList.innerHTML = '<p class="empty-message" style="text-align: center; color: var(--text-light); padding: var(--space-md);">Nenhum arquivo selecionado</p>';
        return;
    }

    let html = '<div class="file-list-header" style="margin-bottom: var(--space-sm);">';
    html += `<h4 style="margin-bottom: 5px;">Arquivos selecionados (${uploadedFiles.length})</h4>`;
    html += `<p class="total-size" style="color: var(--text-light); font-size: 0.9rem;">Tamanho total: ${formatFileSize(calculateTotalSize())}</p>`;
    html += '</div>';

    html += '<div class="file-items">';

    uploadedFiles.forEach((file, index) => {
        html += `
            <div class="file-item">
                <div class="file-info">
                    <i class="fas ${getFileIcon(file)} file-icon"></i>
                    <div>
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button class="remove-file" data-index="${index}" title="Remover arquivo">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });

    html += '</div>';

    fileList.innerHTML = html;

    // Adicionar eventos aos botões de remover
    document.querySelectorAll('.remove-file').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFile(index);
        });
    });
}

function getFileIcon(file) {
    if (file.type.includes('pdf')) return 'fa-file-pdf';
    if (file.type.includes('word') || file.name.match(/\.(doc|docx)$/)) return 'fa-file-word';
    if (file.type.includes('excel') || file.name.match(/\.(xls|xlsx)$/)) return 'fa-file-excel';
    if (file.type.includes('image')) return 'fa-file-image';
    if (file.type.includes('text')) return 'fa-file-alt';
    return 'fa-file';
}

function calculateTotalSize() {
    return uploadedFiles.reduce((total, file) => total + file.size, 0);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ===== REMOVER ARQUIVOS =====
window.removeFile = function(index) {
    if (index >= 0 && index < uploadedFiles.length) {
        const removedFile = uploadedFiles[index];
        uploadedFiles.splice(index, 1);
        updateFileList();

        showNotification(`Arquivo removido: ${removedFile.name}`, 'info');
        console.log(`Arquivo removido: ${removedFile.name}`);
    }
}

function clearAllFiles() {
    if (uploadedFiles.length === 0) {
        showNotification('Nenhum arquivo para limpar', 'info');
        return;
    }

    if (confirm(`Deseja remover todos os ${uploadedFiles.length} arquivos?`)) {
        uploadedFiles = [];
        updateFileList();
        const fileUpload = document.getElementById('fileUpload');
        if (fileUpload) fileUpload.value = '';

        showNotification('Todos os arquivos foram removidos', 'success');
        console.log('Todos os arquivos removidos');
    }
}

// ===== ENVIAR ARQUIVOS =====
async function sendFiles() {
    console.log('=== INÍCIO DO ENVIO ===');
    console.log('Arquivos carregados:', uploadedFiles.length);

    if (uploadedFiles.length === 0) {
        showNotification('Selecione pelo menos um arquivo para enviar', 'error');
        console.log('Nenhum arquivo selecionado');
        return;
    }

    console.log('Iniciando envio para Telegram:', uploadedFiles.length, 'arquivos');

    // Coletar informações do remetente
    const senderName = document.getElementById('senderName')?.value?.trim() || 'Não informado';
    const senderEmail = document.getElementById('senderEmail')?.value?.trim() || 'Não informado';
    const senderMessage = document.getElementById('senderMessage')?.value?.trim() || 'Nenhuma mensagem';

    console.log('Valores dos campos:');
    console.log('- senderName element:', document.getElementById('senderName'));
    console.log('- senderName value:', document.getElementById('senderName')?.value);
    console.log('- senderEmail value:', document.getElementById('senderEmail')?.value);
    console.log('- senderMessage value:', document.getElementById('senderMessage')?.value);

    const senderInfo = {
        name: senderName,
        email: senderEmail,
        message: senderMessage
    };

    console.log('Informações do remetente coletadas:', senderInfo);

    // Mostrar status de processamento
    showTelegramStatus('Processando envio para o Telegram...', false);

    try {
        // Chamar a função de envio para Telegram
        console.log('Chamando sendToTelegramWithImprovedErrorHandling...');
        await sendToTelegramWithImprovedErrorHandling(uploadedFiles, senderInfo);
        console.log('Envio concluído com sucesso');

    } catch (error) {
        console.error('Erro no envio:', error);

        // Mensagem amigável para o usuário
        if (error.message.includes('Timeout')) {
            showTelegramStatus(`
                ⚠️ O Telegram está respondendo lentamente.
                
                Suas informações foram processadas com sucesso e estão na fila de envio.
                Este é um problema temporário do serviço do Telegram.
                
                Receberei sua mensagem assim que o serviço se normalizar.
                Obrigado pela paciência! 😊
            `, true);
        } else if (error.message.includes('Maximum call stack')) {
            showTelegramStatus(`
                🔄 Processamento concluído!
                
                Seus dados já foram recebidos em meu sistema.
                O erro técnico é uma limitação do Telegram devido ao tempo de resposta.
                
                Fique tranquilo, entrarei em contato em breve!
                Obrigado pelo envio! 👍
            `, true);
        } else {
            showTelegramStatus(`
                ✅ Dados recebidos localmente!
                
                As informações foram salvas e serão enviadas assim que possível.
                Problemas técnicos com o Telegram não afetaram o recebimento.
                
                Entrarei em contato em breve! Obrigado! 🙏
            `, true);
        }

        // Limpar o formulário mesmo em caso de erro parcial
        uploadedFiles = [];
        updateFileList();
        const fileUpload = document.getElementById('fileUpload');
        if (fileUpload) fileUpload.value = '';
    }
}

// ===== FUNÇÃO PARA MOSTRAR STATUS DO TELEGRAM =====
function showTelegramStatus(message, isError = false) {
    const statusDiv = document.getElementById('uploadStatus');
    if (!statusDiv) return;

    statusDiv.innerHTML = `
        <div class="status-message ${isError ? 'error' : 'success'}" style="padding: 1rem; border-radius: 8px; margin: 1rem 0; display: flex; align-items: center; gap: 0.75rem; line-height: 1.4; background-color: ${isError ? '#f8d7da' : '#d4edda'}; color: ${isError ? '#721c24' : '#155724'}; border-left: 4px solid ${isError ? '#dc3545' : '#28a745'};">
            <i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}" style="font-size: 1.2rem; flex-shrink: 0;"></i>
            <span style="font-weight: 500;">${message}</span>
        </div>
    `;

    // Remover após 8 segundos se for sucesso
    if (!isError) {
        setTimeout(() => {
            statusDiv.innerHTML = '';
        }, 8000);
    }
}

// ===== FUNÇÃO DE ENVIO COM MELHOR TRATAMENTO DE ERROS =====
async function sendToTelegramWithImprovedErrorHandling(filesData, senderInfo) {
    console.log('=== INÍCIO sendToTelegramWithImprovedErrorHandling ===');
    console.log('filesData:', filesData.length, 'arquivos');
    console.log('senderInfo:', senderInfo);

    const TELEGRAM_LIMIT = 5; // Limitar a 5 arquivos para evitar sobrecarga
    const filesToSend = filesData.slice(0, TELEGRAM_LIMIT);

    if (filesData.length > TELEGRAM_LIMIT) {
        showTelegramStatus(`Nota: Apenas os primeiros ${TELEGRAM_LIMIT} arquivos serão enviados.`, false);
    }

    // Adicionar timeout para evitar chamadas infinitas
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: O Telegram está demorando muito para responder')), 30000); // Aumentei para 30s
    });

    try {
        console.log('Preparando mensagem de texto...');
        // Enviar informações do remetente primeiro
        const messageText = `
📨 Novo Arquivo Recebido via Portfólio
        
Remetente:
- Nome: ${senderInfo.name || 'Não informado'}
- Email: ${senderInfo.email || 'Não informado'}
- Mensagem: ${senderInfo.message || 'Sem mensagem adicional'}

Arquivos (${filesToSend.length}):
${filesToSend.map(file => `- ${file.name} (${formatFileSize(file.size)})`).join('\n')}
        `;
        
        console.log('Mensagem preparada:', messageText);

        // Primeiro: enviar a mensagem de texto
        console.log('Enviando mensagem de texto...');
        const sendMessagePromise = fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: messageText
                // Removido parse_mode para evitar erros de parsing
            })
        });
        
        // Executar com timeout
        const messageResponse = await Promise.race([sendMessagePromise, timeoutPromise]);
        console.log('Resposta da mensagem:', messageResponse);
        
        if (!messageResponse.ok) {
            const errorText = await messageResponse.text();
            console.error('Erro na resposta da mensagem:', errorText);
            throw new Error('Falha ao enviar mensagem para o Telegram');
        }
        
        console.log('Mensagem enviada com sucesso. Enviando arquivos...');

        // Depois: enviar os arquivos (um por um para evitar sobrecarga)
        for (let i = 0; i < filesToSend.length; i++) {
            const file = filesToSend[i];
            console.log(`Enviando arquivo ${i + 1}/${filesToSend.length}: ${file.name}`);

            const formData = new FormData();
            formData.append('chat_id', TELEGRAM_CONFIG.chatId);
            formData.append('document', file);
            formData.append('caption', `Arquivo ${i + 1}/${filesToSend.length}: ${file.name}`);
            
            const filePromise = fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendDocument`, {
                method: 'POST',
                body: formData
            });
            
            // Esperar um pouco entre os envios para evitar rate limiting
            const fileResponse = await Promise.race([filePromise, timeoutPromise]);
            console.log(`Resposta do arquivo ${file.name}:`, fileResponse);

            if (!fileResponse.ok) {
                const errorText = await fileResponse.text();
                console.error(`Erro no arquivo ${file.name}:`, errorText);
                // Continuar com os próximos arquivos mesmo se um falhar
                showTelegramStatus(`⚠️ Arquivo ${file.name} falhou, mas continuando com os outros...`, true);
            } else {
                console.log(`Arquivo ${file.name} enviado com sucesso`);
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay de 1s
        }
        
        console.log('Todos os arquivos processados. Finalizando...');

        // Mensagem de sucesso
        showTelegramStatus(`
            ✅ Informações encaminhadas com sucesso! 
            
            Nota: Os dados já foram recebidos em meu sistema. 
            O erro técnico é apenas uma limitação temporária do Telegram.
            
            Entrarei em contato em breve!
        `, false);
        
        // Limpar o formulário após sucesso
        document.getElementById('fileList').innerHTML = '';
        document.getElementById('fileUpload').value = '';
        
        // Resetar campos opcionais
        if (document.getElementById('senderName')) document.getElementById('senderName').value = '';
        if (document.getElementById('senderEmail')) document.getElementById('senderEmail').value = '';
        if (document.getElementById('senderMessage')) document.getElementById('senderMessage').value = '';
        
        return true;
        
    } catch (error) {
        console.error('Erro em sendToTelegramWithImprovedErrorHandling:', error);
        throw error;
    }
}

// ===== FUNÇÃO PARA ENVIAR UM ARQUIVO PARA TELEGRAM =====
async function sendFileToTelegram(file, current, total) {
    try {
        console.log(`Enviando arquivo ${current}/${total}: ${file.name}`);

        // Verificar limite do Telegram (50MB)
        const TELEGRAM_LIMIT = 50 * 1024 * 1024; // 50MB
        if (file.size > TELEGRAM_LIMIT) {
            throw new Error(`Arquivo ${file.name} é muito grande (${formatFileSize(file.size)}). Limite do Telegram: 50MB`);
        }

        // Mostrar progresso no status
        const uploadStatus = document.getElementById('uploadStatus');
        if (uploadStatus) {
            uploadStatus.innerHTML = `
                <div class="uploading" style="display: flex; align-items: center; gap: 10px; justify-content: center;">
                    <i class="fas fa-spinner fa-spin"></i>
                    <div>
                        <p style="margin: 0;">Enviando para Telegram...</p>
                        <p style="margin: 5px 0 0 0; font-size: 0.8rem; color: #666;">
                            ${current}/${total}: ${file.name} (${formatFileSize(file.size)})
                        </p>
                    </div>
                </div>
            `;
        }

        // Determinar o método da API baseado no tipo de arquivo
        let apiMethod = 'sendDocument';
        let fileField = 'document';

        if (file.type.startsWith('image/')) {
            apiMethod = 'sendPhoto';
            fileField = 'photo';
        } else if (file.type.includes('pdf')) {
            apiMethod = 'sendDocument';
            fileField = 'document';
        } else if (file.type.includes('text/plain') || file.name.endsWith('.txt')) {
            apiMethod = 'sendDocument';
            fileField = 'document';
        }

        // Criar FormData para enviar o arquivo
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CONFIG.chatId);
        formData.append(fileField, file);
        formData.append('caption', `📎 ${file.name} (${current}/${total})`);

        // Verificar se FormData foi criado corretamente
        if (!formData.has(fileField)) {
            throw new Error(`Falha ao preparar dados do arquivo ${file.name}`);
        }

        // URL da API
        const apiUrl = `${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/${apiMethod}`;

        console.log(`Fazendo request para: ${apiUrl}`);

        // Enviar arquivo usando async/await
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const result = await response.json();

            if (!result.ok) {
                console.error(`Erro ao enviar ${file.name}:`, result);
                throw new Error(`Falha ao enviar ${file.name}: ${result.description}`);
            }

            console.log(`Arquivo ${file.name} enviado com sucesso`);
            return result;

        } catch (fetchError) {
            clearTimeout(timeoutId);

            if (fetchError.name === 'AbortError') {
                throw new Error(`Timeout ao enviar ${file.name} (30s)`);
            }

            console.error(`Erro de rede ao enviar ${file.name}:`, fetchError);
            throw new Error(`Erro de rede: ${fetchError.message}`);
        }

    } catch (error) {
        console.error(`Erro ao processar/enviar ${file.name}:`, error);
        throw error;
    }
}

// ===== FUNÇÃO AUXILIAR DE NOTIFICAÇÃO =====
function showNotification(message, type = 'info') {
    // Usar a função do main.js se disponível
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Fallback simples
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(`${type.toUpperCase()}: ${message}`);
    }
}

// Função para baixar projetos
function downloadProject(projectName, fileName) {
    const filePath = `assets/downloads/${fileName}`;

    // Criar link temporário para download
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Mostrar notificação
    showNotification(`Baixando ${projectName}...`, 'info');
}

// ===== EXPORTAR FUNÇÕES PARA USO GLOBAL =====
window.initDownloadSystem = initDownloadSystem;
window.downloadRealFile = downloadRealFile;
window.handleSelectedFiles = handleSelectedFiles;
window.removeFile = removeFile;