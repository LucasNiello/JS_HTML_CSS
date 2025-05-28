// Lista de pizzas disponíveis no sistema
let cardapio = [];

// Variável para armazenar a pizza que será alterada
let pizzaParaAlterar = null;

// Função para carregar o cardápio do localStorage quando a página iniciar
function carregarCardapio() {
    const cardapioSalvo = localStorage.getItem('cardapioPizzaria');
    if (cardapioSalvo) {
        cardapio = JSON.parse(cardapioSalvo);
        atualizarLista(); // Atualiza a lista na interface
    }
}

// Carregar cardápio quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarCardapio);

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
        
        // Salvar no localStorage para compartilhar com a página do cliente
        localStorage.setItem('cardapioPizzaria', JSON.stringify(cardapio));
        
        document.getElementById("titulo").value = "";
        document.getElementById("ingredientes").value = "";
        document.getElementById("preco").value = "";
        atualizarLista();
        alert("Pizza cadastrada com sucesso! A pizza agora está disponível para os clientes.");
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
        document.getElementById("novo-nome").value = pizzaParaAlterar.nome;
        document.getElementById("novo-ingredientes").value = pizzaParaAlterar.ingredientes;
        document.getElementById("novo-preco").value = pizzaParaAlterar.preco;
    } else {
        alert("Pizza não encontrada. Verifique o nome e tente novamente.");
    }
}

// Aplica as alterações feitas à pizza selecionada
function alterarPizza() {
    if (pizzaParaAlterar) {
        const novoNome = document.getElementById("novo-nome").value;
        const novoIngredientes = document.getElementById("novo-ingredientes").value;
        const novoPreco = parseFloat(document.getElementById("novo-preco").value);

        if (novoNome && novoIngredientes && novoPreco) {
            pizzaParaAlterar.nome = novoNome;
            pizzaParaAlterar.ingredientes = novoIngredientes;
            pizzaParaAlterar.preco = novoPreco;

            // Atualizar no localStorage após alteração
            localStorage.setItem('cardapioPizzaria', JSON.stringify(cardapio));
            
            atualizarLista();
            alert("Pizza alterada com sucesso! As alterações estão disponíveis para os clientes.");
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
        // Criar objeto de venda
        const venda = {
            pizza: nomePizza,
            preco: precoPizza,
            comprador: comprador,
            data: new Date().toLocaleString()
        };
        
        // Obter vendas existentes ou iniciar array vazio
        let vendas = JSON.parse(localStorage.getItem('vendasPizzaria') || '[]');
        
        // Adicionar nova venda
        vendas.push(venda);
        
        // Salvar no localStorage
        localStorage.setItem('vendasPizzaria', JSON.stringify(vendas));
        
        const listaVendas = document.getElementById("lista-vendas");
        const item = document.createElement("li");
        item.textContent = `Pizza: ${nomePizza}, Preço: R$${precoPizza.toFixed(2)}, Comprador: ${comprador}`;
        listaVendas.appendChild(item);

        document.getElementById("venda-titulo").value = '';
        document.getElementById("venda-preco").value = '';
        document.getElementById("venda-comprador").value = '';
        
        alert("Venda registrada com sucesso!");
    } else {
        alert("Preencha todos os campos!");
    }
}

// Função para gerar relatório de vendas
function gerarRelatorioVendas() {
    // Mostrar a seção de relatório
    mostrarSecao('relatorio');
    
    // Obter vendas do localStorage
    const vendas = JSON.parse(localStorage.getItem('vendasPizzaria') || '[]');
    
    // Atualizar tabela de relatório
    const tabelaRelatorio = document.getElementById("tabela-relatorio-vendas");
    tabelaRelatorio.innerHTML = "";
    
    if (vendas.length === 0) {
        tabelaRelatorio.innerHTML = "<tr><td colspan='3'>Nenhuma venda registrada</td></tr>";
        return;
    }
    
    vendas.forEach(venda => {
        let linha = `<tr>
                        <td>${venda.pizza}</td>
                        <td>R$${venda.preco.toFixed(2)}</td>
                        <td>${venda.comprador}</td>
                    </tr>`;
        tabelaRelatorio.innerHTML += linha;
    });
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
    const match = texto.match(/R\$\s?([\d,]+(?:\.\d+)?)/);
    return match ? parseFloat(match[1].replace(',', '.')) : 0;
}

// Adiciona visualmente o item na lista do relatório
function adicionarAoRelatorio(texto) {
    const lista = document.getElementById('lista-itens');
    const item = document.createElement('li');
    item.textContent = texto;
    lista.appendChild(item);
}
