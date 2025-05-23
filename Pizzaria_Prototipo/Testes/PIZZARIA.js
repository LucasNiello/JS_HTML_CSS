// PIZZARIA.js - Lógica para o Painel Administrativo da Pizzaria

// ==============================================================================
// DADOS EM MEMÓRIA (Simulação - Idealmente viriam de um backend/banco de dados)
// ==============================================================================

const cardapio = [
    { id: 1, nome: "Margherita", ingredientes: "Molho, Mussarela, Manjericão", preco: 45.00 },
    { id: 2, nome: "Calabresa", ingredientes: "Molho, Mussarela, Calabresa, Cebola", preco: 48.50 }
];
let proximoPizzaId = 3;

const ingredientesDisponiveis = [
    { id: 1, nome: "Massa Tradicional", preco: 0.00, tipo: "base" },
    { id: 2, nome: "Massa Integral", preco: 5.00, tipo: "base" },
    { id: 3, nome: "Mussarela", preco: 0.00, tipo: "queijo" },
    { id: 4, nome: "Mussarela de Búfala", preco: 5.00, tipo: "queijo" },
    { id: 5, nome: "Calabresa", preco: 0.00, tipo: "carne" },
    { id: 6, nome: "Tomate", preco: 0.00, tipo: "vegetal" },
    { id: 7, nome: "Manjericão", preco: 0.00, tipo: "vegetal" }
];
let proximoIngredienteId = 8;

const vendas = [];

// ==============================================================================
// FUNÇÕES GERAIS E DE NAVEGAÇÃO
// ==============================================================================

/**
 * Mostra a seção especificada e esconde as outras.
 * @param {string} secaoId - O ID da seção a ser mostrada.
 */
function mostrarSecao(secaoId) {
    const secoes = document.querySelectorAll(".secao");
    secoes.forEach(secao => {
        secao.classList.add("hidden");
        secao.classList.remove("active");
    });

    const secaoAlvo = document.getElementById(secaoId);
    if (secaoAlvo) {
        secaoAlvo.classList.remove("hidden");
        secaoAlvo.classList.add("active");
    } else {
        console.error(`Seção com ID "${secaoId}" não encontrada.`);
    }

    switch (secaoId) {
        case "consulta":
            atualizarListaPizzas();
            break;
        case "gerenciar-ingredientes":
            atualizarListaIngredientes();
            break;
        case "relatorio":
            gerarRelatorioVendas();
            break;
    }
}

/**
 * Define o link de navegação clicado como ativo e remove a classe "active" dos outros.
 * @param {HTMLElement} linkClicado - O elemento "a" que foi clicado.
 */
function setActiveLink(linkClicado) {
    const navLinks = document.querySelectorAll(".admin-menu .nav-link");
    navLinks.forEach(link => link.classList.remove("active"));

    if (linkClicado && !linkClicado.classList.contains("logout-link")) {
        linkClicado.classList.add("active");
    }
}

/**
 * Exibe uma mensagem de alerta simples.
 * @param {string} mensagem - A mensagem a ser exibida.
 * @param {string} [tipo="info"] - O tipo de mensagem ("sucesso", "erro", "info").
 */
function exibirAlerta(mensagem, tipo = "info") {
    alert(`[${tipo.toUpperCase()}] ${mensagem}`);
}

// ==============================================================================
// GERENCIAMENTO DE PIZZAS
// ==============================================================================

/**
 * Adiciona uma nova pizza ao cardápio.
 */
function adicionarPizza() {
    const nomeInput = document.getElementById("cadastro-nome");
    const ingredientesInput = document.getElementById("cadastro-ingredientes");
    const precoInput = document.getElementById("cadastro-preco");

    const nome = nomeInput.value.trim();
    const ingredientes = ingredientesInput.value.trim();
    const preco = parseFloat(precoInput.value);

    if (!nome || !ingredientes || isNaN(preco) || preco <= 0) {
        exibirAlerta("Por favor, preencha todos os campos corretamente.", "erro");
        return;
    }

    const novaPizza = {
        id: proximoPizzaId++,
        nome,
        ingredientes,
        preco
    };

    cardapio.push(novaPizza);

    nomeInput.value = "";
    ingredientesInput.value = "";
    precoInput.value = "";

    exibirAlerta("Pizza cadastrada com sucesso!", "sucesso");
}

/**
 * Atualiza a tabela de pizzas.
 * @param {Array} [listaFiltrada=cardapio] - Lista de pizzas a ser exibida.
 */
function atualizarListaPizzas(listaFiltrada = cardapio) {
    const listaTbody = document.getElementById("lista-pizzas");
    listaTbody.innerHTML = "";

    if (listaFiltrada.length === 0) {
        listaTbody.innerHTML = `<tr><td colspan="4">Nenhuma pizza encontrada.</td></tr>`;
        return;
    }

    listaFiltrada.forEach(pizza => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${pizza.nome}</td>
            <td>${pizza.ingredientes}</td>
            <td>R$ ${pizza.preco.toFixed(2)}</td>
            <td class="acoes">
                <button class="btn-editar" onclick="abrirModalEdicaoPizza(${pizza.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-excluir" onclick="excluirPizza(${pizza.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        `;
        listaTbody.appendChild(linha);
    });
}

/**
 * Filtra as pizzas pelo nome.
 */
function buscarPizza() {
    const buscaInput = document.getElementById("busca-pizza");
    const busca = buscaInput.value.toLowerCase().trim();

    const resultados = cardapio.filter(pizza =>
        pizza.nome.toLowerCase().includes(busca)
    );

    atualizarListaPizzas(resultados);
}

/**
 * Abre o modal para editar uma pizza.
 * @param {number} pizzaId - ID da pizza.
 */
function abrirModalEdicaoPizza(pizzaId) {
    const pizza = cardapio.find(p => p.id === pizzaId);
    if (!pizza) {
        exibirAlerta("Pizza não encontrada para edição.", "erro");
        return;
    }

    document.getElementById("editar-pizza-id").value = pizza.id;
    document.getElementById("editar-pizza-nome").value = pizza.nome;
    document.getElementById("editar-pizza-ingredientes").value = pizza.ingredientes;
    document.getElementById("editar-pizza-preco").value = pizza.preco.toFixed(2);

    document.getElementById("modal-editar-pizza").classList.add("active");
}

/**
 * Fecha o modal de edição de pizza.
 */
function fecharModalEdicaoPizza() {
    document.getElementById("modal-editar-pizza").classList.remove("active");
}

/**
 * Salva as alterações da pizza.
 */
function salvarEdicaoPizza() {
    const id = parseInt(document.getElementById("editar-pizza-id").value);
    const nome = document.getElementById("editar-pizza-nome").value.trim();
    const ingredientes = document.getElementById("editar-pizza-ingredientes").value.trim();
    const preco = parseFloat(document.getElementById("editar-pizza-preco").value);

    if (!nome || !ingredientes || isNaN(preco) || preco <= 0) {
        exibirAlerta("Por favor, preencha todos os campos corretamente no formulário de edição.", "erro");
        return;
    }

    const index = cardapio.findIndex(p => p.id === id);
    if (index === -1) {
        exibirAlerta("Erro ao encontrar a pizza para salvar alterações.", "erro");
        fecharModalEdicaoPizza();
        return;
    }

    cardapio[index] = { ...cardapio[index], nome, ingredientes, preco };

    exibirAlerta("Pizza alterada com sucesso!", "sucesso");
    fecharModalEdicaoPizza();
    atualizarListaPizzas();
}

/**
 * Exclui uma pizza.
 * @param {number} pizzaId - ID da pizza.
 */
function excluirPizza(pizzaId) {
    const index = cardapio.findIndex(p => p.id === pizzaId);
    if (index === -1) {
        exibirAlerta("Pizza não encontrada para exclusão.", "erro");
        return;
    }

    if (confirm(`Tem certeza que deseja excluir a pizza "${cardapio[index].nome}"?`)) {
        cardapio.splice(index, 1);
        exibirAlerta("Pizza excluída com sucesso!", "sucesso");
        atualizarListaPizzas();
    }
}
