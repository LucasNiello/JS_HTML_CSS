let carrinho = [];
let opcoesMontagem = {
    tamanhos: [],
    ingredientes: [],
    bordas: []
};

document.addEventListener("DOMContentLoaded", function () {
    carregarCardapioCliente();
    carregarOpcoesMontagemCliente();
    popularOpcoesMontagemCliente();
    inicializarCarrinho();
    configurarNavegacao();
    configurarFiltrosCardapio();
    configurarEventosMontagem();
    atualizarResumoMontagem();
});

function carregarCardapioCliente() {
    const cardapioSalvo = localStorage.getItem("cardapioPizzaria");
    if (cardapioSalvo) {
        const pizzas = JSON.parse(cardapioSalvo);
        const gridProdutos = document.querySelector(".grid-produtos");
        const promocoesContainer = document.querySelector(".promocoes-container");
        const docesContainer = document.querySelector("#pizzas-doces .grid-produtos");
        if (!gridProdutos || !promocoesContainer || !docesContainer) return;

        // Limpa os containers
        gridProdutos.innerHTML = "";
        promocoesContainer.innerHTML = "";
        if (docesContainer) docesContainer.innerHTML = "";

        // Adiciona filtros dinâmicos com base nas categorias disponíveis
        const categorias = [...new Set(pizzas.map(p => p.categoria))];
        const filtroCategorias = document.querySelector(".filtro-categorias");
        if (filtroCategorias) {
            filtroCategorias.innerHTML = `<button class="filtro-btn active" data-categoria="todas">Todas</button>`;
            categorias.forEach(categoria => {
                const botao = document.createElement("button");
                botao.className = "filtro-btn";
                botao.setAttribute("data-categoria", categoria);
                botao.textContent = categoria;
                filtroCategorias.appendChild(botao);
            });
        }

        pizzas.forEach((pizza, index) => {
            const uniqueId = `${pizza.categoria.toLowerCase().replace(/\s+/g, '-')}-${pizza.nome.replace(/\s+/g, '-')}-${pizza.preco}-${index}`;
            const cardHTML = criarCardPizza(pizza, uniqueId);
            if (pizza.categoria === "Promoções") {
                promocoesContainer.insertAdjacentHTML("beforeend", cardHTML);
            } else if (pizza.categoria === "Doces") {
                if (docesContainer) {
                    docesContainer.insertAdjacentHTML("beforeend", cardHTML);
                }
            } else {
                gridProdutos.insertAdjacentHTML("beforeend", cardHTML);
            }
        });
        ativarBotoesAdicionar();
    }
}

function criarCardPizza(pizza, uniqueId) {
    const isPromocao = pizza.categoria === "Promoções";
    const cardClass = isPromocao ? "card-promocao" : "card-produto";
    const imgClass = isPromocao ? "promocao-img" : "produto-img";
    const infoClass = isPromocao ? "promocao-info" : "produto-info";
    const btnClass = isPromocao ? "btn-promocao" : "btn-adicionar";
    const tagClass = isPromocao ? "promocao-tag" : "tag-destaque";
    const precoHTML = isPromocao
        ? `<div class="promocao-preco">
               <span class="preco-original">R$ ${(pizza.preco * 1.3).toFixed(2)}</span>
               <span class="preco-promocional">R$ ${pizza.preco.toFixed(2)}</span>
           </div>`
        : `<div class="produto-footer">
               <span class="preco">R$ ${pizza.preco.toFixed(2)}</span>
               <button class="${btnClass}" data-id="${uniqueId}" data-nome="${pizza.nome}" data-preco="${pizza.preco}">
                   <i class="fas fa-plus"></i> Adicionar
               </button>
           </div>`;

    return `
        <div class="${cardClass}" data-categoria="${pizza.categoria}">
            <div class="${imgClass}">
                <img src="https://via.placeholder.com/300x200?text=${encodeURIComponent(pizza.nome)}" alt="${pizza.nome}">
                <span class="${tagClass}">${pizza.categoria}</span>
            </div>
            <div class="${infoClass}">
                <h3>${pizza.nome}</h3>
                <p class="ingredientes">${pizza.ingredientes}</p>
                ${precoHTML}
            </div>
        </div>
    `;
}

function carregarOpcoesMontagemCliente() {
    const opcoesSalvas = localStorage.getItem("opcoesMontagemPizzaria");
    if (opcoesSalvas) {
        opcoesMontagem = JSON.parse(opcoesSalvas);
    } else {
        console.warn("Opções de montagem não encontradas no localStorage. Usando valores padrão.");
        opcoesMontagem = {
            tamanhos: [{ nome: "Média - Massa Tradicional", preco: 40.00 }],
            ingredientes: [
                { nome: "Queijo Mussarela", preco: 0.00 },
                { nome: "Molho de Tomate", preco: 0.00 }
            ],
            bordas: [{ nome: "Sem Borda Recheada", preco: 0.00 }],
        };
    }
}

function popularOpcoesMontagemCliente() {
    const secaoMontagem = document.getElementById("montar-pizza");
    if (!secaoMontagem) return;

    const containerTamanhos = secaoMontagem.querySelector(".opcao-grupo:nth-child(1) .opcao-lista");
    const containerIngredientes = secaoMontagem.querySelector(".ingredientes-lista");
    const containerBordas = secaoMontagem.querySelector(".opcao-grupo:nth-child(3) .opcao-lista");

    if (containerTamanhos) containerTamanhos.innerHTML = "";
    if (containerIngredientes) containerIngredientes.innerHTML = "";
    if (containerBordas) containerBordas.innerHTML = "";

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

    if (containerIngredientes && opcoesMontagem.ingredientes.length > 0) {
        opcoesMontagem.ingredientes.forEach((item, index) => {
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

    if (containerBordas && opcoesMontagem.bordas.length > 0) {
        opcoesMontagem.bordas.forEach((item, index) => {
            const id = `borda-${index}`;
            const checked = item.preco === 0 ? "checked" : "";
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
                    carregarOpcoesMontagemCliente();
                    popularOpcoesMontagemCliente();
                    configurarEventosMontagem();
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
            const cardProdutos = document.querySelectorAll(".card-produto, .card-promocao");

            filtroBtns.forEach((b) => b.classList.remove("active"));
            e.target.classList.add("active");

            const categoria = e.target.getAttribute("data-categoria");

            cardProdutos.forEach((card) => {
                const cardCategoria = card.getAttribute("data-categoria");
                if (cardCategoria) {
                    if (categoria === "todas" || cardCategoria === categoria) {
                        card.style.display = "flex";
                    } else {
                        card.style.display = "none";
                    }
                } else {
                    card.style.display = (categoria === "todas") ? "flex" : "none";
                }
            });
        }
    });
}

function configurarEventosMontagem() {
    const secaoMontagem = document.getElementById("montar-pizza");
    if (!secaoMontagem) return;

    secaoMontagem.addEventListener("change", function (e) {
        if (e.target.matches('input[name="tamanho"], input[name="ingredientes"], input[name="borda"]')) {
            atualizarResumoMontagem();
        }
    });

    const btnAdicionarMontada = document.getElementById("btn-adicionar-montada");
    if (btnAdicionarMontada) {
        const clone = btnAdicionarMontada.cloneNode(true);
        btnAdicionarMontada.parentNode.replaceChild(clone, btnAdicionarMontada);
        document.getElementById("btn-adicionar-montada").addEventListener("click", function() {
            if (!this.disabled) {
                adicionarPizzaMontadaAoCarrinho();
            }
        });
    }
}

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

    const tamanhoSelecionado = document.querySelector('input[name="tamanho"]:checked');
    btnAdicionarMontada.disabled = !tamanhoSelecionado;
    if (tamanhoSelecionado) {
        btnAdicionarMontada.innerHTML = `<i class="fas fa-cart-plus"></i> Adicionar ao Carrinho`;
    } else {
        btnAdicionarMontada.innerHTML = `<i class="fas fa-cart-plus"></i> Selecione um Tamanho`;
    }
}

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

    adicionarAoCarrinho(`montada-${Date.now()}`, nomePizzaMontada, calculo.precoTotalCalculado, 1, detalhes);
}

function inicializarCarrinho() {
    const carrinhoSalvo = localStorage.getItem("carrinhoPizzaria");
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
    }
    atualizarContadorCarrinho();
    atualizarCarrinhoUI();
    ativarBotoesAdicionar();
}

function ativarBotoesAdicionar() {
    const botoesAdicionar = document.querySelectorAll(".btn-adicionar, .btn-promocao");
    botoesAdicionar.forEach(botao => {
        const clone = botao.cloneNode(true);
        botao.parentNode.replaceChild(clone, botao);
    });
    document.querySelectorAll(".btn-adicionar, .btn-promocao").forEach((botao) => {
        botao.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            const nome = this.getAttribute("data-nome");
            const preco = parseFloat(this.getAttribute("data-preco"));
            adicionarAoCarrinho(id, nome, preco, 1, null);
        });
    });
}

function adicionarAoCarrinho(id, nome, preco, quantidade = 1, detalhes = null) {
    const idFinal = id.startsWith('montada-') ? id : id;
    const itemExistente = carrinho.find((item) => item.id === idFinal);

    if (itemExistente && !id.startsWith('montada-')) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({
            id: idFinal,
            nome: nome,
            preco: preco,
            quantidade: quantidade,
            detalhes: detalhes
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