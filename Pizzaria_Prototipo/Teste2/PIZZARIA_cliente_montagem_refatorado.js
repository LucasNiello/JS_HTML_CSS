// ========================================
// CÓDIGO REFATORADO - SEÇÃO "MONTE SUA PIZZA" + CARRINHO - CLIENTE
// ========================================
// Este código substitui as partes problemáticas do PIZZARIA_cliente.js
// Mantenha o resto do arquivo original e substitua apenas as funções relacionadas

// ========================================
// VARIÁVEIS GLOBAIS REFATORADAS
// ========================================

let opcoesMontagem = {
    tamanhos: [],
    ingredientes: [],
    bordas: []
};

let pizzaMontada = {
    tamanho: null,
    ingredientes: [],
    borda: null,
    precoTotal: 0
};

let configuracaoCarrinho = {
    taxaEntrega: 10.00,
    usarTaxaEntrega: true // Por padrão, taxa está ativa
};

// ========================================
// FUNÇÕES DE CARREGAMENTO - CLIENTE
// ========================================

/**
 * Carrega as opções de montagem do localStorage (versão cliente)
 * VERSÃO REFATORADA - Mais robusta
 */
function carregarOpcoesMontagemCliente() {
    try {
        const opcoesSalvas = localStorage.getItem("opcoesMontagemPizzaria");
        
        if (opcoesSalvas) {
            const dados = JSON.parse(opcoesSalvas);
            opcoesMontagem = validarDadosCliente(dados);
        } else {
            console.warn("Nenhuma opção de montagem encontrada. Usando dados padrão.");
            opcoesMontagem = {
                tamanhos: [
                    { id: 1, nome: "Média - Massa Tradicional", preco: 40.00 }
                ],
                ingredientes: [
                    { id: 1, nome: "Queijo Mussarela", preco: 3.00 },
                    { id: 2, nome: "Molho de Tomate", preco: 2.00 }
                ],
                bordas: [
                    { id: 1, nome: "Sem Borda Recheada", preco: 0.00 }
                ]
            };
        }
        
        console.log("Opções de montagem carregadas (cliente):", opcoesMontagem);
        
    } catch (error) {
        console.error("Erro ao carregar opções de montagem:", error);
        showPopup("Erro ao carregar opções de montagem", "error");
        
        // Fallback
        opcoesMontagem = {
            tamanhos: [{ id: 1, nome: "Média", preco: 40.00 }],
            ingredientes: [{ id: 1, nome: "Queijo", preco: 3.00 }],
            bordas: [{ id: 1, nome: "Sem Borda", preco: 0.00 }]
        };
    }
}

/**
 * Valida dados vindos do localStorage
 */
function validarDadosCliente(dados) {
    const dadosValidados = {
        tamanhos: [],
        ingredientes: [],
        bordas: []
    };
    
    ['tamanhos', 'ingredientes', 'bordas'].forEach(tipo => {
        if (dados[tipo] && Array.isArray(dados[tipo])) {
            dadosValidados[tipo] = dados[tipo].filter(item => 
                item && typeof item.nome === 'string' && typeof item.preco === 'number'
            );
        }
    });
    
    return dadosValidados;
}

/**
 * Popula a seção "Monte Sua Pizza" com as opções carregadas
 * VERSÃO REFATORADA - SEM gratuidade de ingredientes
 */
function popularOpcoesMontagemCliente() {
    const secaoMontagem = document.getElementById("montar-pizza");
    if (!secaoMontagem) {
        console.warn("Seção montar-pizza não encontrada");
        return;
    }

    try {
        // Containers para cada tipo de opção
        const containerTamanhos = secaoMontagem.querySelector(".opcao-grupo:nth-child(1) .opcoes-lista");
        const containerIngredientes = secaoMontagem.querySelector(".ingredientes-grid");
        const containerBordas = secaoMontagem.querySelector(".opcao-grupo:nth-child(3) .opcoes-lista");

        // Limpa containers
        if (containerTamanhos) containerTamanhos.innerHTML = "";
        if (containerIngredientes) containerIngredientes.innerHTML = "";
        if (containerBordas) containerBordas.innerHTML = "";

        // Popula Tamanhos/Massas (Radio buttons)
        if (containerTamanhos && opcoesMontagem.tamanhos.length > 0) {
            opcoesMontagem.tamanhos.forEach((item, index) => {
                const id = `tamanho-${item.id || index}`;
                const checked = index === 0 ? "checked" : "";
                
                const div = document.createElement("div");
                div.className = "opcao-item";
                div.innerHTML = `
                    <input type="radio" id="${id}" name="tamanho" value="${item.nome}" 
                           data-id="${item.id}" data-preco="${item.preco}" ${checked}>
                    <label for="${id}">${item.nome} - R$ ${item.preco.toFixed(2)}</label>
                `;
                containerTamanhos.appendChild(div);
            });
        } else if (containerTamanhos) {
            containerTamanhos.innerHTML = "<p>Nenhuma opção de tamanho disponível.</p>";
        }

        // Popula Ingredientes (Checkboxes) - TODOS TÊM PREÇO AGORA
        if (containerIngredientes && opcoesMontagem.ingredientes.length > 0) {
            opcoesMontagem.ingredientes.forEach((item, index) => {
                const id = `ingrediente-${item.id || index}`;
                
                const div = document.createElement("div");
                div.className = "opcao-item";
                div.innerHTML = `
                    <input type="checkbox" id="${id}" name="ingredientes" value="${item.nome}" 
                           data-id="${item.id}" data-preco="${item.preco}">
                    <label for="${id}">${item.nome} - R$ ${item.preco.toFixed(2)}</label>
                `;
                containerIngredientes.appendChild(div);
            });
        } else if (containerIngredientes) {
            containerIngredientes.innerHTML = "<p>Nenhum ingrediente disponível.</p>";
        }

        // Popula Bordas (Radio buttons)
        if (containerBordas && opcoesMontagem.bordas.length > 0) {
            opcoesMontagem.bordas.forEach((item, index) => {
                const id = `borda-${item.id || index}`;
                const checked = item.preco === 0 ? "checked" : "";
                
                const div = document.createElement("div");
                div.className = "opcao-item";
                div.innerHTML = `
                    <input type="radio" id="${id}" name="borda" value="${item.nome}" 
                           data-id="${item.id}" data-preco="${item.preco}" ${checked}>
                    <label for="${id}">${item.nome} - R$ ${item.preco.toFixed(2)}</label>
                `;
                containerBordas.appendChild(div);
            });
        } else if (containerBordas) {
            containerBordas.innerHTML = "<p>Nenhuma opção de borda disponível.</p>";
        }

        console.log("Opções populadas com sucesso");
        
    } catch (error) {
        console.error("Erro ao popular opções:", error);
        showPopup("Erro ao carregar opções de montagem", "error");
    }
}

// ========================================
// FUNÇÕES DE CÁLCULO - REFATORADAS
// ========================================

/**
 * Calcula o preço da montagem SEM gratuidade
 * VERSÃO REFATORADA - Todos os ingredientes são pagos
 */
function calcularPrecoMontagem() {
    let precoBase = 0;
    let nomeTamanho = "Nenhum";
    let ingredientesSelecionados = [];
    let precoIngredientes = 0;
    let nomeBorda = "Sem borda";
    let precoBorda = 0;

    try {
        // Tamanho selecionado
        const tamanhoInput = document.querySelector("input[name=\"tamanho\"]:checked");
        if (tamanhoInput) {
            nomeTamanho = tamanhoInput.value;
            precoBase = parseFloat(tamanhoInput.getAttribute("data-preco")) || 0;
        }

        // Ingredientes selecionados - TODOS SÃO PAGOS
        const ingredientesInputs = document.querySelectorAll("input[name=\"ingredientes\"]:checked");
        ingredientesInputs.forEach(input => {
            const nome = input.value;
            const preco = parseFloat(input.getAttribute("data-preco")) || 0;
            
            ingredientesSelecionados.push({
                nome: nome,
                preco: preco
            });
            precoIngredientes += preco;
        });

        // Borda selecionada
        const bordaInput = document.querySelector("input[name=\"borda\"]:checked");
        if (bordaInput) {
            nomeBorda = bordaInput.value;
            precoBorda = parseFloat(bordaInput.getAttribute("data-preco")) || 0;
        }

        const precoTotal = precoBase + precoIngredientes + precoBorda;

        return {
            nomeTamanho,
            precoBase,
            ingredientesSelecionados,
            precoIngredientes,
            nomeBorda,
            precoBorda,
            precoTotal
        };
        
    } catch (error) {
        console.error("Erro ao calcular preço:", error);
        return {
            nomeTamanho: "Erro",
            precoBase: 0,
            ingredientesSelecionados: [],
            precoIngredientes: 0,
            nomeBorda: "Erro",
            precoBorda: 0,
            precoTotal: 0
        };
    }
}

/**
 * Atualiza o resumo da montagem na interface
 * VERSÃO REFATORADA - Sem menção de gratuidade
 */
function atualizarResumoMontagem() {
    try {
        const resumoTamanho = document.getElementById("resumo-tamanho");
        const resumoPrecoBase = document.getElementById("resumo-preco-base");
        const resumoIngredientes = document.getElementById("resumo-ingredientes");
        const resumoBorda = document.getElementById("resumo-borda");
        const precoTotal = document.getElementById("preco-total");
        const btnAdicionar = document.getElementById("btn-adicionar-montada");

        if (!resumoTamanho || !resumoPrecoBase || !resumoIngredientes || !resumoBorda || !precoTotal || !btnAdicionar) {
            console.warn("Alguns elementos do resumo não foram encontrados");
            return;
        }

        const calculo = calcularPrecoMontagem();

        // Atualiza tamanho
        resumoTamanho.textContent = calculo.nomeTamanho;
        resumoPrecoBase.textContent = `R$ ${calculo.precoBase.toFixed(2)}`;

        // Atualiza ingredientes
        let ingredientesHTML = "";
        if (calculo.ingredientesSelecionados.length > 0) {
            ingredientesHTML = "<h5>Ingredientes Selecionados:</h5>";
            calculo.ingredientesSelecionados.forEach(ingrediente => {
                ingredientesHTML += `
                    <div class="resumo-item">
                        <span>• ${ingrediente.nome}</span>
                        <span>R$ ${ingrediente.preco.toFixed(2)}</span>
                    </div>
                `;
            });
        } else {
            ingredientesHTML = "<p><i>Nenhum ingrediente selecionado.</i></p>";
        }
        resumoIngredientes.innerHTML = ingredientesHTML;

        // Atualiza borda
        const bordaPrecoTexto = calculo.precoBorda > 0 ? `R$ ${calculo.precoBorda.toFixed(2)}` : "Incluso";
        resumoBorda.innerHTML = `
            <h5>Borda:</h5>
            <div class="resumo-item">
                <span>• ${calculo.nomeBorda}</span>
                <span>${bordaPrecoTexto}</span>
            </div>
        `;

        // Atualiza preço total
        precoTotal.textContent = `R$ ${calculo.precoTotal.toFixed(2)}`;

        // Habilita/desabilita botão
        const podeAdicionar = calculo.nomeTamanho !== "Nenhum" && calculo.precoTotal > 0;
        btnAdicionar.disabled = !podeAdicionar;
        
        if (podeAdicionar) {
            btnAdicionar.innerHTML = '<i class="fas fa-cart-plus"></i> Adicionar ao Carrinho';
        } else {
            btnAdicionar.innerHTML = '<i class="fas fa-cart-plus"></i> Selecione um tamanho';
        }

        // Atualiza dados globais
        pizzaMontada = {
            tamanho: calculo.nomeTamanho,
            ingredientes: calculo.ingredientesSelecionados,
            borda: calculo.nomeBorda,
            precoTotal: calculo.precoTotal
        };

    } catch (error) {
        console.error("Erro ao atualizar resumo:", error);
        showPopup("Erro ao atualizar resumo", "error");
    }
}

// ========================================
// FUNÇÕES DE EVENTOS - REFATORADAS
// ========================================

/**
 * Configura eventos para a seção Monte Sua Pizza
 * VERSÃO REFATORADA
 */
function configurarEventosMontagem() {
    const secaoMontagem = document.getElementById("montar-pizza");
    if (!secaoMontagem) return;

    try {
        // Remove listeners antigos para evitar duplicação
        const containerOpcoes = secaoMontagem.querySelector(".montar-pizza-opcoes");
        if (containerOpcoes) {
            // Clona o elemento para remover todos os listeners
            const novoContainer = containerOpcoes.cloneNode(true);
            containerOpcoes.parentNode.replaceChild(novoContainer, containerOpcoes);
            
            // Adiciona novo listener usando delegação
            novoContainer.addEventListener("change", function(e) {
                if (e.target.matches("input[name=\"tamanho\"], input[name=\"ingredientes\"], input[name=\"borda\"]")) {
                    atualizarResumoMontagem();
                }
            });
        }

        // Configura botão de adicionar
        const btnAdicionar = document.getElementById("btn-adicionar-montada");
        if (btnAdicionar) {
            // Remove listener antigo
            const novoBotao = btnAdicionar.cloneNode(true);
            btnAdicionar.parentNode.replaceChild(novoBotao, btnAdicionar);
            
            // Adiciona novo listener
            novoBotao.addEventListener("click", function() {
                if (!this.disabled) {
                    adicionarPizzaMontadaAoCarrinho();
                }
            });
        }

        console.log("Eventos de montagem configurados");
        
    } catch (error) {
        console.error("Erro ao configurar eventos:", error);
    }
}

/**
 * Adiciona pizza montada ao carrinho
 * VERSÃO REFATORADA
 */
function adicionarPizzaMontadaAoCarrinho() {
    try {
        const calculo = calcularPrecoMontagem();
        
        if (calculo.nomeTamanho === "Nenhum" || calculo.precoTotal <= 0) {
            showPopup("Selecione pelo menos um tamanho para a pizza!", "error");
            return;
        }

        // Cria nome descritivo da pizza
        const tamanhoSimples = calculo.nomeTamanho.split(" - ")[0] || calculo.nomeTamanho;
        const nomePizza = `Pizza Personalizada (${tamanhoSimples})`;
        
        // Cria ID único
        const idPizza = `montada-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Detalhes da pizza
        const detalhes = {
            tamanho: calculo.nomeTamanho,
            ingredientes: calculo.ingredientesSelecionados.map(ing => ing.nome),
            borda: calculo.nomeBorda,
            precoDetalhado: {
                base: calculo.precoBase,
                ingredientes: calculo.precoIngredientes,
                borda: calculo.precoBorda
            }
        };

        // Adiciona ao carrinho
        adicionarAoCarrinho(idPizza, nomePizza, calculo.precoTotal, 1, detalhes);
        
        // Feedback
        showPopup(`${nomePizza} adicionada ao carrinho!`, "success");
        
        // Opcional: limpar seleção
        // limparSelecaoMontagem();
        
    } catch (error) {
        console.error("Erro ao adicionar pizza ao carrinho:", error);
        showPopup("Erro ao adicionar pizza ao carrinho", "error");
    }
}

// ========================================
// FUNÇÕES DO CARRINHO - REFATORADAS COM TAXA DE ENTREGA
// ========================================

/**
 * Atualiza a interface do carrinho
 * VERSÃO REFATORADA - Com opção de taxa de entrega
 */
function atualizarCarrinhoUI() {
    const carrinhoItens = document.getElementById("carrinho-itens");
    const carrinhoVazio = document.getElementById("carrinho-vazio");
    const carrinhoResumo = document.getElementById("carrinho-resumo");
    const subtotalSpan = document.getElementById("subtotal-valor");
    const totalSpan = document.getElementById("total-valor");

    if (!carrinhoItens || !carrinhoVazio || !carrinhoResumo || !subtotalSpan || !totalSpan) {
        console.warn("Elementos do carrinho não encontrados");
        return;
    }

    try {
        if (carrinho.length === 0) {
            // Carrinho vazio
            carrinhoVazio.style.display = "flex";
            carrinhoItens.innerHTML = "";
            carrinhoResumo.style.display = "none";
        } else {
            // Carrinho com itens
            carrinhoVazio.style.display = "none";
            carrinhoResumo.style.display = "block";
            
            // Limpa e popula itens
            carrinhoItens.innerHTML = "";
            let subtotal = 0;

            carrinho.forEach((item) => {
                subtotal += item.preco * item.quantidade;
                const itemHTML = criarItemCarrinhoHTML(item);
                carrinhoItens.insertAdjacentHTML("beforeend", itemHTML);
            });

            // Atualiza resumo com taxa de entrega
            atualizarResumoCarrinho(subtotal);
            
            // Configura eventos de remoção
            configurarEventosCarrinho();
        }
        
    } catch (error) {
        console.error("Erro ao atualizar carrinho:", error);
        showPopup("Erro ao atualizar carrinho", "error");
    }
}

/**
 * Atualiza o resumo do carrinho com opção de taxa de entrega
 * NOVA FUNÇÃO
 */
function atualizarResumoCarrinho(subtotal) {
    const carrinhoResumo = document.getElementById("carrinho-resumo");
    const subtotalSpan = document.getElementById("subtotal-valor");
    const totalSpan = document.getElementById("total-valor");
    
    if (!carrinhoResumo || !subtotalSpan || !totalSpan) return;

    try {
        // Atualiza subtotal
        subtotalSpan.textContent = `R$ ${subtotal.toFixed(2)}`;

        // Verifica se já existe o controle de taxa de entrega
        let taxaControle = carrinhoResumo.querySelector(".taxa-entrega-controle");
        if (!taxaControle) {
            // Cria controle de taxa de entrega
            const taxaEntregaHTML = `
                <div class="resumo-linha taxa-entrega-controle">
                    <label class="taxa-entrega-label">
                        <input type="checkbox" id="usar-taxa-entrega" ${configuracaoCarrinho.usarTaxaEntrega ? 'checked' : ''}>
                        <span>Taxa de entrega:</span>
                    </label>
                    <span class="taxa-entrega-valor">R$ ${configuracaoCarrinho.taxaEntrega.toFixed(2)}</span>
                </div>
            `;
            
            // Insere antes da linha de total
            const linhaTotal = carrinhoResumo.querySelector(".resumo-linha.total");
            if (linhaTotal) {
                linhaTotal.insertAdjacentHTML('beforebegin', taxaEntregaHTML);
            } else {
                // Se não encontrar linha de total, adiciona antes do final
                carrinhoResumo.insertAdjacentHTML('beforeend', taxaEntregaHTML);
            }
            
            // Configura evento do checkbox
            const checkboxTaxa = document.getElementById("usar-taxa-entrega");
            if (checkboxTaxa) {
                checkboxTaxa.addEventListener("change", function() {
                    configuracaoCarrinho.usarTaxaEntrega = this.checked;
                    atualizarTotalCarrinho();
                    
                    // Salva preferência
                    localStorage.setItem("configuracaoCarrinho", JSON.stringify(configuracaoCarrinho));
                });
            }
        }

        // Atualiza total
        atualizarTotalCarrinho();
        
    } catch (error) {
        console.error("Erro ao atualizar resumo do carrinho:", error);
    }
}

/**
 * Atualiza apenas o total do carrinho
 * NOVA FUNÇÃO
 */
function atualizarTotalCarrinho() {
    const subtotalSpan = document.getElementById("subtotal-valor");
    const totalSpan = document.getElementById("total-valor");
    const taxaValor = document.querySelector(".taxa-entrega-valor");
    
    if (!subtotalSpan || !totalSpan) return;

    try {
        const subtotal = parseFloat(subtotalSpan.textContent.replace("R$ ", "").replace(",", ".")) || 0;
        const taxa = configuracaoCarrinho.usarTaxaEntrega ? configuracaoCarrinho.taxaEntrega : 0;
        const total = subtotal + taxa;

        // Atualiza visual da taxa
        if (taxaValor) {
            taxaValor.textContent = configuracaoCarrinho.usarTaxaEntrega 
                ? `R$ ${configuracaoCarrinho.taxaEntrega.toFixed(2)}`
                : "Grátis";
            
            taxaValor.style.textDecoration = configuracaoCarrinho.usarTaxaEntrega ? "none" : "line-through";
        }

        // Atualiza total
        totalSpan.textContent = `R$ ${total.toFixed(2)}`;
        
    } catch (error) {
        console.error("Erro ao atualizar total:", error);
    }
}

/**
 * Carrega configuração do carrinho do localStorage
 * NOVA FUNÇÃO
 */
function carregarConfiguracaoCarrinho() {
    try {
        const configSalva = localStorage.getItem("configuracaoCarrinho");
        if (configSalva) {
            const config = JSON.parse(configSalva);
            configuracaoCarrinho = {
                ...configuracaoCarrinho,
                ...config
            };
        }
    } catch (error) {
        console.error("Erro ao carregar configuração do carrinho:", error);
    }
}

// ========================================
// FUNÇÕES DE INICIALIZAÇÃO - REFATORADAS
// ========================================

/**
 * Inicializa a seção Monte Sua Pizza (cliente)
 * NOVA FUNÇÃO
 */
function inicializarMonteSuaPizzaCliente() {
    console.log("Inicializando Monte Sua Pizza (cliente)...");
    
    try {
        carregarOpcoesMontagemCliente();
        popularOpcoesMontagemCliente();
        configurarEventosMontagem();
        atualizarResumoMontagem();
        
        console.log("Monte Sua Pizza inicializada com sucesso");
        
    } catch (error) {
        console.error("Erro ao inicializar Monte Sua Pizza:", error);
        showPopup("Erro ao carregar seção de montagem", "error");
    }
}

/**
 * Inicializa o carrinho com nova funcionalidade
 * VERSÃO REFATORADA
 */
function inicializarCarrinho() {
    try {
        // Carrega carrinho do localStorage
        const carrinhoSalvo = localStorage.getItem("carrinhoPizzaria");
        if (carrinhoSalvo) {
            carrinho = JSON.parse(carrinhoSalvo);
        }
        
        // Carrega configuração do carrinho
        carregarConfiguracaoCarrinho();
        
        // Atualiza interface
        atualizarContadorCarrinho();
        ativarBotoesAdicionar();
        
        console.log("Carrinho inicializado com sucesso");
        
    } catch (error) {
        console.error("Erro ao inicializar carrinho:", error);
        carrinho = [];
    }
}

// ========================================
// INTEGRAÇÃO COM SISTEMA EXISTENTE
// ========================================

// Substitua a inicialização no DOMContentLoaded original por esta:
document.addEventListener("DOMContentLoaded", function () {
    // Inicializações existentes
    carregarCardapioCliente();
    inicializarCarrinho(); // Versão refatorada
    configurarNavegacao();
    configurarFinalizarPedido();
    
    // Nova inicialização para Monte Sua Pizza
    const secaoMontagem = document.getElementById("montar-pizza");
    if (secaoMontagem && !secaoMontagem.classList.contains("hidden")) {
        inicializarMonteSuaPizzaCliente();
    }
});

// ========================================
// FUNÇÕES DE UTILIDADE
// ========================================

/**
 * Limpa seleção da montagem
 */
function limparSelecaoMontagem() {
    try {
        // Limpa tamanhos (seleciona o primeiro)
        const primeiroTamanho = document.querySelector("input[name=\"tamanho\"]");
        if (primeiroTamanho) {
            primeiroTamanho.checked = true;
        }
        
        // Limpa ingredientes
        const ingredientes = document.querySelectorAll("input[name=\"ingredientes\"]");
        ingredientes.forEach(input => input.checked = false);
        
        // Limpa bordas (seleciona a primeira/sem borda)
        const primeiraBorda = document.querySelector("input[name=\"borda\"]");
        if (primeiraBorda) {
            primeiraBorda.checked = true;
        }
        
        atualizarResumoMontagem();
        
    } catch (error) {
        console.error("Erro ao limpar seleção:", error);
    }
}

/**
 * Debug para o cliente
 */
function debugMontagemCliente() {
    console.log("=== DEBUG MONTAGEM CLIENTE ===");
    console.log("Opções carregadas:", opcoesMontagem);
    console.log("Pizza atual:", pizzaMontada);
    console.log("Configuração carrinho:", configuracaoCarrinho);
    console.log("Carrinho:", carrinho);
    console.log("=============================");
}

// Disponibiliza no console
window.debugMontagemCliente = debugMontagemCliente;

console.log("🍕 Sistema Monte Sua Pizza (Cliente) carregado!");
console.log("💡 Use 'debugMontagemCliente()' no console para debug");

// ========================================
// FIM DO CÓDIGO REFATORADO - CLIENTE
// ========================================

