let cardapio = [];

let pizzaParaAlterar = null;

let opcoesMontagem = {
    tamanhos: [],
    ingredientes: [],
    bordas: []
};

// Pizzas pré-existentes para inicializar no localStorage
const pizzasPreExistentes = [
    {
        nome: "Margherita",
        ingredientes: "Molho de tomate italiano, mussarela de búfala, manjericão fresco e azeite extra virgem",
        preco: 49.90,
        categoria: "Tradicional"
    },
    {
        nome: "Calabresa Especial",
        ingredientes: "Molho de tomate italiano, mussarela, calabresa artesanal defumada, cebola roxa e orégano",
        preco: 52.90,
        categoria: "Tradicional"
    },
    {
        nome: "Quatro Queijos Gourmet",
        ingredientes: "Molho de tomate italiano, mussarela de búfala, gorgonzola DOP, parmesão envelhecido e provolone",
        preco: 59.90,
        categoria: "Gourmet"
    },
    {
        nome: "Parma com Burrata",
        ingredientes: "Molho de tomate italiano, presunto de parma 24 meses, burrata fresca, rúcula selvagem e lascas de parmesão",
        preco: 72.90,
        categoria: "Premium"
    },
    {
        nome: "Filé Mignon Trufado",
        ingredientes: "Molho de tomate italiano, mussarela, medalhões de filé mignon, cogumelos paris, cebola caramelizada e azeite trufado",
        preco: 79.90,
        categoria: "Premium"
    },
    {
        nome: "Salmão com Cream Cheese",
        ingredientes: "Base de cream cheese, salmão defumado, alcaparras, cebola roxa, dill fresco e raspas de limão siciliano",
        preco: 76.90,
        categoria: "Premium"
    },
    {
        nome: "Funghi Especial",
        ingredientes: "Molho de tomate italiano, mix de cogumelos (paris, shimeji e shitake), mussarela de búfala e azeite de ervas",
        preco: 65.90,
        categoria: "Gourmet"
    },
    {
        nome: "Caprese Gourmet",
        ingredientes: "Molho de tomate italiano, mussarela de búfala, tomates cereja confitados, pesto de manjericão fresco e azeite extra virgem",
        preco: 62.90,
        categoria: "Gourmet"
    }
];

// Função para carregar o cardápio do localStorage ou inicializar com pizzas pré-existentes
function carregarCardapio() {
    const cardapioSalvo = localStorage.getItem('cardapioPizzaria');
    if (cardapioSalvo) {
        cardapio = JSON.parse(cardapioSalvo);
    } else {
        cardapio = pizzasPreExistentes;
        localStorage.setItem('cardapioPizzaria', JSON.stringify(cardapio));
    }
    atualizarLista();
}

// Função para mostrar apenas a seção clicada e esconder as outras
function mostrarSecao(secao) {
    const secoes = ["cadastro", "consulta", "alterar", "monte-sua-pizza", "venda", "relatorio"];
    secoes.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.classList.add("hidden");
    });
    const secaoAtiva = document.getElementById(secao);
    if (secaoAtiva) {
        secaoAtiva.classList.remove("hidden");
        if (secao === 'monte-sua-pizza') {
            carregarOpcoesMontagem();
            atualizarTabelasOpcoesMontagem();
        }
    }
}

// Função para adicionar uma nova pizza ao cardápio
function adicionarPizza() {
    const nome = document.getElementById("titulo").value;
    const ingredientes = document.getElementById("ingredientes").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const categoria = document.getElementById("categoria").value;

    if (nome && ingredientes && !isNaN(preco) && categoria) {
        cardapio.push({ nome, ingredientes, preco, categoria });
        localStorage.setItem('cardapioPizzaria', JSON.stringify(cardapio));
        document.getElementById("titulo").value = "";
        document.getElementById("ingredientes").value = "";
        document.getElementById("preco").value = "";
        document.getElementById("categoria").value = "Principal";
        atualizarLista();
        alert("Pizza cadastrada com sucesso!");
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}

// Atualiza a lista de pizzas exibida na seção de consulta
function atualizarLista(listaFiltrada = cardapio) {
    let lista = document.getElementById("lista-pizzas");
    if (!lista) return;
    lista.innerHTML = "";

    listaFiltrada.forEach((pizza, index) => {
        const originalIndex = cardapio.findIndex(p => p.nome === pizza.nome && p.preco === pizza.preco);
        let linha = `<tr>
                        <td>${pizza.nome}</td>
                        <td>${pizza.ingredientes}</td>
                        <td>R$${pizza.preco.toFixed(2)}</td>
                        <td>${pizza.categoria}</td>
                        <td>
                            <button class="btn-excluir" onclick="excluirPizza(${originalIndex})">
                                <i class="fas fa-trash-alt"></i> Excluir
                            </button>
                            <button class="btn-editar" onclick="prepararEdicao(${originalIndex})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                        </td>
                    </tr>`;
        lista.innerHTML += linha;
    });
}

// Função para excluir uma pizza do cardápio
function excluirPizza(index) {
    if (index < 0 || index >= cardapio.length) {
        alert("Erro ao encontrar pizza para excluir.");
        return;
    }
    if (confirm(`Tem certeza que deseja excluir a pizza '${cardapio[index].nome}'?`)) {
        cardapio.splice(index, 1);
        localStorage.setItem('cardapioPizzaria', JSON.stringify(cardapio));
        atualizarLista();
        alert("Pizza excluída com sucesso!");
    }
}

// Função para preparar a edição de uma pizza
function prepararEdicao(index) {
    if (index < 0 || index >= cardapio.length) {
        alert("Erro ao encontrar pizza para editar.");
        return;
    }
    pizzaParaAlterar = { ...cardapio[index], originalIndex: index };
    document.getElementById("form-alterar").classList.remove("hidden");
    document.getElementById("novo-nome").value = pizzaParaAlterar.nome;
    document.getElementById("novo-ingredientes").value = pizzaParaAlterar.ingredientes;
    document.getElementById("novo-preco").value = pizzaParaAlterar.preco;
    document.getElementById("novo-categoria").value = pizzaParaAlterar.categoria;
    mostrarSecao("alterar");
}

// Função para aplicar alterações à pizza selecionada
function alterarPizza() {
    if (pizzaParaAlterar && pizzaParaAlterar.originalIndex !== undefined) {
        const novoNome = document.getElementById("novo-nome").value;
        const novoIngredientes = document.getElementById("novo-ingredientes").value;
        const novoPreco = parseFloat(document.getElementById("novo-preco").value);
        const novaCategoria = document.getElementById("novo-categoria").value;

        if (novoNome && novoIngredientes && !isNaN(novoPreco) && novaCategoria) {
            cardapio[pizzaParaAlterar.originalIndex] = {
                nome: novoNome,
                ingredientes: novoIngredientes,
                preco: novoPreco,
                categoria: novaCategoria
            };
            localStorage.setItem('cardapioPizzaria', JSON.stringify(cardapio));
            atualizarLista();
            alert("Pizza alterada com sucesso!");
            document.getElementById("form-alterar").classList.add("hidden");
            pizzaParaAlterar = null;
            document.getElementById("busca-alterar").value = '';
        } else {
            alert("Por favor, preencha todos os campos corretamente.");
        }
    }
}

// Função para filtrar pizzas por nome ou categoria
function buscarPizza() {
    const busca = document.getElementById("busca").value.toLowerCase();
    const categoriaFiltro = document.getElementById("filtro-categoria").value;
    const resultados = cardapio.filter(pizza =>
        pizza.nome.toLowerCase().includes(busca) &&
        (categoriaFiltro === "todas" || pizza.categoria === categoriaFiltro)
    );
    atualizarLista(resultados);
}

// Função para carregar opções de montagem
function carregarOpcoesMontagem() {
    const opcoesSalvas = localStorage.getItem('opcoesMontagemPizzaria');
    if (opcoesSalvas) {
        opcoesMontagem = JSON.parse(opcoesSalvas);
    } else {
        opcoesMontagem = {
            tamanhos: [
                { nome: "Média - Massa Tradicional", preco: 40.00 },
                { nome: "Grande - Massa Tradicional", preco: 50.00 },
                { nome: "Média - Massa Grossa", preco: 45.00 },
                { nome: "Grande - Massa Grossa", preco: 55.00 }
            ],
            ingredientes: [
                { nome: "Calabresa Fatiada", preco: 6.00 },
                { nome: "Presunto Cozido", preco: 6.00 },
                { nome: "Frango Desfiado", preco: 6.00 },
                { nome: "Bacon Crocante", preco: 6.00 },
                { nome: "Cebola", preco: 6.00 },
                { nome: "Tomate Fresco", preco: 6.00 },
                { nome: "Milho Verde", preco: 6.00 },
                { nome: "Ervilha", preco: 6.00 },
                { nome: "Azeitonas Pretas", preco: 6.00 },
                { nome: "Champignon", preco: 6.00 },
                { nome: "Queijo Gorgonzola", preco: 10.00 },
                { nome: "Queijo Parmesão", preco: 8.00 },
                { nome: "Catupiry Original", preco: 8.00 }
            ],
            bordas: [
                { nome: "Sem Borda Recheada", preco: 0.00 },
                { nome: "Catupiry Original", preco: 10.00 },
                { nome: "Cheddar", preco: 10.00 },
                { nome: "Mussarela", preco: 8.00 }
            ]
        };
        salvarOpcoesMontagem();
    }
}

// Função para salvar opções de montagem
function salvarOpcoesMontagem() {
    localStorage.setItem('opcoesMontagemPizzaria', JSON.stringify(opcoesMontagem));
}

// Função para atualizar as tabelas de gerenciamento de opções
function atualizarTabelasOpcoesMontagem() {
    const tabelas = {
        tamanhos: document.getElementById("lista-tamanhos"),
        ingredientes: document.getElementById("lista-ingredientes-admin"),
        bordas: document.getElementById("lista-bordas-admin")
    };

    for (const tipo in tabelas) {
        if (tabelas[tipo]) {
            tabelas[tipo].innerHTML = "";
        }
    }

    if (tabelas.tamanhos) {
        opcoesMontagem.tamanhos.forEach((item, index) => {
            const linha = `<tr>
                            <td>${item.nome}</td>
                            <td>R$${item.preco.toFixed(2)}</td>
                            <td><button class="btn-excluir" onclick="excluirOpcaoMontagem('tamanhos', ${index})"><i class="fas fa-trash-alt"></i></button></td>
                         </tr>`;
            tabelas.tamanhos.innerHTML += linha;
        });
    }

    if (tabelas.ingredientes) {
        opcoesMontagem.ingredientes.forEach((item, index) => {
            const linha = `<tr>
                            <td>${item.nome}</td>
                            <td>R$${item.preco.toFixed(2)}</td>
                            <td><button class="btn-excluir" onclick="excluirOpcaoMontagem('ingredientes', ${index})"><i class="fas fa-trash-alt"></i></button></td>
                         </tr>`;
            tabelas.ingredientes.innerHTML += linha;
        });
    }

    if (tabelas.bordas) {
        opcoesMontagem.bordas.forEach((item, index) => {
            if (item.nome !== "Sem Borda Recheada") {
                const linha = `<tr>
                                <td>${item.nome}</td>
                                <td>R$${item.preco.toFixed(2)}</td>
                                <td><button class="btn-excluir" onclick="excluirOpcaoMontagem('bordas', ${index})"><i class="fas fa-trash-alt"></i></button></td>
                              </tr>`;
                tabelas.bordas.innerHTML += linha;
            }
        });
    }
}

// Função para adicionar uma opção de montagem
function adicionarOpcaoMontagem(tipo) {
    let nomeInput, precoInput, nome, preco;

    if (tipo === 'tamanhos') {
        nomeInput = document.getElementById('tamanho-nome');
        precoInput = document.getElementById('tamanho-preco');
    } else if (tipo === 'ingredientes') {
        nomeInput = document.getElementById('ingrediente-nome');
        precoInput = document.getElementById('ingrediente-preco');
    } else if (tipo === 'bordas') {
        nomeInput = document.getElementById('borda-nome');
        precoInput = document.getElementById('borda-preco');
    } else {
        return;
    }

    nome = nomeInput.value.trim();
    preco = parseFloat(precoInput.value);

    if (nome && !isNaN(preco)) {
        const existe = opcoesMontagem[tipo].some(item => item.nome.toLowerCase() === nome.toLowerCase());
        if (existe) {
            alert(`Erro: A opção '${nome}' já existe.`);
            return;
        }

        opcoesMontagem[tipo].push({ nome, preco });
        salvarOpcoesMontagem();
        atualizarTabelasOpcoesMontagem();
        nomeInput.value = '';
        precoInput.value = '';
        alert(`Opção '${nome}' adicionada com sucesso!`);
    } else {
        alert("Por favor, preencha o nome e um preço válido.");
    }
}

// Função para excluir uma opção de montagem
function excluirOpcaoMontagem(tipo, index) {
    if (!opcoesMontagem[tipo] || index < 0 || index >= opcoesMontagem[tipo].length) {
        alert("Erro ao encontrar opção para excluir.");
        return;
    }

    if (tipo === 'bordas' && opcoesMontagem[tipo][index].nome === "Sem Borda Recheada") {
        alert("A opção 'Sem Borda Recheada' não pode ser excluída.");
        return;
    }

    const nomeOpcao = opcoesMontagem[tipo][index].nome;
    if (confirm(`Tem certeza que deseja excluir a opção '${nomeOpcao}'?`)) {
        opcoesMontagem[tipo].splice(index, 1);
        salvarOpcoesMontagem();
        atualizarTabelasOpcoesMontagem();
        alert(`Opção '${nomeOpcao}' excluída com sucesso!`);
    }
}

// Função para registrar uma venda
function registrarVenda() {
    const nomePizza = document.getElementById("venda-titulo").value;
    const precoPizza = parseFloat(document.getElementById("venda-preco").value);
    const comprador = document.getElementById("venda-comprador").value;

    if (nomePizza && !isNaN(precoPizza) && comprador) {
        const venda = {
            pizza: nomePizza,
            preco: precoPizza,
            comprador: comprador,
            data: new Date().toLocaleString()
        };
        let vendas = JSON.parse(localStorage.getItem('vendasPizzaria') || '[]');
        vendas.push(venda);
        localStorage.setItem('vendasPizzaria', JSON.stringify(vendas));

        const listaVendas = document.getElementById("lista-vendas");
        if (listaVendas) {
            const item = document.createElement("li");
            item.textContent = `Pizza: ${nomePizza}, Preço: R$${precoPizza.toFixed(2)}, Comprador: ${comprador}`;
            listaVendas.appendChild(item);
        }

        document.getElementById("venda-titulo").value = '';
        document.getElementById("venda-preco").value = '';
        document.getElementById("venda-comprador").value = '';
        alert("Venda registrada com sucesso!");
    } else {
        alert("Preencha todos os campos corretamente!");
    }
}

// Função para gerar relatório de vendas
function gerarRelatorioVendas() {
    mostrarSecao('relatorio');
    const vendas = JSON.parse(localStorage.getItem('vendasPizzaria') || '[]');
    const tabelaRelatorio = document.getElementById("tabela-relatorio-vendas");
    if (!tabelaRelatorio) return;
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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarCardapio();
    carregarOpcoesMontagem();
    configurarEventosAdmin();
});

// Configura event listeners para botões de adição
function configurarEventosAdmin() {
    const botoesAdicionar = [
        { id: 'adicionar-pizza', handler: adicionarPizza },
        { id: 'adicionar-tamanho', handler: () => adicionarOpcaoMontagem('tamanhos') },
        { id: 'adicionar-ingrediente', handler: () => adicionarOpcaoMontagem('ingredientes') },
        { id: 'adicionar-borda', handler: () => adicionarOpcaoMontagem('bordas') },
        { id: 'salvar-alteracao', handler: alterarPizza },
        { id: 'buscar-alterar-btn', handler: buscarPizzaParaAlterar },
        { id: 'registrar-venda', handler: registrarVenda },
        { id: 'gerar-relatorio', handler: gerarRelatorioVendas }
    ];

    botoesAdicionar.forEach(({ id, handler }) => {
        const botao = document.getElementById(id);
        if (botao) {
            const clone = botao.cloneNode(true);
            botao.parentNode.replaceChild(clone, botao);
            clone.addEventListener('click', handler);
        }
    });

    // Listener para busca de pizzas
    const buscaInput = document.getElementById("busca");
    if (buscaInput) {
        buscaInput.addEventListener("input", buscarPizza);
    }

    // Listener para filtro de categoria
    const filtroCategoria = document.getElementById("filtro-categoria");
    if (filtroCategoria) {
        filtroCategoria.addEventListener("change", buscarPizza);
    }
}