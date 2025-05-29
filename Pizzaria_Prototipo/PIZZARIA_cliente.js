// cliente_updated.js - Funcionalidades para a página do cliente com integração localStorage

// --- Variáveis Globais ---
let carrinho = [];
let opcoesMontagem = {
    tamanhos: [],
    ingredientes: [],
    bordas: []
};

// --- Funções de Inicialização e Carregamento ---

document.addEventListener("DOMContentLoaded", function () {
    carregarCardapioCliente(); // Carrega pizzas do cardápio principal
    carregarOpcoesMontagemCliente(); // Carrega opções para "Monte Sua Pizza"
    popularOpcoesMontagemCliente(); // Cria os elementos HTML para as opções
    inicializarCarrinho(); // Carrega carrinho salvo e ativa botões
    configurarNavegacao(); // Configura links de navegação e modal
    configurarFiltrosCardapio(); // Configura botões de filtro de categoria
    configurarEventosMontagem(); // Adiciona listeners para cálculo e adição da pizza montada
    atualizarResumoMontagem(); // Calcula o preço inicial da montagem
});

// Carrega o cardápio principal (pizzas prontas) do localStorage
function carregarCardapioCliente() {
    const cardapioSalvo = localStorage.getItem("cardapioPizzaria");
    if (cardapioSalvo) {
        const pizzas = JSON.parse(cardapioSalvo);
        const gridProdutos = document.querySelector(".grid-produtos");
        if (!gridProdutos || pizzas.length === 0) return;

        adicionarFiltroAdmin();

        // Limpa apenas as pizzas de admin antes de adicionar novamente
        const pizzasAdminExistentes = gridProdutos.querySelectorAll(".card-produto[data-categoria=\"admin\"]");
        pizzasAdminExistentes.forEach(card => card.remove());

        pizzas.forEach((pizza, index) => {
            const cardHTML = criarCardPizzaAdmin(pizza, index);
            gridProdutos.insertAdjacentHTML("beforeend", cardHTML);
        });
        ativarBotoesAdicionar();
    }
}

// Adiciona o botão de filtro "Do Administrador"
function adicionarFiltroAdmin() {
    const filtroCategorias = document.querySelector(".filtro-categorias");
    if (filtroCategorias && !document.querySelector("[data-categoria=\"admin\"]")) {
        const categoriaBotao = document.createElement("button");
        categoriaBotao.className = "filtro-btn";
        categoriaBotao.setAttribute("data-categoria", "admin");
        categoriaBotao.textContent = "Do Administrador";
        filtroCategorias.appendChild(categoriaBotao);
    }
}

// Cria o HTML para um card de pizza vindo do admin
function criarCardPizzaAdmin(pizza, index) {
    // Gera um ID único baseado no nome e preço para evitar problemas com índices após exclusão
    const uniqueId = `admin-${pizza.nome.replace(/\s+/g, '-')}-${pizza.preco}-${index}`;
    return `
        <div class="card-produto" data-categoria="admin">
            <div class="produto-img">
                <img src="https://via.placeholder.com/300x200?text=${encodeURIComponent(pizza.nome)}" alt="${pizza.nome}">
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
        console.warn("Opções de montagem não encontradas no localStorage. Usando valores padrão.");
        // Define valores padrão mínimos caso o admin não tenha configurado
        opcoesMontagem = {
            tamanhos: [{ nome: "Média - Massa Tradicional", preco: 40.00 }],
            ingredientes: [
                { nome: "Queijo Mussarela", preco: 0.00 }, // Ingrediente base (gratuito)
                { nome: "Molho de Tomate", preco: 0.00 } // Ingrediente base (gratuito)
            ],
            bordas: [{ nome: "Sem Borda Recheada", preco: 0.00 }],
        };
    }
}

// Popula a seção "Monte Sua Pizza" com as opções carregadas
function popularOpcoesMontagemCliente() {
    const secaoMontagem = document.getElementById("montar-pizza");
    if (!secaoMontagem) return;

    const containerTamanhos = secaoMontagem.querySelector(".opcao-grupo:nth-child(1) .opcao-item")?.parentNode; // Pega o pai dos itens
    const containerIngredientes = secaoMontagem.querySelector(".ingredientes-grid");
    const containerBordas = secaoMontagem.querySelector(".opcao-grupo:nth-child(3) .opcao-item")?.parentNode; // Pega o pai dos itens

    // Limpa containers antes de popular
    if (containerTamanhos) containerTamanhos.innerHTML = "";
    if (containerIngredientes) containerIngredientes.innerHTML = "";
    if (containerBordas) containerBordas.innerHTML = "";

    // Popula Tamanhos/Massas (Radio)
    if (containerTamanhos && opcoesMontagem.tamanhos.length > 0) {
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
    if (containerIngredientes && opcoesMontagem.ingredientes.length > 0) {
        opcoesMontagem.ingredientes.forEach((item, index) => {
            // Não exibe ingredientes com preço 0 (considerados base e já inclusos no preço do tamanho)
            if (item.preco > 0) {
                const id = `ingrediente-${index}`;
                const precoIngredientePadrao = 6.00;
                const precoLabel = item.preco > precoIngredientePadrao ? ` (+R$ ${(item.preco - precoIngredientePadrao).toFixed(2)})` : "";
                const div = document.createElement("div");
                div.className = "opcao-item";
                div.innerHTML = `
                    <input type="checkbox" id="${id}" name="ingredientes" value="${item.nome}" data-preco="${item.preco}">
                    <label for="${id}">${item.nome}${precoLabel}</label>
                `;
                containerIngredientes.appendChild(div);
            }
        });
    } else if (containerIngredientes) {
        containerIngredientes.innerHTML = "<p>Nenhum ingrediente adicional cadastrado.</p>";
    }

    // Popula Bordas (Radio)
    if (containerBordas && opcoesMontagem.bordas.length > 0) {
        opcoesMontagem.bordas.forEach((item, index) => {
            const id = `borda-${index}`;
            const checked = item.preco === 0 ? "checked" : ""; // Marca a borda sem custo como padrão
            const precoLabel = item.preco > 0 ? ` (R$ ${item.preco.toFixed(2)})` : "";
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
                if (targetId === 'montar-pizza') {
                    // Recarrega e popula opções ao mostrar a seção, garantindo dados atualizados
                    carregarOpcoesMontagemCliente();
                    popularOpcoesMontagemCliente();
                    configurarEventosMontagem(); // Reconfigura eventos para elementos dinâmicos
                    atualizarResumoMontagem();
                }
            }
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

    filtroContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("filtro-btn")) {
            const filtroBtns = filtroContainer.querySelectorAll(".filtro-btn");
            const cardProdutos = document.querySelectorAll(".card-produto");

            filtroBtns.forEach((b) => b.classList.remove("active"));
            e.target.classList.add("active");

            const categoria = e.target.getAttribute("data-categoria");

            cardProdutos.forEach((card) => {
                // Garante que o card tenha o atributo data-categoria
                const cardCategoria = card.getAttribute("data-categoria");
                if (cardCategoria) {
                    if (categoria === "todas" || cardCategoria === categoria) {
                        card.style.display = "flex";
                    } else {
                        card.style.display = "none";
                    }
                } else {
                     // Se não tiver categoria, mostra apenas no filtro "todas"
                     card.style.display = (categoria === "todas") ? "flex" : "none";
                }
            });
        }
    });
}

// Adiciona event listeners aos inputs e ao botão de adicionar da seção "Monte Sua Pizza"
function configurarEventosMontagem() {
    const secaoMontagem = document.getElementById("montar-pizza");
    if (!secaoMontagem) return;

    // Listener para mudanças nos inputs (delegação)
    secaoMontagem.addEventListener("change", function (e) {
        if (e.target.matches('input[name="tamanho"], input[name="ingredientes"], input[name="borda"]')) {
            atualizarResumoMontagem();
        }
    });

    // Listener para o botão de adicionar pizza montada
    const btnAdicionarMontada = document.getElementById("btn-adicionar-montada");
    if (btnAdicionarMontada) {
        // Remove listener antigo para evitar duplicação
        const clone = btnAdicionarMontada.cloneNode(true);
        btnAdicionarMontada.parentNode.replaceChild(clone, btnAdicionarMontada);

        // Adiciona novo listener
        document.getElementById("btn-adicionar-montada").addEventListener("click", function() {
            if (!this.disabled) { // Verifica se o botão está habilitado
                adicionarPizzaMontadaAoCarrinho();
            }
        });
    }
}

// --- Lógica "Monte Sua Pizza" ---

// Calcula o preço e atualiza o resumo da pizza sendo montada
function calcularPrecoMontagem() {
    let precoBase = 0;
    let nomeTamanho = "Nenhum";
    let ingredientesSelecionados = [];
    let nomeBorda = "Sem recheio";
    let precoBorda = 0;
    let precoIngredientesExtras = 0;
    const limiteIngredientesGratis = 5;
    const precoIngredientePadrao = 6.00;

    const tamanhoInputChecked = document.querySelector('input[name="tamanho"]:checked');
    if (tamanhoInputChecked) {
        nomeTamanho = tamanhoInputChecked.value;
        precoBase = parseFloat(tamanhoInputChecked.getAttribute("data-preco")) || 0;
    }

    const ingredientesInputsChecked = document.querySelectorAll('input[name="ingredientes"]:checked');
    ingredientesInputsChecked.forEach((input, index) => {
        const nomeIngrediente = input.value;
        const precoData = parseFloat(input.getAttribute("data-preco")) || precoIngredientePadrao;
        ingredientesSelecionados.push(nomeIngrediente);
        if (index >= limiteIngredientesGratis) {
            precoIngredientesExtras += precoData;
        }
    });

    const bordaInputChecked = document.querySelector('input[name="borda"]:checked');
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

// Atualiza a interface do resumo da pizza montada
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
    const limiteIngredientesGratis = 5;
    const precoIngredientePadrao = 6.00;

    resumoTamanhoSpan.textContent = calculo.nomeTamanho;
    resumoPrecoBaseSpan.textContent = `R$ ${calculo.precoBase.toFixed(2)}`;

    let ingredientesHTML = "";
    if (calculo.ingredientesSelecionados.length > 0) {
        ingredientesHTML = "<h5>Ingredientes Adicionais:</h5>";
        calculo.ingredientesSelecionados.forEach((nomeIngrediente, index) => {
            const input = document.querySelector(`input[name="ingredientes"][value="${nomeIngrediente}"]`);
            const precoData = input ? (parseFloat(input.getAttribute("data-preco")) || precoIngredientePadrao) : precoIngredientePadrao;

            if (index < limiteIngredientesGratis) {
                ingredientesHTML += `<div class="resumo-item"><span>- ${nomeIngrediente}</span><span>Incluso</span></div>`;
            } else {
                ingredientesHTML += `<div class="resumo-item"><span>- ${nomeIngrediente}</span><span>+ R$ ${precoData.toFixed(2)}</span></div>`;
            }
        });
    } else {
        ingredientesHTML = `<p><i>Selecione até ${limiteIngredientesGratis} ingredientes gratuitos. Extras custam a partir de R$ ${precoIngredientePadrao.toFixed(2)}.</i></p>`;
    }
    resumoIngredientesDiv.innerHTML = ingredientesHTML;

    resumoBordaDiv.innerHTML = `
        <span>Borda: ${calculo.nomeBorda}</span>
        <span>${calculo.precoBorda > 0 ? `+ R$ ${calculo.precoBorda.toFixed(2)}` : "R$ 0,00"}</span>
    `;
    precoTotalSpan.textContent = `R$ ${calculo.precoTotalCalculado.toFixed(2)}`;

    // Habilita o botão apenas se um tamanho for selecionado
    const tamanhoSelecionado = document.querySelector('input[name="tamanho"]:checked');
    btnAdicionarMontada.disabled = !tamanhoSelecionado;
    if (tamanhoSelecionado) {
        btnAdicionarMontada.innerHTML = `<i class="fas fa-cart-plus"></i> Adicionar ao Carrinho`;
    } else {
        btnAdicionarMontada.innerHTML = `<i class="fas fa-cart-plus"></i> Selecione um Tamanho`;
    }
}

// Coleta os dados da pizza montada e adiciona ao carrinho
function adicionarPizzaMontadaAoCarrinho() {
    const calculo = calcularPrecoMontagem();

    if (calculo.nomeTamanho === "Nenhum") {
        alert("Por favor, selecione o tamanho da pizza.");
        return;
    }

    const nomePizzaMontada = `Pizza Montada - ${calculo.nomeTamanho}`;
    const detalhes = {
        tamanho: calculo.nomeTamanho,
        ingredientes: calculo.ingredientesSelecionados,
        borda: calculo.nomeBorda
    };

    // Adiciona ao carrinho com um ID único
    adicionarAoCarrinho(`montada-${Date.now()}`, nomePizzaMontada, calculo.precoTotalCalculado, 1, detalhes);

    // Opcional: Limpar seleções após adicionar ao carrinho?
    // limparSelecaoMontagem();
    // atualizarResumoMontagem();
}

// --- Lógica do Carrinho ---

function inicializarCarrinho() {
    const carrinhoSalvo = localStorage.getItem("carrinhoPizzaria");
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
    }
    atualizarContadorCarrinho();
    atualizarCarrinhoUI();
    ativarBotoesAdicionar();
    ativarBotoesPromocao();
    // O botão da pizza montada é ativado/configurado em configurarEventosMontagem
}

function ativarBotoesAdicionar() {
    const botoesAdicionar = document.querySelectorAll(".btn-adicionar");
    botoesAdicionar.forEach(botao => {
        const clone = botao.cloneNode(true);
        botao.parentNode.replaceChild(clone, botao);
    });
    document.querySelectorAll(".btn-adicionar").forEach((botao) => {
        botao.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            const nome = this.getAttribute("data-nome");
            const preco = parseFloat(this.getAttribute("data-preco"));
            adicionarAoCarrinho(id, nome, preco, 1, null);
        });
    });
}

function ativarBotoesPromocao() {
    const botoesPromocao = document.querySelectorAll(".btn-promocao");
    botoesPromocao.forEach(botao => {
        const clone = botao.cloneNode(true);
        botao.parentNode.replaceChild(clone, botao);
    });
    document.querySelectorAll(".btn-promocao").forEach((botao) => {
        botao.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            const nome = this.getAttribute("data-nome");
            const preco = parseFloat(this.getAttribute("data-preco"));
            adicionarAoCarrinho(id, nome, preco, 1, null);
        });
    });
}

// Adiciona um item ao carrinho (pizza pronta, promoção ou montada)
function adicionarAoCarrinho(id, nome, preco, quantidade = 1, detalhes = null) {
    const idFinal = id.startsWith('montada-') ? id : id; // Mantém ID único para montadas
    const itemExistente = carrinho.find((item) => item.id === idFinal);

    // Só agrupa itens se NÃO forem pizzas montadas (que têm ID único)
    if (itemExistente && !id.startsWith('montada-')) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({
            id: idFinal,
            nome: nome,
            preco: preco,
            quantidade: quantidade,
            detalhes: detalhes // Guarda os detalhes da pizza montada
        });
    }

    localStorage.setItem("carrinhoPizzaria", JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    atualizarCarrinhoUI();
    alert(`${nome} adicionado ao carrinho!`);
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
    const taxaEntrega = 10.00;

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

// Cria o HTML para um item dentro do carrinho, incluindo detalhes da pizza montada
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
                <h4>${item.nome} ${item.quantidade > 1 ? `(x${item.quantidade})` : ''}</h4>
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
        carrinho.splice(index, 1);
        localStorage.setItem("carrinhoPizzaria", JSON.stringify(carrinho));
        atualizarContadorCarrinho();
        atualizarCarrinhoUI();
    }
}

