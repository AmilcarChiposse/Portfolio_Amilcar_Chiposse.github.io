// ===== PREVIEW DE PDF SIMPLIFICADO =====

// Variáveis globais
let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let isRendering = false;
let pendingPage = null;
const scale = 1.0; // Escala menor para melhor visualização

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('PDF Preview inicializado');
    setupPaginationControls();
});

// Configurar controles de paginação
function setupPaginationControls() {
    // Botão anterior
    const prevBtn = document.getElementById('prevPage');
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
        });
    }

    // Próxima página
    const nextBtn = document.getElementById('nextPage');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (pdfDoc && currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
            }
        });
    }

    // Ir para página específica
    const pageInput = document.getElementById('pageInput');
    const goToPageBtn = document.getElementById('goToPage');

    if (pageInput && goToPageBtn) {
        goToPageBtn.addEventListener('click', function() {
            goToPage();
        });

        pageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                goToPage();
            }
        });
    }
}

function goToPage() {
    const pageInput = document.getElementById('pageInput');
    if (!pageInput || !pdfDoc) return;

    const pageNum = parseInt(pageInput.value);
    if (pageNum > 0 && pageNum <= totalPages) {
        currentPage = pageNum;
        renderPage(currentPage);
        pageInput.value = '';
    }
}

// Carregar PDF
async function loadPdfPreview(fileName) {
    try {
        console.log('Carregando PDF:', fileName);

        // Verificar se o arquivo existe antes de tentar carregar
        const pdfPath = `assets/downloads/${fileName}`;
        const response = await fetch(pdfPath, { method: 'HEAD' });
        
        if (!response.ok) {
            console.warn(`Arquivo ${fileName} não encontrado em ${pdfPath}`);
            showFileNotFoundError(fileName, pdfPath);
            return;
        }

        // Mostrar estado de carregamento
        showLoadingState();

        // Resetar
        currentPage = 1;
        totalPages = 0;

        // Verificar se está rodando via file:// (aberto diretamente no navegador)
        if (window.location.protocol === 'file:') {
            // Usar embed para preview local
            console.log('Usando embed para preview local');
            const placeholder = document.querySelector('.pdf-placeholder');
            placeholder.innerHTML = `
                <div style="text-align: center; padding: 1rem;">
                    <i class="fas fa-file-pdf" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                    <p>Pré-visualização local do PDF</p>
                    <embed src="${pdfPath}" type="application/pdf" width="100%" height="100%" style="border: 1px solid #ddd; border-radius: 5px;">
                    <p style="font-size: 0.9rem; color: #777; margin-top: 1rem;">
                        Se o PDF não carregar, execute o site em um servidor local (ex: Live Server no VS Code).
                    </p>
                </div>
            `;
            placeholder.style.display = 'block';

            // Esconder canvas
            const canvas = document.getElementById('pdfCanvas');
            if (canvas) {
                canvas.style.display = 'none';
            }

            // Esconder paginação
            const pagination = document.querySelector('.pdf-pagination');
            if (pagination) {
                pagination.style.display = 'none';
            }

            return;
        }

        // Para servidores HTTP, usar PDF.js
        // Verificar se PDF.js está disponível
        if (typeof pdfjsLib === 'undefined') {
            console.error('PDF.js não carregado');
            showFallbackPreview(fileName);
            return;
        }

        // Configurar worker do PDF.js
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        }

        // Carregar o documento PDF
        const loadingTask = pdfjsLib.getDocument(pdfPath);

        loadingTask.onProgress = function(progress) {
            console.log(`Carregando: ${Math.round((progress.loaded / progress.total) * 100)}%`);
        };

        pdfDoc = await loadingTask.promise;
        totalPages = pdfDoc.numPages;

        console.log(`PDF carregado: ${totalPages} páginas`);

        // Atualizar contador de páginas
        updatePageCounter();

        // Mostrar controles de paginação
        showPaginationControls();

        // Renderizar primeira página
        await renderPage(currentPage);

    } catch (error) {
        console.error('Erro ao carregar PDF:', error);
        showErrorState(fileName, error.message);
    }
}

// Mostrar estado de carregamento
function showLoadingState() {
    const placeholder = document.querySelector('.pdf-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #3498db; margin-bottom: 1rem;"></i>
                <p>Carregando pré-visualização...</p>
                <p style="font-size: 0.9rem; color: #777;">Por favor, aguarde</p>
            </div>
        `;
        placeholder.style.display = 'block';
    }

    // Esconder canvas
    const canvas = document.getElementById('pdfCanvas');
    if (canvas) {
        canvas.style.display = 'none';
    }
}

// Mostrar erro
function showErrorState(fileName, errorMsg) {
    const placeholder = document.querySelector('.pdf-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f39c12; margin-bottom: 1rem;"></i>
                <p style="color: #e74c3c; font-weight: bold;">Não foi possível carregar o preview</p>
                <p style="color: #777; margin: 1rem 0;">
                    ${errorMsg || 'Erro ao carregar o arquivo PDF'}
                </p>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
                    <p style="margin: 0.5rem 0; color: #555;">
                        <i class="fas fa-info-circle"></i> 
                        Você ainda pode baixar o arquivo completo clicando em "Baixar Agora"
                    </p>
                </div>
                <div style="margin-top: 1.5rem;">
                    <button class="btn btn-primary" onclick="downloadCurrentFile()" style="margin-right: 0.5rem;">
                        <i class="fas fa-download"></i> Baixar Agora
                    </button>
                    <button class="btn btn-secondary" onclick="retryLoadPdf()">
                        <i class="fas fa-redo"></i> Tentar Novamente
                    </button>
                </div>
            </div>
        `;
        placeholder.style.display = 'block';
    }

    console.error('Erro no preview do PDF:', errorMsg);
}

// Mostrar preview alternativo
function showFallbackPreview(fileName) {
    const placeholder = document.querySelector('.pdf-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-file-pdf" style="font-size: 4rem; color: #e74c3c; margin-bottom: 1rem;"></i>
                <h4 style="color: #2c3e50; margin-bottom: 0.5rem;">${fileName}</h4>
                <p style="color: #777; margin-bottom: 1rem;">
                    Para visualizar este PDF, faça o download do arquivo.
                </p>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
                    <p style="margin: 0.5rem 0; color: #555;">
                        <i class="fas fa-download"></i> 
                        Clique em "Baixar Agora" para obter o arquivo completo
                    </p>
                </div>
                <button class="btn btn-primary" onclick="downloadCurrentFile()">
                    <i class="fas fa-download"></i> Baixar Agora
                </button>
            </div>
        `;
        placeholder.style.display = 'block';
    }
}

// Renderizar página
async function renderPage(pageNum) {
    if (!pdfDoc || isRendering) {
        pendingPage = pageNum;
        return;
    }

    isRendering = true;

    try {
        console.log(`Renderizando página ${pageNum}`);

        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.getElementById('pdfCanvas');
        const context = canvas.getContext('2d');

        // Ajustar tamanho do canvas
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Limpar canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Configurar contexto de renderização
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        // Renderizar página
        await page.render(renderContext).promise;

        // Mostrar canvas
        canvas.style.display = 'block';

        // Esconder placeholder
        const placeholder = document.querySelector('.pdf-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        // Atualizar contador de página
        updatePageCounter();

        // Atualizar estado dos botões
        updatePaginationButtons();

        console.log(`Página ${pageNum} renderizada com sucesso`);

    } catch (error) {
        console.error('Erro ao renderizar página:', error);
        showErrorState('curriculo.pdf', 'Erro ao renderizar página');
    } finally {
        isRendering = false;

        // Processar página pendente
        if (pendingPage !== null) {
            renderPage(pendingPage);
            pendingPage = null;
        }
    }
}

// Atualizar contador de página
function updatePageCounter() {
    const pageNumElement = document.getElementById('pageNum');
    const pageCountElement = document.getElementById('pageCount');

    if (pageNumElement) {
        pageNumElement.textContent = currentPage;
    }

    if (pageCountElement && pdfDoc) {
        pageCountElement.textContent = totalPages;
    }
}

// Mostrar controles de paginação
function showPaginationControls() {
    const pagination = document.querySelector('.pdf-pagination');
    if (pagination) {
        pagination.style.display = 'flex';
    }
}

// Atualizar estado dos botões de paginação
function updatePaginationButtons() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
    }
}

// Limpar preview
function clearPdfPreview() {
    // Limpar canvas
    const canvas = document.getElementById('pdfCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
        canvas.height = 0;
        canvas.width = 0;
    }

    // Resetar variáveis
    pdfDoc = null;
    currentPage = 1;
    totalPages = 0;
    isRendering = false;
    pendingPage = null;

    // Mostrar placeholder
    const placeholder = document.querySelector('.pdf-placeholder');
    if (placeholder) {
        placeholder.style.display = 'block';
        placeholder.innerHTML = `
            <i class="fas fa-file-pdf"></i>
            <p>Pronto para carregar o PDF</p>
        `;
    }

    // Esconder paginação
    const pagination = document.querySelector('.pdf-pagination');
    if (pagination) {
        pagination.style.display = 'none';
    }

    // Resetar contadores
    updatePageCounter();
}

// Funções auxiliares para os botões de erro
function downloadCurrentFile() {
    const downloadBtn = document.getElementById('downloadPreviewBtn');
    if (downloadBtn) {
        const fileName = downloadBtn.getAttribute('data-file');
        const fileType = downloadBtn.getAttribute('data-type');

        if (fileName && fileType) {
            if (typeof downloadRealFile === 'function') {
                downloadRealFile(fileName, fileType);
            } else {
                // Fallback
                window.open(`assets/downloads/${fileName}`, '_blank');
            }
        }
    }
}

function retryLoadPdf() {
    const downloadBtn = document.getElementById('downloadPreviewBtn');
    if (downloadBtn) {
        const fileName = downloadBtn.getAttribute('data-file');
        clearPdfPreview();
        setTimeout(() => loadPdfPreview(fileName), 500);
    }
}

// Mostrar erro quando arquivo não existe
function showFileNotFoundError(fileName, filePath) {
    const placeholder = document.querySelector('.pdf-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f39c12; margin-bottom: 1rem;"></i>
                <p style="color: #e74c3c; font-weight: bold;">Arquivo não encontrado</p>
                <p style="color: #777; margin: 1rem 0;">
                    O arquivo <strong>${fileName}</strong> não foi encontrado no caminho esperado.
                </p>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin: 1rem 0; text-align: left;">
                    <p style="margin: 0.5rem 0; color: #555; font-family: monospace; font-size: 0.9rem;">
                        Localização esperada: ${filePath}
                    </p>
                    <p style="margin: 0.5rem 0; color: #555;">
                        <strong>Instruções:</strong>
                    </p>
                    <ul style="margin: 0.5rem 0; padding-left: 1.5rem; color: #555;">
                        <li>Coloque seu currículo PDF na pasta <code>assets/downloads/</code></li>
                        <li>Certifique-se de que o arquivo se chama <code>curriculo.pdf</code></li>
                        <li>Execute o site em um servidor local para melhor compatibilidade</li>
                    </ul>
                </div>
                <div style="margin-top: 1.5rem;">
                    <button class="btn btn-primary" onclick="retryLoadPdf()">
                        <i class="fas fa-redo"></i> Tentar Novamente
                    </button>
                    <button class="btn btn-secondary" onclick="downloadCurrentFile()" style="margin-left: 0.5rem;">
                        <i class="fas fa-download"></i> Baixar (se existir)
                    </button>
                </div>
            </div>
        `;
        placeholder.style.display = 'block';
    }

    console.error('Arquivo PDF não encontrado:', filePath);
}

// Exportar funções
window.loadPdfPreview = loadPdfPreview;
window.clearPdfPreview = clearPdfPreview;
window.downloadCurrentFile = downloadCurrentFile;
window.retryLoadPdf = retryLoadPdf;