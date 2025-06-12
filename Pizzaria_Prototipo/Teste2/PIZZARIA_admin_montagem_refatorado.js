// ========================================
// CÓDIGO REFATORADO - SEÇÃO "MONTE SUA PIZZA" - ADMIN
// ========================================
// Este código substitui apenas a parte problemática do PIZZARIA_admin.js
// Mantenha o resto do arquivo original e substitua apenas as funções relacionadas ao "Monte Sua Pizza"

// Estrutura para armazenar as opções da montagem de pizza (REFATORADA)
let opcoesMontagem = {
    tamanhos: [],
    ingredientes: [],
    bordas: []
};

// ID counter para garantir IDs únicos
let contadorIds = {
    tamanhos: 1,
    ingredientes: 1,
    bordas: 1
};

// ========================================
// FUNÇÕES DE CARREGAMENTO E INICIALIZAÇÃO
// ========================================

/**
 * Carrega as opções de montagem do localStorage ou inicializa com padrão
 * VERSÃO REFATORADA - Mais robusta e com melhor tratamento de dados
 */
function carregarOpcoesMontagem() {
    try {
        const opcoesSalvas = localStorage.getItem("opcoesMontagemPizzaria");
        
        if (opcoesSalvas) {
            const dados = JSON.parse(opcoesSalvas);
            
            // Valida e migra dados se necessário
            opcoesMontagem = validarEMigrarDados(dados);
        } else {
            // Dados padrão com IDs únicos
            opcoesMontagem = {
                tamanhos: [
                    { id: 1, nome: "Média - Massa Tradicional", preco: 40.00 },
                    { id: 2, nome: "Grande - Massa Tradicional", preco: 50.00 }
                ],
                ingredientes: [
                    { id: 1, nome: "Calabresa Fatiada", preco: 6.00 },
                    { id: 2, nome: "Queijo Mussarela", preco: 0.00 }
                ],
                bordas: [
                    { id: 1, nome: "Sem Borda Recheada", preco: 0.00 },
                    { id: 2, nome: "Catupiry Original", preco: 10.00 }
                ]
            };
            
            // Atualiza contadores baseado nos dados padrão
            atualizarContadores();
            salvarOpcoesMontagem();
        }
        
        console.log("Opções de montagem carregadas com sucesso:", opcoesMontagem);
        
    } catch (error) {
        console.error("Erro ao carregar opções de montagem:", error);
        showPopup("Erro ao carregar dados. Usando configuração padrão.", "error");
        
        // Fallback para dados padrão em caso de erro
        opcoesMontagem = {
            tamanhos: [{ id: 1, nome: "Média - Massa Tradicional", preco: 40.00 }],
            ingredientes: [{ id: 1, nome: "Queijo Mussarela", preco: 0.00 }],
            bordas: [{ id: 1, nome: "Sem Borda Recheada", preco: 0.00 }]
        };
        atualizarContadores();
    }
}

/**
 * Valida e migra dados antigos para nova estrutura com IDs
 */
function validarEMigrarDados(dados) {
    const dadosValidados = {
        tamanhos: [],
        ingredientes: [],
        bordas: []
    };
    
    // Processa cada tipo de opção
    ['tamanhos', 'ingredientes', 'bordas'].forEach(tipo => {
        if (dados[tipo] && Array.isArray(dados[tipo])) {
            dados[tipo].forEach((item, index) => {
                // Se o item já tem ID, mantém; senão, cria um novo
                const id = item.id || (contadorIds[tipo]++);
                
                dadosValidados[tipo].push({
                    id: id,
                    nome: item.nome || `Item ${id}`,
                    preco: typeof item.preco === 'number' ? item.preco : 0
                });
            });
        }
    });
    
    // Atualiza contadores para próximos IDs
    atualizarContadores();
    
    return dadosValidados;
}

/**
 * Atualiza os contadores de ID baseado nos dados existentes
 */
function atualizarContadores() {
    ['tamanhos', 'ingredientes', 'bordas'].forEach(tipo => {
        if (opcoesMontagem[tipo] && opcoesMontagem[tipo].length > 0) {
            const maiorId = Math.max(...opcoesMontagem[tipo].map(item => item.id || 0));
            contadorIds[tipo] = maiorId + 1;
        }
    });
}

/**
 * Salva as opções de montagem no localStorage
 * VERSÃO REFATORADA - Com tratamento de erro
 */
function salvarOpcoesMontagem() {
    try {
        localStorage.setItem("opcoesMontagemPizzaria", JSON.stringify(opcoesMontagem));
        console.log("Opções de montagem salvas com sucesso");
        return true;
    } catch (error) {
        console.error("Erro ao salvar opções de montagem:", error);
        showPopup("Erro ao salvar dados. Tente novamente.", "error");
        return false;
    }
}

// ========================================
// FUNÇÕES DE INTERFACE E ATUALIZAÇÃO
// ========================================

/**
 * Atualiza as tabelas de gerenciamento de opções na interface administrativa
 * VERSÃO REFATORADA - Mais robusta e com melhor tratamento de erros
 */
function atualizarTabelasOpcoesMontagem() {
    const tabelas = {
        tamanhos: document.getElementById("lista-tamanhos"),
        ingredientes: document.getElementById("lista-ingredientes-admin"),
        bordas: document.getElementById("lista-bordas-admin")
    };

    try {
        for (const tipo in tabelas) {
            const tabela = tabelas[tipo];
            
            if (!tabela) {
                console.warn(`Tabela ${tipo} não encontrada no DOM`);
                continue;
            }
            
            // Limpa tabela
            tabela.innerHTML = "";
            
            // Verifica se existem dados para este tipo
            if (!opcoesMontagem[tipo] || !Array.isArray(opcoesMontagem[tipo])) {
                tabela.innerHTML = "<tr><td colspan='3'>Nenhum item cadastrado</td></tr>";
                continue;
            }
            
            // Popula tabela com dados
            opcoesMontagem[tipo].forEach((item) => {
                const linha = criarLinhaTabela(tipo, item);
                tabela.insertAdjacentHTML('beforeend', linha);
            });
        }
        
        console.log("Tabelas atualizadas com sucesso");
        
    } catch (error) {
        console.error("Erro ao atualizar tabelas:", error);
        showPopup("Erro ao atualizar interface. Recarregue a página.", "error");
    }
}

/**
 * Cria HTML para uma linha da tabela
 */
function criarLinhaTabela(tipo, item) {
    const podeExcluir = !(tipo === "bordas" && item.nome === "Sem Borda Recheada");
    const botaoExcluir = podeExcluir 
        ? `<button class="btn-excluir" onclick="excluirOpcaoMontagem('${tipo}', ${item.id})">
             <i class="fas fa-trash-alt"></i>
           </button>`
        : '<span class="texto-protegido">Protegido</span>';

    return `
        <tr data-id="${item.id}">
            <td>${item.nome}</td>
            <td>R$ ${item.preco.toFixed(2)}</td>
            <td>${botaoExcluir}</td>
        </tr>
    `;
}

// ========================================
// FUNÇÕES DE ADIÇÃO E REMOÇÃO
// ========================================

/**
 * Adiciona uma nova opção de montagem (tamanho, ingrediente ou borda)
 * VERSÃO REFATORADA - Mais robusta e com melhor validação
 */
function adicionarOpcaoMontagem(tipo) {
    console.log(`Iniciando adição de ${tipo}`);
    
    try {
        // Valida tipo
        if (!['tamanhos', 'ingredientes', 'bordas'].includes(tipo)) {
            throw new Error(`Tipo inválido: ${tipo}`);
        }
        
        // Obtém elementos de input
        const inputs = obterInputsPorTipo(tipo);
        if (!inputs.nomeInput || !inputs.precoInput) {
            throw new Error(`Elementos de input não encontrados para ${tipo}`);
        }
        
        // Obtém e valida dados
        const nome = inputs.nomeInput.value.trim();
        const precoStr = inputs.precoInput.value.trim();
        const preco = parseFloat(precoStr);
        
        console.log(`Dados obtidos - Nome: "${nome}", Preço: "${precoStr}" (${preco})`);
        
        // Validações
        if (!nome) {
            throw new Error("Nome é obrigatório");
        }
        
        if (isNaN(preco) || preco < 0) {
            throw new Error("Preço deve ser um número válido maior ou igual a zero");
        }
        
        // Verifica duplicatas
        if (verificarDuplicata(tipo, nome)) {
            throw new Error(`A opção "${nome}" já existe em ${tipo}`);
        }
        
        // Cria novo item
        const novoItem = {
            id: contadorIds[tipo]++,
            nome: nome,
            preco: preco
        };
        
        // Adiciona ao array
        if (!opcoesMontagem[tipo]) {
            opcoesMontagem[tipo] = [];
        }
        opcoesMontagem[tipo].push(novoItem);
        
        // Salva dados
        if (!salvarOpcoesMontagem()) {
            throw new Error("Falha ao salvar dados");
        }
        
        // Atualiza interface
        atualizarTabelasOpcoesMontagem();
        
        // Limpa campos
        inputs.nomeInput.value = "";
        inputs.precoInput.value = "";
        
        // Feedback de sucesso
        showPopup(`"${nome}" adicionado com sucesso!`, "success");
        console.log(`${tipo} adicionado com sucesso:`, novoItem);
        
    } catch (error) {
        console.error(`Erro ao adicionar ${tipo}:`, error);
        showPopup(`Erro: ${error.message}`, "error");
    }
}

/**
 * Obtém elementos de input baseado no tipo
 */
function obterInputsPorTipo(tipo) {
    const mapeamento = {
        tamanhos: {
            nomeInput: document.getElementById("tamanho-nome"),
            precoInput: document.getElementById("tamanho-preco")
        },
        ingredientes: {
            nomeInput: document.getElementById("ingrediente-nome"),
            precoInput: document.getElementById("ingrediente-preco")
        },
        bordas: {
            nomeInput: document.getElementById("borda-nome"),
            precoInput: document.getElementById("borda-preco")
        }
    };
    
    return mapeamento[tipo] || {};
}

/**
 * Verifica se já existe um item com o mesmo nome
 */
function verificarDuplicata(tipo, nome) {
    if (!opcoesMontagem[tipo]) return false;
    
    return opcoesMontagem[tipo].some(item => 
        item.nome.toLowerCase() === nome.toLowerCase()
    );
}

/**
 * Exclui uma opção de montagem
 * VERSÃO REFATORADA - Usa ID em vez de índice
 */
function excluirOpcaoMontagem(tipo, id) {
    console.log(`Iniciando exclusão de ${tipo} com ID ${id}`);
    
    try {
        // Valida tipo
        if (!['tamanhos', 'ingredientes', 'bordas'].includes(tipo)) {
            throw new Error(`Tipo inválido: ${tipo}`);
        }
        
        // Verifica se o array existe
        if (!opcoesMontagem[tipo] || !Array.isArray(opcoesMontagem[tipo])) {
            throw new Error(`Array ${tipo} não encontrado`);
        }
        
        // Encontra o item
        const index = opcoesMontagem[tipo].findIndex(item => item.id === id);
        if (index === -1) {
            throw new Error(`Item com ID ${id} não encontrado em ${tipo}`);
        }
        
        const item = opcoesMontagem[tipo][index];
        
        // Proteção para "Sem Borda Recheada"
        if (tipo === "bordas" && item.nome === "Sem Borda Recheada") {
            throw new Error("A opção 'Sem Borda Recheada' não pode ser excluída");
        }
        
        // Confirma exclusão
        if (!confirm(`Tem certeza que deseja excluir "${item.nome}"?`)) {
            return;
        }
        
        // Remove do array
        opcoesMontagem[tipo].splice(index, 1);
        
        // Salva dados
        if (!salvarOpcoesMontagem()) {
            throw new Error("Falha ao salvar dados após exclusão");
        }
        
        // Atualiza interface
        atualizarTabelasOpcoesMontagem();
        
        // Feedback de sucesso
        showPopup(`"${item.nome}" excluído com sucesso!`, "success");
        console.log(`${tipo} excluído com sucesso:`, item);
        
    } catch (error) {
        console.error(`Erro ao excluir ${tipo}:`, error);
        showPopup(`Erro: ${error.message}`, "error");
    }
}

// ========================================
// INTEGRAÇÃO COM SISTEMA EXISTENTE
// ========================================

/**
 * Função para integrar com a função mostrarSecao existente
 * Chama esta função quando a seção "monte-sua-pizza" for ativada
 */
function inicializarSecaoMonteSuaPizza() {
    console.log("Inicializando seção Monte Sua Pizza...");
    
    try {
        carregarOpcoesMontagem();
        atualizarTabelasOpcoesMontagem();
        console.log("Seção Monte Sua Pizza inicializada com sucesso");
    } catch (error) {
        console.error("Erro ao inicializar seção Monte Sua Pizza:", error);
        showPopup("Erro ao carregar seção. Recarregue a página.", "error");
    }
}

// ========================================
// MODIFICAÇÃO DA FUNÇÃO EXISTENTE
// ========================================

/**
 * SUBSTITUA a função mostrarSecao existente por esta versão
 * que inclui a inicialização da seção Monte Sua Pizza
 */
function mostrarSecao(secao) {
    const secoes = ["cadastro", "consulta", "alterar", "monte-sua-pizza", "venda", "relatorio"];
    
    // Esconde todas as seções
    secoes.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.classList.add("hidden");
    });
    
    // Mostra a seção desejada
    const secaoAtiva = document.getElementById(secao);
    if (secaoAtiva) {
        secaoAtiva.classList.remove("hidden");
        
        // Inicialização específica para Monte Sua Pizza
        if (secao === "monte-sua-pizza") {
            inicializarSecaoMonteSuaPizza();
        }
    }
}

// ========================================
// INICIALIZAÇÃO AUTOMÁTICA
// ========================================

// Garante que a inicialização aconteça quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function() {
    // Se a seção Monte Sua Pizza já estiver visível, inicializa
    const secaoMontagem = document.getElementById("monte-sua-pizza");
    if (secaoMontagem && !secaoMontagem.classList.contains("hidden")) {
        inicializarSecaoMonteSuaPizza();
    }
});

// ========================================
// FUNÇÕES DE UTILIDADE
// ========================================

/**
 * Função para debug - mostra estado atual dos dados
 */
function debugOpcoesMontagem() {
    console.log("=== DEBUG OPÇÕES MONTAGEM ===");
    console.log("Dados atuais:", opcoesMontagem);
    console.log("Contadores:", contadorIds);
    console.log("LocalStorage:", localStorage.getItem("opcoesMontagemPizzaria"));
    console.log("=============================");
}

/**
 * Função para limpar todos os dados (use com cuidado!)
 */
function limparDadosMontagem() {
    if (confirm("ATENÇÃO: Isso irá apagar TODOS os dados de montagem. Continuar?")) {
        localStorage.removeItem("opcoesMontagemPizzaria");
        opcoesMontagem = { tamanhos: [], ingredientes: [], bordas: [] };
        contadorIds = { tamanhos: 1, ingredientes: 1, bordas: 1 };
        atualizarTabelasOpcoesMontagem();
        showPopup("Dados limpos com sucesso!", "info");
    }
}

// ========================================
// EXPORTAÇÃO PARA CONSOLE (DEBUG)
// ========================================

// Disponibiliza funções no console para debug
window.debugMontagem = {
    mostrarDados: debugOpcoesMontagem,
    limparDados: limparDadosMontagem,
    recarregar: inicializarSecaoMonteSuaPizza,
    dados: () => opcoesMontagem
};

console.log("🍕 Sistema Monte Sua Pizza (Admin) carregado!");
console.log("💡 Use 'debugMontagem' no console para funções de debug");

// ========================================
// FIM DO CÓDIGO REFATORADO
// ========================================

