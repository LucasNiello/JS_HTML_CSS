// cliente_updated.js - Funcionalidades para a página do cliente com integração localStorage

// --- Variáveis Globais ---
let carrinho = [];
let opcoesMontagem = {
    tamanhos: [],
    ingredientes: [],
    bordas: []
};
const OPCOES_MONTAGEM_KEY = "opcoesMontagemPizzaria";
const CARDAPIO_KEY = "cardapioPizzaria";
const CARRINHO_KEY = "carrinhoPizzaria";

// --- Funções de Inicialização e Carregamento ---

document.addEventListener("DOMContentLoaded", function () {
    carregarCardapioCliente();
    carregarOpcoesMontagemCliente(); // Carrega inicialmente
    popularOpcoesMontagemCliente(); // Popula inicialmente
    inicializarCarrinho();
    configurarNavegacao();
    configurarFiltrosCardapio();
    configurarEventosMontagem();
    atualizarResumoMontagem();
    configurarFinalizarPedido();
    configurarListenerLocalStorage(); // Adiciona listener para atualizações
});

// Carrega o cardápio principal (pizzas prontas) do localStorage
function carregarCardapioCliente() {
    const cardapioSalvo = localStorage.getItem(CARDAPIO_KEY);
    const gridProdutos = document.querySelector(".grid-produtos");
    if (!gridProdutos) return;

    gridProdutos.innerHTML = ""; // Limpa o grid antes de carregar
    let pizzas = [];
    if (cardapioSalvo) {
        try {
            pizzas = JSON.parse(cardapioSalvo);
        } catch (e) {
            console.error("Erro ao parsear cardápio do localStorage:", e);
            pizzas = [];
        }
    }

    if (pizzas.length > 0) {
        pizzas.forEach((pizza, index) => {
            // Adiciona uma verificação básica para garantir que o item é uma pizza válida
            if (pizza && typeof pizza.nome === 'string' && typeof pizza.ingredientes === 'string' && typeof pizza.preco === 'number') {
                const cardHTML = criarCardPizzaAdmin(pizza, index);
                gridProdutos.insertAdjacentHTML("beforeend", cardHTML);
            } else {
                console.warn("Item inválido encontrado no cardápio:", pizza);
            }
        });
        adicionarFiltroAdmin(); // Adiciona filtro se houver pizzas do admin
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
        filtroCategorias.appendChild(categoriaBotao); // Adiciona ao final
    }
}

// Cria o HTML para um card de pizza vindo do admin
function criarCardPizzaAdmin(pizza, index) {
    const uniqueId = `admin-${pizza.nome.replace(/\s+/g, "-")}-${pizza.preco}-${index}`;
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
    const opcoesSalvas = localStorage.getItem(OPCOES_MONTAGEM_KEY);
    if (opcoesSalvas) {
        try {
            const parsedOpcoes = JSON.parse(opcoesSalvas);
            // Validação básica da estrutura carregada
            opcoesMontagem.tamanhos = Array.isArray(parsedOpcoes.tamanhos) ? parsedOpcoes.tamanhos : [];
            opcoesMontagem.ingredientes = Array.isArray(parsedOpcoes.ingredientes) ? parsedOpcoes.ingredientes : [];
            opcoesMontagem.bordas = Array.isArray(parsedOpcoes.bordas) ? parsedOpcoes.bordas : [];
        } catch (e) {
            console.error("Erro ao parsear opções de montagem do localStorage:", e);
            inicializarOpcoesMontagemPadraoCliente(); // Usa padrão em caso de erro
        }
    } else {
        console.warn("Opções de montagem não encontradas no localStorage. Usando valores padrão mínimos.");
        inicializarOpcoesMontagemPadraoCliente();
    }
}

// Define valores padrão mínimos caso o localStorage esteja vazio ou corrompido
function inicializarOpcoesMontagemPadraoCliente() {
    opcoesMontagem = {
        tamanhos: [{ nome: "Média - Massa Tradicional", preco: 40.00 }],
        ingredientes: [{ nome: "Queijo Mussarela", preco: 0.00 }, { nome: "Molho de Tomate", preco: 0.00 }],
        bordas: [{ nome: "Sem Borda Recheada", preco: 0.00 }],
    };
}

// Popula a seção "Monte Sua Pizza" com as opções carregadas
function popularOpcoesMontagemCliente() {
    const secaoMontagem = document.getElementById("montar-pizza");
    if (!secaoMontagem) return;

    // Seleciona os containers corretos (ajustado para corresponder ao HTML fornecido)
    const containerTamanhos = secaoMontagem.querySelector(".opcao-grupo:nth-of-type(1) > div:not([class])"); // Primeiro grupo, div sem classe específica
    const containerIngredientes = secaoMontagem.querySelector(".ingredientes-grid");
    const containerBordas = secaoMontagem.querySelector(".opcao-grupo:nth-of-type(3) > div:not([class])"); // Terceiro grupo, div sem classe específica

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
            // Exibe todos ingredientes com preço > 0 como adicionais
            if (item.preco > 0) {
                const id = `ingrediente-${index}`;
                const div = document.createElement("div");
                div.className = "opcao-item";
                // Adiciona identificador único para o ingrediente
                div.innerHTML = `
                    <input type="checkbox" id="${id}" name="ingredientes" value="${item.nome}" data-preco="${item.preco}">
                    <label for="${id}">${item.nome} (+ R$ ${item.preco.toFixed(2)})</label>
                `;
                containerIngredientes.appendChild(div);
            }
        });
         if (containerIngredientes.children.length === 0) {
             containerIngredientes.innerHTML = "<p>Nenhum ingrediente adicional cadastrado.</p>";
         }
    } else if (containerIngredientes) {
        containerIngredientes.innerHTML = "<p>Nenhum ingrediente adicional cadastrado.</p>";
    }

    // Popula Bordas (Radio)
    if (containerBordas && opcoesMontagem.bordas && opcoesMontagem.bordas.length > 0) {
        opcoesMontagem.bordas.forEach((item, index) => {
            const id = `borda-${index}`;
            const checked = item.preco === 0 ? "checked" : ""; // Marca a borda sem custo como padrão
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
    // Reconfigura eventos após popular, pois os elementos foram recriados
    configurarEventosMontagem();
    atualizarResumoMontagem();
}

// --- Configuração de Eventos ---

function configurarNavegacao() {
    const navLinks = document.querySelectorAll(".nav-link");
    const secoes = document.querySelectorAll(".secao");
    const modal = document.getElementById("carrinho-modal");
    const fecharModal = document.querySelector(".fechar-modal");
    const btnContinuarComprando = document.querySelectorAll(".btn-continuar-comprando");

    function mostrarSecaoAtiva(targetId) {
        secoes.forEach((secao) => secao.classList.remove("active"));
        navLinks.forEach((link) => link.classList.remove("active"));

        if (targetId === "carrinho-modal" && modal) {
            modal.classList.add("active");
            atualizarCarrinhoUI();
        } else {
            const targetSecao = document.getElementById(targetId);
            if (targetSecao) {
                targetSecao.classList.add("active");
                // Recarrega dados relevantes ao mostrar a seção
                if (targetId === "montar-pizza") {
                    // Os dados já são carregados/populados pelo listener ou no load inicial
                    // Apenas garante que o resumo esteja atualizado
                    atualizarResumoMontagem();
                }
                if (targetId === "cardapio") {
                    // Recarrega cardápio caso tenha sido atualizado
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
            mostrarSecaoAtiva(targetId);
        });
    });

    if (fecharModal) {
        fecharModal.addEventListener("click", () => modal.classList.remove("active"));
    }
    btnContinuarComprando.forEach((btn) => {
        btn.addEventListener("click", () => modal.classList.remove("active"));
    });

    // Mostra a seção 'cardapio' por padrão ao carregar
    mostrarSecaoAtiva('cardapio');
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
                const cardCategoria = card.getAttribute("data-categoria");
                if (categoria === "todas" || cardCategoria === categoria || (categoria === "admin" && cardCategoria === "admin")) {
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

    const opcoesPizzaDiv = secaoMontagem.querySelector(".opcoes-pizza");
    if (opcoesPizzaDiv) {
        // Remove listener antigo para evitar duplicação
        opcoesPizzaDiv.replaceWith(opcoesPizzaDiv.cloneNode(true));
        const novoOpcoesPizzaDiv = secaoMontagem.querySelector(".opcoes-pizza"); // Pega a referência do novo nó clonado

        novoOpcoesPizzaDiv.addEventListener("change", function (e) {
            if (e.target.matches("input[name='tamanho'], input[name='ingredientes'], input[name='borda']")) {
                atualizarResumoMontagem();
            }
        });
    }

    const btnAdicionarMontada = document.getElementById("btn-adicionar-montada");
    if (btnAdicionarMontada) {
        // Remove listener antigo para evitar duplicação
        const newBtn = btnAdicionarMontada.cloneNode(true);
        btnAdicionarMontada.parentNode.replaceChild(newBtn, btnAdicionarMontada);

        newBtn.addEventListener("click", function() {
            if (!this.disabled) {
                adicionarPizzaMontadaAoCarrinho();
            }
        });
        // Garante que o estado inicial do botão esteja correto
        atualizarResumoMontagem();
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

    const tamanhoInputChecked = document.querySelector("input[name='tamanho']:checked");
    if (tamanhoInputChecked) {
        nomeTamanho = tamanhoInputChecked.value;
        precoBase = parseFloat(tamanhoInputChecked.getAttribute("data-preco")) || 0;
    }

    const ingredientesInputsChecked = document.querySelectorAll("input[name='ingredientes']:checked");
    ingredientesInputsChecked.forEach(input => {
        const nomeIngrediente = input.value;
        const precoData = parseFloat(input.getAttribute("data-preco")) || 0;
        ingredientesSelecionados.push({ nome: nomeIngrediente, preco: precoData }); // Armazena nome e preço
        precoIngredientesExtras += precoData;
    });

    const bordaInputChecked = document.querySelector("input[name='borda']:checked");
    if (bordaInputChecked) {
        nomeBorda = bordaInputChecked.value;
        precoBorda = parseFloat(bordaInputChecked.getAttribute("data-preco")) || 0;
    }

    const precoTotalCalculado = precoBase + precoIngredientesExtras + precoBorda;

    return {
        nomeTamanho,
        precoBase,
        ingredientesSelecionados, // Array de objetos {nome, preco}
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
        // console.warn("Elementos do resumo não encontrados.");
        return; // Sai se algum elemento essencial não for encontrado
    }

    const calculo = calcularPrecoMontagem();

    resumoTamanhoSpan.textContent = calculo.nomeTamanho;
    resumoPrecoBaseSpan.textContent = `R$ ${calculo.precoBase.toFixed(2)}`;

    let ingredientesHTML = "";
    if (calculo.ingredientesSelecionados.length > 0) {
        ingredientesHTML = "<h5>Ingredientes Adicionais:</h5>";
        calculo.ingredientesSelecionados.forEach(ingrediente => {
            ingredientesHTML += `<div class="resumo-item"><span>- ${ingrediente.nome}</span><span>+ R$ ${ingrediente.preco.toFixed(2)}</span></div>`;
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
    // Atualiza texto do botão
    btnAdicionarMontada.innerHTML = btnAdicionarMontada.disabled
        ? '<i class="fas fa-cart-plus"></i> Selecione um Tamanho'
        : '<i class="fas fa-cart-plus"></i> Adicionar ao Carrinho';
}

// --- Lógica do Carrinho ---

function inicializarCarrinho() {
    const carrinhoSalvo = localStorage.getItem(CARRINHO_KEY);
    if (carrinhoSalvo) {
        try {
            carrinho = JSON.parse(carrinhoSalvo);
        } catch (e) {
            console.error("Erro ao parsear carrinho do localStorage:", e);
            carrinho = [];
        }
    }
    atualizarContadorCarrinho();
    ativarBotoesAdicionar(); // Garante que os botões funcionem após carregar o cardápio
    atualizarCarrinhoUI(); // Atualiza a UI do modal do carrinho
}

function salvarCarrinho() {
    localStorage.setItem(CARRINHO_KEY, JSON.stringify(carrinho));
}

function ativarBotoesAdicionar() {
    const botoesAdicionar = document.querySelectorAll(".btn-adicionar");
    botoesAdicionar.forEach(botao => {
        // Remove listener antigo para evitar duplicação, clonando o botão
        const newBotao = botao.cloneNode(true);
        botao.parentNode.replaceChild(newBotao, botao);

        newBotao.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            const nome = this.getAttribute("data-nome");
            const preco = parseFloat(this.getAttribute("data-preco"));
            adicionarAoCarrinho(id, nome, preco, 1, "pronta");
        });
    });

    // Ativa botões de promoção (se existirem)
    const botoesPromocao = document.querySelectorAll(".btn-promocao");
     botoesPromocao.forEach(botao => {
        const newBotao = botao.cloneNode(true);
        botao.parentNode.replaceChild(newBotao, botao);
        newBotao.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            const nome = this.getAttribute("data-nome");
            const preco = parseFloat(this.getAttribute("data-preco"));
            adicionarAoCarrinho(id, nome, preco, 1, "promocao");
        });
    });
}

function adicionarPizzaMontadaAoCarrinho() {
    const calculo = calcularPrecoMontagem();
    if (calculo.nomeTamanho === "Nenhum") {
        showPopup("Selecione o tamanho da pizza primeiro.", "warning");
        return;
    }

    // Cria um nome descritivo para a pizza montada
    let nomePizzaMontada = `Pizza Montada (${calculo.nomeTamanho})`;
    if (calculo.ingredientesSelecionados.length > 0) {
        nomePizzaMontada += ` com ${calculo.ingredientesSelecionados.map(i => i.nome).join(', ')}`;
    }
    if (calculo.nomeBorda !== "Sem recheio") {
        nomePizzaMontada += ` e borda de ${calculo.nomeBorda}`;
    }

    // Gera um ID único baseado nas opções selecionadas
    const idMontada = `montada-${Date.now()}`;

    adicionarAoCarrinho(idMontada, nomePizzaMontada, calculo.precoTotalCalculado, 1, "montada", calculo);
}

function adicionarAoCarrinho(id, nome, preco, quantidade, tipo = "pronta", detalhesMontagem = null) {
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({ id, nome, preco, quantidade, tipo, detalhesMontagem });
    }

    salvarCarrinho();
    atualizarContadorCarrinho();
    atualizarCarrinhoUI();
    showPopup(`'${nome}' adicionado ao carrinho!`, "success");
}

function atualizarContadorCarrinho() {
    const contador = document.querySelector(".contador-itens");
    if (contador) {
        const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
        contador.textContent = totalItens;
        contador.style.display = totalItens > 0 ? "inline-block" : "none";
    }
}

function atualizarCarrinhoUI() {
    const listaItensCarrinho = document.getElementById("lista-itens-carrinho");
    const totalCarrinhoSpan = document.getElementById("total-carrinho");
    const carrinhoVazioMsg = document.getElementById("carrinho-vazio");
    const carrinhoConteudo = document.getElementById("carrinho-conteudo");

    if (!listaItensCarrinho || !totalCarrinhoSpan || !carrinhoVazioMsg || !carrinhoConteudo) return;

    listaItensCarrinho.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
        carrinhoVazioMsg.style.display = "block";
        carrinhoConteudo.style.display = "none";
    } else {
        carrinhoVazioMsg.style.display = "none";
        carrinhoConteudo.style.display = "block";
        carrinho.forEach((item, index) => {
            const subtotal = item.preco * item.quantidade;
            total += subtotal;
            const li = document.createElement("li");
            li.className = "item-carrinho";
            li.innerHTML = `
                <div class="item-info">
                    <span>${item.nome}</span>
                    <span class="item-preco">R$ ${item.preco.toFixed(2)}</span>
                </div>
                <div class="item-controles">
                    <button class="btn-qtd" onclick="mudarQuantidade(${index}, -1)">-</button>
                    <span class="item-qtd">${item.quantidade}</span>
                    <button class="btn-qtd" onclick="mudarQuantidade(${index}, 1)">+</button>
                    <button class="btn-remover" onclick="removerDoCarrinho(${index})"><i class="fas fa-trash-alt"></i></button>
                </div>
                <div class="item-subtotal">Subtotal: R$ ${subtotal.toFixed(2)}</div>
            `;
            // Adiciona detalhes da pizza montada se existirem
            if (item.tipo === 'montada' && item.detalhesMontagem) {
                const detalhesDiv = document.createElement('div');
                detalhesDiv.className = 'item-detalhes-montagem';
                let detalhesHTML = `Tamanho: ${item.detalhesMontagem.nomeTamanho}`;
                if (item.detalhesMontagem.ingredientesSelecionados.length > 0) {
                    detalhesHTML += `, Ingredientes: ${item.detalhesMontagem.ingredientesSelecionados.map(i => i.nome).join(', ')}`;
                }
                detalhesHTML += `, Borda: ${item.detalhesMontagem.nomeBorda}`;
                detalhesDiv.textContent = detalhesHTML;
                li.querySelector('.item-info').appendChild(detalhesDiv);
            }
            listaItensCarrinho.appendChild(li);
        });
    }

    totalCarrinhoSpan.textContent = `R$ ${total.toFixed(2)}`;
}

function mudarQuantidade(index, delta) {
    if (carrinho[index]) {
        carrinho[index].quantidade += delta;
        if (carrinho[index].quantidade <= 0) {
            removerDoCarrinho(index);
        } else {
            salvarCarrinho();
            atualizarCarrinhoUI();
            atualizarContadorCarrinho();
        }
    }
}

function removerDoCarrinho(index) {
    if (carrinho[index]) {
        const nomeRemovido = carrinho[index].nome;
        carrinho.splice(index, 1);
        salvarCarrinho();
        atualizarCarrinhoUI();
        atualizarContadorCarrinho();
        showPopup(`'${nomeRemovido}' removido do carrinho.`, "info");
    }
}

function configurarFinalizarPedido() {
    const btnFinalizar = document.getElementById("btn-finalizar-pedido");
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", () => {
            if (carrinho.length > 0) {
                // Simula finalização
                showPopup("Pedido finalizado com sucesso! Obrigado por comprar conosco.", "success");
                carrinho = []; // Limpa o carrinho
                salvarCarrinho();
                atualizarCarrinhoUI();
                atualizarContadorCarrinho();
                // Fecha o modal após finalizar
                const modal = document.getElementById("carrinho-modal");
                if(modal) modal.classList.remove("active");
            } else {
                showPopup("Seu carrinho está vazio.", "warning");
            }
        });
    }
}

// --- Sincronização com localStorage ---

function configurarListenerLocalStorage() {
    window.addEventListener('storage', function(event) {
        console.log("Evento de storage detectado:", event.key);
        if (event.key === OPCOES_MONTAGEM_KEY) {
            console.log("Opções de montagem atualizadas no localStorage. Recarregando...");
            showPopup("As opções para montar sua pizza foram atualizadas!", "info");
            carregarOpcoesMontagemCliente();
            // Apenas repopula se a seção estiver visível
            const secaoMontagem = document.getElementById("montar-pizza");
            if (secaoMontagem && secaoMontagem.classList.contains("active")) {
                popularOpcoesMontagemCliente();
            }
        }
        if (event.key === CARDAPIO_KEY) {
            console.log("Cardápio principal atualizado no localStorage. Recarregando...");
            showPopup("O cardápio foi atualizado!", "info");
            // Apenas recarrega se a seção estiver visível
            const secaoCardapio = document.getElementById("cardapio");
            if (secaoCardapio && secaoCardapio.classList.contains("active")) {
                 carregarCardapioCliente();
            }
        }
        // Poderia adicionar listener para o carrinho também, se necessário
    });
}

// --- Funções de Popup (Exemplo, assumindo que popup_function.js existe) ---
// Se showPopup não estiver globalmente disponível, defina uma função aqui ou importe-a.
// Exemplo básico:
/*
function showPopup(message, type = 'info') {
    alert(`[${type.toUpperCase()}] ${message}`);
}
*/

