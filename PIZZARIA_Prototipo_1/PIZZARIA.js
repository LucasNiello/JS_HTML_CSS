// Lista de pizzas disponíveis no sistema
let cardapio = [];

// Variável para armazenar a pizza que será alterada
let pizzaParaAlterar = null;

// Função para mostrar apenas a seção clicada e esconder as outras
function mostrarSecao(secao) {
    const secoes = ["cadastro", "consulta", "alterar", "monte-sua-pizza", "venda", "relatorio"];
    secoes.forEach(id => document.getElementById(id).classList.add("hidden"));
    document.getElementById(secao).classList.remove("hidden");
}

// Função para adicionar uma nova pizza ao cardápio
function adicionarPizza() {
    const nome = document.getElementById("titulo").value;
    const ingredientes = document.getElementById("ingredientes").value;
    const preco = parseFloat(document.getElementById("preco").value);

    if (nome && ingredientes && preco) {
        cardapio.push({ nome, ingredientes, preco });
        document.getElementById("titulo").value = "";
        document.getElementById("ingredientes").value = "";
        document.getElementById("preco").value = "";
        atualizarLista();
        alert("Pizza cadastrada com sucesso!");
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

// Atualiza a lista de pizzas exibida na seção de consulta
function atualizarLista(listaFiltrada = cardapio) {
    let lista = document.getElementById("lista-pizzas");
    lista.innerHTML = "";

    listaFiltrada.forEach(pizza => {
        let linha = `<tr>
                        <td>${pizza.nome}</td>
                        <td>${pizza.ingredientes}</td>
                        <td>R$${pizza.preco.toFixed(2)}</td>
                    </tr>`;
        lista.innerHTML += linha;
    });
}

// Filtra pizzas pelo nome na seção de consulta
function buscarPizza() {
    const busca = document.getElementById("busca").value.toLowerCase();
    const resultados = cardapio.filter((pizza) => 
        pizza.nome.toLowerCase().includes(busca)
    );
    atualizarLista(resultados);
}

// Localiza uma pizza para ser alterada e exibe o formulário
function buscarPizzaParaAlterar() {
    const busca = document.getElementById("busca-alterar").value.toLowerCase();
    pizzaParaAlterar = cardapio.find((pizza) =>
        pizza.nome.toLowerCase().includes(busca)
    );

    if (pizzaParaAlterar) {
        document.getElementById("form-alterar").classList.remove("hidden");
        document.getElementById("novo-titulo").value = pizzaParaAlterar.nome;
        document.getElementById("novo-ingredientes").value = pizzaParaAlterar.ingredientes;
        document.getElementById("novo-preco").value = pizzaParaAlterar.preco;
    }
}

// Aplica as alterações feitas à pizza selecionada
function alterarPizza() {
    if (pizzaParaAlterar) {
        const novoNome = document.getElementById("novo-titulo").value;
        const novoIngredientes = document.getElementById("novo-ingredientes").value;
        const novoPreco = parseFloat(document.getElementById("novo-preco").value);

        if (novoNome && novoIngredientes && novoPreco) {
            pizzaParaAlterar.nome = novoNome;
            pizzaParaAlterar.ingredientes = novoIngredientes;
            pizzaParaAlterar.preco = novoPreco;

            atualizarLista();
            alert("Pizza alterada com sucesso!");
            document.getElementById("form-alterar").classList.add("hidden");
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    }
}

// Função para registrar uma venda e exibir na lista
function registrarVenda() {
    const nomePizza = document.getElementById("venda-titulo").value;
    const precoPizza = parseFloat(document.getElementById("venda-preco").value);
    const comprador = document.getElementById("venda-comprador").value;

    if (nomePizza && precoPizza && comprador) {
        const listaVendas = document.getElementById("lista-vendas");
        const item = document.createElement("li");
        item.textContent = `Pizza: ${nomePizza}, Preço: R$${precoPizza.toFixed(2)}, Comprador: ${comprador}`;
        listaVendas.appendChild(item);

        document.getElementById("venda-titulo").value = '';
        document.getElementById("venda-preco").value = '';
        document.getElementById("venda-comprador").value = '';
    } else {
        alert("Preencha todos os campos!");
    }
}

// Seção: MONTE SUA PIZZA
let precoTotal = 0;

// Adiciona os itens selecionados ao relatório e soma os preços
function adicionarItem() {
    const itens = document.getElementById('seletor-itens');
    const selecionados = Array.from(itens.selectedOptions);
    const listaRelatorio = document.getElementById('lista-itens');

    selecionados.forEach(opt => {
        const texto = opt.textContent;
        const preco = extrairPreco(texto);
        precoTotal += preco;
        adicionarAoRelatorio(texto);
    });

    document.getElementById('precoTotal').value = precoTotal.toFixed(2);
}

// Extrai o valor numérico do texto do item
function extrairPreco(texto) {
    const match = texto.match(/R\$ ?([\d,]+(?:\.\d+)?)/);
    return match ? parseFloat(match[1].replace(',', '.')) : 0;
}

// Adiciona visualmente o item na lista do relatório
function adicionarAoRelatorio(texto) {
    const lista = document.getElementById('lista-itens');
    const item = document.createElement('li');
    item.textContent = texto;
    lista.appendChild(item);
}