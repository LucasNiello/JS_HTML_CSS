// cliente_updated.js - Funcionalidades para a página do cliente com integração localStorage

// --- Função para Exibir Pop-up de Mensagem (Adicionada aqui) ---

/**
 * Exibe uma mensagem pop-up temporária na tela.
 * @param {string} mensagem - O texto a ser exibido.
 * @param {string} [tipo="info"] - O tipo de mensagem ("success", "error", "info") para estilização.
 * @param {number} [duracao=2000] - Duração em milissegundos que o pop-up ficará visível.
 */
function showPopup(mensagem, tipo = "info", duracao = 2000) {
    const popupExistente = document.getElementById("popup-global");
    if (popupExistente) {
        popupExistente.remove();
    }
    const popup = document.createElement("div");
    popup.id = "popup-global";
    popup.className = `popup-mensagem ${tipo}`;
    popup.textContent = mensagem;
    document.body.appendChild(popup);
    setTimeout(() => { popup.classList.add("show"); }, 10);
    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => { if (popup.parentNode) { popup.remove(); } }, 500);
    }, duracao);
}

// --- Variáveis Globais ---
let carrinho = [];
let opcoesMontagem = {
    tamanhos: [],
    ingredientes: [],
    bordas: []
};

// --- Funções de Inicialização e Carregamento ---

document.addEventListener("DOMContentLoaded", function () {
    carregarCardapioCliente();
    carregarOpcoesMontagemCliente();
    popularOpcoesMontagemCliente();
    inicializarCarrinho();
    configurarNavegacao();
    configurarFiltrosCardapio();
    configurarEventosMontagem();
    atualizarResumoMontagem();
    configurarFinalizarPedido(); // Adicionado para configurar o botão de finalizar
});

// Carrega o cardápio principal (pizzas prontas) do localStorage
function carregarCardapioCliente() {
    const cardapioSalvo = localStorage.getItem("cardapioPizzaria");
    const gridProdutos = document.querySelector(".grid-produtos");
    if (!gridProdutos) return;

    gridProdutos.innerHTML = ""; // Limpa o grid antes de carregar

    if (cardapioSalvo) {
        const pizzas = JSON.parse(cardapioSalvo);
        if (pizzas.length > 0) {
             adicionarFiltroAdmin();
             pizzas.forEach((pizza, index) => {
                const cardHTML = criarCardPizzaAdmin(pizza, index);
                gridProdutos.insertAdjacentHTML("beforeend", cardHTML);
            });
        } else {
             gridProdutos.innerHTML = "<p>Nenhuma pizza cadastrada no momento.</p>";
        }
    } else {
        gridProdutos.innerHTML = "<p>Nenhuma pizza cadastrada no momento.</p>";
    }
    ativarBotoesAdicionar(); // Ativa botões mesmo se o cardápio estiver vazio inicialmente
}

// Adiciona o botão de filtro "Do Administrador" se houver pizzas do admin
function adicionarFiltroAdmin() {
    const filtroCategorias = document.querySelector(".filtro-categorias");
    // Verifica se o botão já existe para não duplicar
    if (filtroCategorias && !filtroCategorias.querySelector("button[data-categoria=\"admin\"]")) {
        const categoriaBotao = document.createElement("button");
        categoriaBotao.className = "filtro-btn";
        categoriaBotao.setAttribute("data-categoria", "admin");
        categoriaBotao.textContent = "Do Administrador";
        // Insere antes do último botão (se houver) ou no final
        const ultimoBotao = filtroCategorias.lastElementChild;
        if (ultimoBotao) {
             filtroCategorias.insertBefore(categoriaBotao, ultimoBotao);
        } else {
             filtroCategorias.appendChild(categoriaBotao);
        }
    }
}

// Cria o HTML para um card de pizza vindo do admin
function criarCardPizzaAdmin(pizza, index) {
    const uniqueId = `admin-${pizza.nome.replace(/\s+/g, "-")}-${pizza.preco}-${index}`;
    // Usa uma imagem de placeholder mais específica ou permite upload futuro
    const imageUrl = `https://via.placeholder.com/300x200/D32F2F/FFFFFF?text=${encodeURIComponent(pizza.nome)}`;
    return `
        <div class="card-produto" data-categoria="admin">
            <div class="produto-img">
                <img src="${imageUrl}" alt="${pizza.nome}">
                <span class="tag-destaque">Cardápio</span>
            </div>
            <div class="produto-info">
                <h3>${pizza.nome}</h3>
                <p class="ingredientes">${pizza.ingredientes}</p>
                <div class="produto-footer">
                    <span class="preco">R$ ${pizza.preco.toFixed(2)}</span>
                    <button class="btn-adicionar" data-id="${uniqueId}" data-nome="${pizza.nome}" data-preco="${pizza.preco}">
                        <i class="fas fa-plus"></i> Adicionar
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Carrega as opções de montagem (tamanhos, ingredientes, bordas) do localStorage
function carregarOpcoesMontagemCliente() {
    const opcoesSalvas = localStorage.getItem("opcoesMontagemPizzaria");
    if (opcoesSalvas) {
        opcoesMontagem = JSON.parse(opcoesSalvas);
    } else {
        console.warn("Opções de montagem não encontradas. Usando valores padrão mínimos.");
        opcoesMontagem = {
            tamanhos: [{ nome: "Média - Massa Tradicional", preco: 40.00 }],
            ingredientes: [{ nome: "Queijo Mussarela", preco: 0.00 }, { nome: "Molho de Tomate", preco: 0.00 }],
            bordas: [{ nome: "Sem Borda Recheada", preco: 0.00 }],
        };
    }
}

// Popula a seção "Monte Sua Pizza" com as opções carregadas
function popularOpcoesMontagemCliente() {
    const secaoMontagem = document.getElementById("montar-pizza");
    if (!secaoMontagem) return;

    const containerTamanhos = secaoMontagem.querySelector(".opcao-grupo:nth-child(1) .opcoes-lista");
    const containerIngredientes = secaoMontagem.querySelector(".ingredientes-grid");
    const containerBordas = secaoMontagem.querySelector(".opcao-grupo:nth-child(3) .opcoes-lista");

    // Limpa containers
    if (containerTamanhos) containerTamanhos.innerHTML = "";
    if (containerIngredientes) containerIngredientes.innerHTML = "";
    if (containerBordas) containerBordas.innerHTML = "";

    // Popula Tamanhos/Massas (Radio)
    if (containerTamanhos && opcoesMontagem.tamanhos && opcoesMontagem.tamanhos.length > 0) {
        opcoesMontagem.tamanhos.forEach((item, index) => {
            const id = `tamanho-${index}`;
            const checked = index === 0 ? "checked" : "";
            const div = document.createElement("div");
            div.className = "opcao-item";
            div.innerHTML = `
                <input type="radio" id="${id}" name="tamanho" value="${item.nome}" data-preco="${item.preco}" ${checked}>
                <label for="${id}">${item.nome} (R$ ${item.preco.toFixed(2)})</label>
            `;
            containerTamanhos.appendChild(div);
        });
    } else if (containerTamanhos) {
        containerTamanhos.innerHTML = "<p>Nenhuma opção de tamanho cadastrada.</p>";
    }

    // Popula Ingredientes (Checkbox)
    if (containerIngredientes && opcoesMontagem.ingredientes && opcoesMontagem.ingredientes.length > 0) {
        opcoesMontagem.ingredientes.forEach((item, index) => {
            // Não exibe ingredientes com preço 0 (considerados base)
            if (item.preco > 0) {
                const id = `ingrediente-${index}`;
                const div = document.createElement("div");
                div.className = "opcao-item";
                div.innerHTML = `
                    <input type="checkbox" id="${id}" name="ingredientes" value="${item.nome}" data-preco="${item.preco}">
                    <label for="${id}">${item.nome} (+ R$ ${item.preco.toFixed(2)})</label>
                `;
                containerIngredientes.appendChild(div);
            }
        });
    } else if (containerIngredientes) {
        containerIngredientes.innerHTML = "<p>Nenhum ingrediente adicional cadastrado.</p>";
    }

    // Popula Bordas (Radio)
    if (containerBordas && opcoesMontagem.bordas && opcoesMontagem.bordas.length > 0) {
        opcoesMontagem.bordas.forEach((item, index) => {
            const id = `borda-${index}`;
            const checked = item.preco === 0 ? "checked" : "";
            const precoLabel = item.preco > 0 ? ` (+ R$ ${item.preco.toFixed(2)})` : "";
            const div = document.createElement("div");
            div.className = "opcao-item";
            div.innerHTML = `
                <input type="radio" id="${id}" name="borda" value="${item.nome}" data-preco="${item.preco}" ${checked}>
                <label for="${id}">${item.nome}${precoLabel}</label>
            `;
            containerBordas.appendChild(div);
        });
    } else if (containerBordas) {
        containerBordas.innerHTML = "<p>Nenhuma opção de borda cadastrada.</p>";
    }
}

// --- Configuração de Eventos ---

function configurarNavegacao() {
    const navLinks = document.querySelectorAll(".nav-link");
    const secoes = document.querySelectorAll(".secao");
    const modal = document.getElementById("carrinho-modal");
    const fecharModal = document.querySelector(".fechar-modal");
    const btnContinuarComprando = document.querySelectorAll(".btn-continuar-comprando");

    function mostrarSecao(targetId) {
        secoes.forEach((secao) => secao.classList.remove("active"));
        navLinks.forEach((link) => link.classList.remove("active"));

        if (targetId === "carrinho-modal" && modal) {
            modal.classList.add("active");
            atualizarCarrinhoUI();
        } else {
            const targetSecao = document.getElementById(targetId);
            if (targetSecao) {
                targetSecao.classList.add("active");
                // Recarrega opções de montagem se a seção for ativada
                if (targetId === "montar-pizza") {
                    carregarOpcoesMontagemCliente();
                    popularOpcoesMontagemCliente();
                    configurarEventosMontagem();
                    atualizarResumoMontagem();
                }
                // Recarrega cardápio se a seção for ativada
                if (targetId === "cardapio") {
                    carregarCardapioCliente();
                }
            }
            // Ativa o link de navegação correspondente
            navLinks.forEach((link) => {
                if (link.getAttribute("data-target") === targetId) {
                    link.classList.add("active");
                }
            });
        }
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("data-target");
            mostrarSecao(targetId);
        });
    });

    if (fecharModal) {
        fecharModal.addEventListener("click", () => modal.classList.remove("active"));
    }
    btnContinuarComprando.forEach((btn) => {
        btn.addEventListener("click", () => modal.classList.remove("active"));
    });
}

function configurarFiltrosCardapio() {
    const filtroContainer = document.querySelector(".filtro-categorias");
    if (!filtroContainer) return;

    // Usar delegação de eventos para os botões de filtro
    filtroContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("filtro-btn")) {
            const filtroBtns = filtroContainer.querySelectorAll(".filtro-btn");
            const cardProdutos = document.querySelectorAll(".card-produto");

            filtroBtns.forEach((b) => b.classList.remove("active"));
            e.target.classList.add("active");

            const categoria = e.target.getAttribute("data-categoria");

            cardProdutos.forEach((card) => {
                const cardCategoria = card.getAttribute("data-categoria");
                if (categoria === "todas" || cardCategoria === categoria) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        }
    });
}

function configurarEventosMontagem() {
    const secaoMontagem = document.getElementById("montar-pizza");
    if (!secaoMontagem) return;

    // Listener para mudanças nos inputs (delegação no container de opções)
    const opcoesPizzaDiv = secaoMontagem.querySelector(".opcoes-pizza");
    if (opcoesPizzaDiv) {
        opcoesPizzaDiv.addEventListener("change", function (e) {
            if (e.target.matches("input[name=\"tamanho\"]") || e.target.matches("input[name=\"ingredientes\"]") || e.target.matches("input[name=\"borda\"]")) {
                atualizarResumoMontagem();
            }
        });
    }

    // Listener para o botão de adicionar pizza montada
    const btnAdicionarMontada = document.getElementById("btn-adicionar-montada");
    if (btnAdicionarMontada) {
        // Remove listener antigo para evitar duplicação (melhor abordagem)
        const newBtn = btnAdicionarMontada.cloneNode(true);
        btnAdicionarMontada.parentNode.replaceChild(newBtn, btnAdicionarMontada);

        newBtn.addEventListener("click", function() {
            if (!this.disabled) {
                adicionarPizzaMontadaAoCarrinho();
            }
        });
    }
}

// --- Lógica "Monte Sua Pizza" ---

function calcularPrecoMontagem() {
    let precoBase = 0;
    let nomeTamanho = "Nenhum";
    let ingredientesSelecionados = [];
    let nomeBorda = "Sem recheio";
    let precoBorda = 0;
    let precoIngredientesExtras = 0;

    const tamanhoInputChecked = document.querySelector("input[name=\"tamanho\"]:checked");
    if (tamanhoInputChecked) {
        nomeTamanho = tamanhoInputChecked.value;
        precoBase = parseFloat(tamanhoInputChecked.getAttribute("data-preco")) || 0;
    }

    const ingredientesInputsChecked = document.querySelectorAll("input[name=\"ingredientes\"]:checked");
    ingredientesInputsChecked.forEach(input => {
        const nomeIngrediente = input.value;
        const precoData = parseFloat(input.getAttribute("data-preco")) || 0;
        ingredientesSelecionados.push(nomeIngrediente);
        precoIngredientesExtras += precoData;
    });

    const bordaInputChecked = document.querySelector("input[name=\"borda\"]:checked");
    if (bordaInputChecked) {
        nomeBorda = bordaInputChecked.value;
        precoBorda = parseFloat(bordaInputChecked.getAttribute("data-preco")) || 0;
    }

    const precoTotalCalculado = precoBase + precoIngredientesExtras + precoBorda;

    return {
        nomeTamanho,
        precoBase,
        ingredientesSelecionados,
        precoIngredientesExtras,
        nomeBorda,
        precoBorda,
        precoTotalCalculado
    };
}

function atualizarResumoMontagem() {
    const resumoTamanhoSpan = document.getElementById("resumo-tamanho");
    const resumoPrecoBaseSpan = document.getElementById("resumo-preco-base");
    const resumoIngredientesDiv = document.getElementById("resumo-ingredientes");
    const resumoBordaDiv = document.getElementById("resumo-borda");
    const precoTotalSpan = document.getElementById("preco-total");
    const btnAdicionarMontada = document.getElementById("btn-adicionar-montada");

    if (!resumoTamanhoSpan || !resumoPrecoBaseSpan || !resumoIngredientesDiv || !resumoBordaDiv || !precoTotalSpan || !btnAdicionarMontada) {
        return;
    }

    const calculo = calcularPrecoMontagem();

    resumoTamanhoSpan.textContent = calculo.nomeTamanho;
    resumoPrecoBaseSpan.textContent = `R$ ${calculo.precoBase.toFixed(2)}`;

    let ingredientesHTML = "";
    if (calculo.ingredientesSelecionados.length > 0) {
        ingredientesHTML = "<h5>Ingredientes Adicionais:</h5>";
        calculo.ingredientesSelecionados.forEach(nomeIngrediente => {
            const input = document.querySelector(`input[name="ingredientes"][value="${nomeIngrediente}"]`);
            const precoData = input ? (parseFloat(input.getAttribute("data-preco")) || 0) : 0;
            ingredientesHTML += `<div class="resumo-item"><span>- ${nomeIngrediente}</span><span>+ R$ ${precoData.toFixed(2)}</span></div>`;
        });
    } else {
        ingredientesHTML = "<p><i>Nenhum ingrediente adicional selecionado.</i></p>";
    }
    resumoIngredientesDiv.innerHTML = ingredientesHTML;

    let bordaHTML = "<h5>Borda:</h5>";
    const precoBordaLabel = calculo.precoBorda > 0 ? `+ R$ ${calculo.precoBorda.toFixed(2)}` : "Incluso";
    bordaHTML += `<div class="resumo-item"><span>- ${calculo.nomeBorda}</span><span>${precoBordaLabel}</span></div>`;
    resumoBordaDiv.innerHTML = bordaHTML;

    precoTotalSpan.textContent = `R$ ${calculo.precoTotalCalculado.toFixed(2)}`;

    // Habilita/desabilita botão de adicionar se um tamanho for selecionado
    btnAdicionarMontada.disabled = calculo.nomeTamanho === "Nenhum";
}

// --- Lógica do Carrinho ---

function inicializarCarrinho() {
    const carrinhoSalvo = localStorage.getItem("carrinhoPizzaria");
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
    }
    atualizarContadorCarrinho();
    ativarBotoesAdicionar(); // Garante que os botões funcionem após carregar o carrinho
}

// Ativa os botões "Adicionar" usando delegação de eventos
function ativarBotoesAdicionar() {
    const gridProdutos = document.querySelector(".grid-produtos");
    if (gridProdutos) {
        gridProdutos.removeEventListener("click", handleAdicionarClick); // Remove listener antigo
        gridProdutos.addEventListener("click", handleAdicionarClick); // Adiciona novo listener
    }
    // Adiciona listener para botões de promoção também
    const promocoesContainer = document.querySelector(".promocoes-container");
     if (promocoesContainer) {
        promocoesContainer.removeEventListener("click", handleAdicionarClick);
        promocoesContainer.addEventListener("click", handleAdicionarClick);
    }
}

// Handler para cliques nos botões "Adicionar" (delegação)
function handleAdicionarClick(event) {
    const botaoAdicionar = event.target.closest(".btn-adicionar, .btn-promocao");
    if (botaoAdicionar) {
        const id = botaoAdicionar.getAttribute("data-id");
        const nome = botaoAdicionar.getAttribute("data-nome");
        const preco = parseFloat(botaoAdicionar.getAttribute("data-preco"));
        adicionarAoCarrinho(id, nome, preco);
    }
}

function adicionarPizzaMontadaAoCarrinho() {
    const calculo = calcularPrecoMontagem();
    if (calculo.nomeTamanho === "Nenhum") {
        showPopup("Selecione um tamanho para a pizza!", "error");
        return;
    }

    const nomePizzaMontada = `Pizza Montada (${calculo.nomeTamanho.split(" - ")[0]})`; // Ex: Pizza Montada (Média)
    // Cria um ID único para a pizza montada baseado nas seleções
    const idMontada = `montada-${Date.now()}`;

    const detalhes = {
        tamanho: calculo.nomeTamanho,
        ingredientes: calculo.ingredientesSelecionados,
        borda: calculo.nomeBorda
    };

    adicionarAoCarrinho(idMontada, nomePizzaMontada, calculo.precoTotalCalculado, 1, detalhes);

    // Limpa a seleção da montagem (opcional)
    // resetarMontagem();
    showPopup("Pizza montada adicionada ao carrinho!", "success");
}

function adicionarAoCarrinho(id, nome, preco, quantidade = 1, detalhes = null) {
    const itemExistente = carrinho.find((item) => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({ id, nome, preco, quantidade, detalhes });
    }

    localStorage.setItem("carrinhoPizzaria", JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    atualizarCarrinhoUI(); // Atualiza a UI do modal se estiver aberto
    showPopup(`"${nome}" adicionado ao carrinho!`, "success", 1500); // Popup mais curto
}

function atualizarContadorCarrinho() {
    const contador = document.querySelector(".contador-itens");
    if (!contador) return;
    const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    contador.textContent = totalItens;
    contador.style.display = totalItens > 0 ? "flex" : "none";
}

function atualizarCarrinhoUI() {
    const carrinhoItensDiv = document.getElementById("carrinho-itens");
    const carrinhoVazioDiv = document.getElementById("carrinho-vazio");
    const carrinhoResumoDiv = document.getElementById("carrinho-resumo");
    const subtotalSpan = document.getElementById("subtotal-valor");
    const totalSpan = document.getElementById("total-valor");
    const taxaEntrega = 10.00; // Exemplo de taxa fixa

    if (!carrinhoItensDiv || !carrinhoVazioDiv || !carrinhoResumoDiv || !subtotalSpan || !totalSpan) return;

    if (carrinho.length === 0) {
        carrinhoVazioDiv.style.display = "flex";
        carrinhoItensDiv.innerHTML = "";
        carrinhoResumoDiv.style.display = "none";
    } else {
        carrinhoVazioDiv.style.display = "none";
        carrinhoResumoDiv.style.display = "block";
        carrinhoItensDiv.innerHTML = "";

        let subtotal = 0;
        carrinho.forEach((item) => {
            subtotal += item.preco * item.quantidade;
            const itemHTML = criarItemCarrinhoHTML(item);
            carrinhoItensDiv.insertAdjacentHTML("beforeend", itemHTML);
        });

        // Reconfigura listener de remoção usando delegação
        carrinhoItensDiv.removeEventListener("click", handleRemoverItemCarrinho);
        carrinhoItensDiv.addEventListener("click", handleRemoverItemCarrinho);

        const total = subtotal + taxaEntrega;
        subtotalSpan.textContent = `R$ ${subtotal.toFixed(2)}`;
        totalSpan.textContent = `R$ ${total.toFixed(2)}`;
    }
}

function handleRemoverItemCarrinho(event) {
    const botaoRemover = event.target.closest(".btn-remover");
    if (botaoRemover) {
        const id = botaoRemover.getAttribute("data-id");
        removerDoCarrinho(id);
    }
}

function criarItemCarrinhoHTML(item) {
    let detalhesHTML = "";
    if (item.detalhes) {
        detalhesHTML += `<p class="item-detalhe"><i>Tamanho:</i> ${item.detalhes.tamanho}</p>`;
        if (item.detalhes.ingredientes && item.detalhes.ingredientes.length > 0) {
            detalhesHTML += `<p class="item-detalhe"><i>Ingredientes:</i> ${item.detalhes.ingredientes.join(", ")}</p>`;
        }
        if (item.detalhes.borda && item.detalhes.borda !== "Sem Borda Recheada") {
             detalhesHTML += `<p class="item-detalhe"><i>Borda:</i> ${item.detalhes.borda}</p>`;
        }
    }

    return `
        <div class="carrinho-item">
            <div class="item-info">
                <h4>${item.nome} ${item.quantidade > 1 ? `(x${item.quantidade})` : ""}</h4>
                ${detalhesHTML}
                <p>Preço Unitário: R$ ${item.preco.toFixed(2)}</p>
            </div>
            <div class="item-total">
                R$ ${(item.preco * item.quantidade).toFixed(2)}
            </div>
            <div class="item-acoes">
                <button class="btn-remover" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

function removerDoCarrinho(id) {
    const index = carrinho.findIndex((item) => item.id === id);
    if (index !== -1) {
        const nomeItem = carrinho[index].nome;
        carrinho.splice(index, 1);
        localStorage.setItem("carrinhoPizzaria", JSON.stringify(carrinho));
        atualizarContadorCarrinho();
        atualizarCarrinhoUI();
        showPopup(`"${nomeItem}" removido do carrinho.`, "info", 1500);
    }
}

// --- Finalizar Pedido --- MODIFICADO

function configurarFinalizarPedido() {
    const btnFinalizar = document.getElementById("btn-finalizar-pedido");
    const modal = document.getElementById("carrinho-modal");

    if (btnFinalizar && modal) {
        btnFinalizar.addEventListener("click", () => {
            if (carrinho.length > 0) {
                // Simula o envio do pedido
                console.log("Pedido finalizado:", carrinho);

                // Limpa o carrinho
                carrinho = [];
                localStorage.removeItem("carrinhoPizzaria");

                // Atualiza a UI
                atualizarContadorCarrinho();
                atualizarCarrinhoUI();

                // Fecha o modal
                modal.classList.remove("active");

                // Exibe pop-up de sucesso
                showPopup("Pedido finalizado com sucesso! Obrigado!", "success", 2500); // Duração um pouco maior
            } else {
                showPopup("Seu carrinho está vazio.", "info");
            }
        });
    }
}

