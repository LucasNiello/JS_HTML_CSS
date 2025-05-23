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
 * Mostra a seção especificada, esconde as outras e ativa o link de navegação correspondente.
 * @param {string} secaoId - O ID da seção a ser mostrada.
 */
function mostrarSecao(secaoId) {
    // Esconde todas as seções e remove a classe 'active'
    const secoes = document.querySelectorAll(".secao");
    secoes.forEach(secao => {
        secao.classList.add("hidden");
        secao.classList.remove("active");
    });

    // Mostra a seção desejada e adiciona a classe 'active'
    const secaoAlvo = document.getElementById(secaoId);
    if (secaoAlvo) {
        secaoAlvo.classList.remove("hidden");
        secaoAlvo.classList.add("active");
    } else {
        console.error(`Seção com ID "${secaoId}" não encontrada.`);
        // Se a seção não for encontrada, não ativa nenhum link
        // Remove active de todos os links para evitar estado inconsistente
        const navLinksError = document.querySelectorAll(".admin-menu .nav-link");
        navLinksError.forEach(link => link.classList.remove("active"));
        return; // Sai da função se a seção não existe
    }

    // Ativa o link de navegação correspondente
    const navLinks = document.querySelectorAll(".admin-menu .nav-link");
    navLinks.forEach(link => {
        link.classList.remove("active");
        // Verifica se o onclick do link contém a chamada para mostrar a seção atual
        // Atenção: Usar includes pode ser frágil se os IDs forem substrings uns dos outros.
        // Uma abordagem mais robusta seria usar atributos data-* no HTML.
        const onclickAttr = link.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`mostrarSecao('${secaoId}')`)) {
            link.classList.add("active");
        }
    });

    // Atualiza as listas/tabelas correspondentes se a seção for aberta
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
        // Adicionar outros casos se necessário
    }
}

// A função setActiveLink não é mais necessária, pois a lógica foi incorporada em mostrarSecao
/*
function setActiveLink(linkClicado) {
    const navLinks = document.querySelectorAll(".admin-menu .nav-link");
    navLinks.forEach(link => link.classList.remove("active"));

    if (linkClicado && !linkClicado.classList.contains("logout-link")) {
        linkClicado.classList.add("active");
    }
}
*/

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

    if (confirm(`Tem certeza que deseja excluir a pizza \"${cardapio[index].nome}\"?`)) {
        cardapio.splice(index, 1);
        exibirAlerta("Pizza excluída com sucesso!", "sucesso");
        atualizarListaPizzas();
    }
}

// ==============================================================================
// GERENCIAMENTO DE INGREDIENTES
// ==============================================================================

/**
 * Adiciona um novo ingrediente à lista.
 */
function adicionarIngrediente() {
    const nomeInput = document.getElementById("ingrediente-nome");
    const precoInput = document.getElementById("ingrediente-preco");
    const tipoSelect = document.getElementById("ingrediente-tipo");

    const nome = nomeInput.value.trim();
    const preco = parseFloat(precoInput.value);
    const tipo = tipoSelect.value;

    if (!nome || isNaN(preco) || preco < 0 || !tipo) {
        exibirAlerta("Por favor, preencha todos os campos do ingrediente corretamente.", "erro");
        return;
    }

    const novoIngrediente = {
        id: proximoIngredienteId++,
        nome,
        preco,
        tipo
    };

    ingredientesDisponiveis.push(novoIngrediente);

    nomeInput.value = "";
    precoInput.value = "";
    tipoSelect.selectedIndex = 0;

    exibirAlerta("Ingrediente adicionado com sucesso!", "sucesso");
    atualizarListaIngredientes();
}

/**
 * Atualiza a tabela de ingredientes.
 */
function atualizarListaIngredientes() {
    const listaTbody = document.getElementById("lista-ingredientes");
    listaTbody.innerHTML = "";

    if (ingredientesDisponiveis.length === 0) {
        listaTbody.innerHTML = `<tr><td colspan="4">Nenhum ingrediente cadastrado.</td></tr>`;
        return;
    }

    ingredientesDisponiveis.forEach(ingrediente => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${ingrediente.nome}</td>
            <td>R$ ${ingrediente.preco.toFixed(2)}</td>
            <td>${ingrediente.tipo.charAt(0).toUpperCase() + ingrediente.tipo.slice(1)}</td>
            <td class="acoes">
                <button class="btn-editar" onclick="abrirModalEdicaoIngrediente(${ingrediente.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-excluir" onclick="excluirIngrediente(${ingrediente.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        `;
        listaTbody.appendChild(linha);
    });
}

/**
 * Abre o modal para editar um ingrediente.
 * @param {number} ingredienteId - ID do ingrediente.
 */
function abrirModalEdicaoIngrediente(ingredienteId) {
    const ingrediente = ingredientesDisponiveis.find(i => i.id === ingredienteId);
    if (!ingrediente) {
        exibirAlerta("Ingrediente não encontrado para edição.", "erro");
        return;
    }

    document.getElementById("editar-ingrediente-id").value = ingrediente.id;
    document.getElementById("editar-ingrediente-nome").value = ingrediente.nome;
    document.getElementById("editar-ingrediente-preco").value = ingrediente.preco.toFixed(2);
    document.getElementById("editar-ingrediente-tipo").value = ingrediente.tipo;

    document.getElementById("modal-editar-ingrediente").classList.add("active");
}

/**
 * Fecha o modal de edição de ingrediente.
 */
function fecharModalEdicaoIngrediente() {
    document.getElementById("modal-editar-ingrediente").classList.remove("active");
}

/**
 * Salva as alterações do ingrediente.
 */
function salvarEdicaoIngrediente() {
    const id = parseInt(document.getElementById("editar-ingrediente-id").value);
    const nome = document.getElementById("editar-ingrediente-nome").value.trim();
    const preco = parseFloat(document.getElementById("editar-ingrediente-preco").value);
    const tipo = document.getElementById("editar-ingrediente-tipo").value;

    if (!nome || isNaN(preco) || preco < 0 || !tipo) {
        exibirAlerta("Por favor, preencha todos os campos corretamente no formulário de edição.", "erro");
        return;
    }

    const index = ingredientesDisponiveis.findIndex(i => i.id === id);
    if (index === -1) {
        exibirAlerta("Erro ao encontrar o ingrediente para salvar alterações.", "erro");
        fecharModalEdicaoIngrediente();
        return;
    }

    ingredientesDisponiveis[index] = { ...ingredientesDisponiveis[index], nome, preco, tipo };

    exibirAlerta("Ingrediente alterado com sucesso!", "sucesso");
    fecharModalEdicaoIngrediente();
    atualizarListaIngredientes();
}

/**
 * Exclui um ingrediente.
 * @param {number} ingredienteId - ID do ingrediente.
 */
function excluirIngrediente(ingredienteId) {
    const index = ingredientesDisponiveis.findIndex(i => i.id === ingredienteId);
    if (index === -1) {
        exibirAlerta("Ingrediente não encontrado para exclusão.", "erro");
        return;
    }

    if (confirm(`Tem certeza que deseja excluir o ingrediente \"${ingredientesDisponiveis[index].nome}\"?`)) {
        ingredientesDisponiveis.splice(index, 1);
        exibirAlerta("Ingrediente excluído com sucesso!", "sucesso");
        atualizarListaIngredientes();
    }
}

// ==============================================================================
// GERENCIAMENTO DE VENDAS E RELATÓRIOS
// ==============================================================================

/**
 * Registra uma nova venda.
 */
function registrarVenda() {
    const nomePizzaInput = document.getElementById("venda-titulo");
    const precoPizzaInput = document.getElementById("venda-preco");
    const compradorInput = document.getElementById("venda-comprador");

    const nomePizza = nomePizzaInput.value.trim();
    const precoPizza = parseFloat(precoPizzaInput.value);
    const comprador = compradorInput.value.trim() || "Não informado";

    if (!nomePizza || isNaN(precoPizza) || precoPizza <= 0) {
        exibirAlerta("Preencha o nome da pizza e o preço corretamente!", "erro");
        return;
    }

    vendas.push({ nome: nomePizza, preco: precoPizza, comprador });

    const listaVendasUl = document.getElementById("lista-vendas");
    const item = document.createElement("li");
    item.textContent = `Pizza: ${nomePizza}, Preço: R$ ${precoPizza.toFixed(2)}, Comprador: ${comprador}`;
    if (listaVendasUl.firstChild) {
        listaVendasUl.insertBefore(item, listaVendasUl.firstChild);
    } else {
        listaVendasUl.appendChild(item);
    }

    nomePizzaInput.value = "";
    precoPizzaInput.value = "";
    compradorInput.value = "";

    exibirAlerta("Venda registrada com sucesso!", "sucesso");
}

/**
 * Gera e exibe o relatório de vendas.
 */
function gerarRelatorioVendas() {
    const tabelaRelatorioTbody = document.getElementById("tabela-relatorio-vendas");
    const totalVendasDiv = document.getElementById("total-vendas");
    tabelaRelatorioTbody.innerHTML = "";
    let total = 0;

    if (vendas.length === 0) {
        tabelaRelatorioTbody.innerHTML = `<tr><td colspan="3">Nenhuma venda registrada nesta sessão.</td></tr>`;
        totalVendasDiv.innerHTML = "";
        return;
    }

    [...vendas].reverse().forEach(venda => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${venda.nome}</td>
            <td>R$ ${venda.preco.toFixed(2)}</td>
            <td>${venda.comprador}</td>
        `;
        tabelaRelatorioTbody.appendChild(linha);
        total += venda.preco;
    });

    totalVendasDiv.innerHTML = `<strong>Total de Vendas (Sessão): R$ ${total.toFixed(2)}</strong>`;
}

// ==============================================================================
// INICIALIZAÇÃO
// ==============================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Define a seção inicial a ser exibida (ex: cadastro)
    // A função mostrarSecao agora também cuida de ativar o link correto
    mostrarSecao("cadastro");

    // Adiciona listeners para fechar modais clicando fora deles
    const modais = document.querySelectorAll(".modal");
    modais.forEach(modal => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.classList.remove("active");
            }
        });
    });
});

