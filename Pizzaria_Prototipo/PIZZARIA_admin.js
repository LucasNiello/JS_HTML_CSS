// Lista de pizzas disponíveis no sistema
let cardapio = [];

// Variável para armazenar a pizza que será alterada
let pizzaParaAlterar = null;

// Estrutura para armazenar as opções da montagem de pizza
let opcoesMontagem = {
    tamanhos: [],
    ingredientes: [],
    bordas: []
};

// --- Funções do Cardápio Principal ---

// Função para carregar o cardápio do localStorage quando a página iniciar
function carregarCardapio() {
    const cardapioSalvo = localStorage.getItem('cardapioPizzaria');
    if (cardapioSalvo) {
        cardapio = JSON.parse(cardapioSalvo);
        atualizarLista(); // Atualiza a lista de pizzas na interface
    }
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
        // Se a seção for a de montagem, carrega e atualiza as tabelas
        if (secao === 'monte-sua-pizza') {
            carregarOpcoesMontagem();
            atualizarTabelasOpcoesMontagem();
        }
    }
}

// Função para adicionar uma nova pizza ao cardápio principal
function adicionarPizza() {
    const nome = document.getElementById("titulo").value;
    const ingredientes = document.getElementById("ingredientes").value;
    const preco = parseFloat(document.getElementById("preco").value);

    if (nome && ingredientes && !isNaN(preco)) {
        cardapio.push({ nome, ingredientes, preco });
        localStorage.setItem('cardapioPizzaria', JSON.stringify(cardapio)); // Salva no localStorage
        document.getElementById("titulo").value = "";
        document.getElementById("ingredientes").value = "";
        document.getElementById("preco").value = "";
        atualizarLista();
        alert("Pizza cadastrada com sucesso!");
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}

// Atualiza a lista de pizzas exibida na seção de consulta, incluindo botão de exclusão
function atualizarLista(listaFiltrada = cardapio) {
    let lista = document.getElementById("lista-pizzas");
    if (!lista) return; // Sai se o elemento não existir
    lista.innerHTML = ""; // Limpa a lista atual

    listaFiltrada.forEach((pizza, index) => {
        // Encontra o índice original no array 'cardapio' para garantir a exclusão correta
        const originalIndex = cardapio.findIndex(p => p.nome === pizza.nome && p.preco === pizza.preco);
        let linha = `<tr>
                        <td>${pizza.nome}</td>
                        <td>${pizza.ingredientes}</td>
                        <td>R$${pizza.preco.toFixed(2)}</td>
                        <td>
                            <button class="btn-excluir" onclick="excluirPizza(${originalIndex})">
                                <i class="fas fa-trash-alt"></i> Excluir
                            </button>
                        </td>
                    </tr>`;
        lista.innerHTML += linha;
    });
}

// Função para excluir uma pizza do cardápio principal
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

// Filtra pizzas pelo nome na seção de consulta
function buscarPizza() {
    const busca = document.getElementById("busca").value.toLowerCase();
    const resultados = cardapio.filter(pizza =>
        pizza.nome.toLowerCase().includes(busca)
    );
    atualizarLista(resultados);
}

// Localiza uma pizza para ser alterada e exibe o formulário
function buscarPizzaParaAlterar() {
    const busca = document.getElementById("busca-alterar").value.toLowerCase();
    // Encontra a pizza e seu índice original
    const index = cardapio.findIndex(pizza => pizza.nome.toLowerCase().includes(busca));

    if (index !== -1) {
        pizzaParaAlterar = { ...cardapio[index], originalIndex: index }; // Guarda o índice original
        document.getElementById("form-alterar").classList.remove("hidden");
        document.getElementById("novo-nome").value = pizzaParaAlterar.nome;
        document.getElementById("novo-ingredientes").value = pizzaParaAlterar.ingredientes;
        document.getElementById("novo-preco").value = pizzaParaAlterar.preco;
    } else {
        pizzaParaAlterar = null;
        document.getElementById("form-alterar").classList.add("hidden");
        alert("Pizza não encontrada.");
    }
}

// Aplica as alterações feitas à pizza selecionada
function alterarPizza() {
    if (pizzaParaAlterar && pizzaParaAlterar.originalIndex !== undefined) {
        const novoNome = document.getElementById("novo-nome").value;
        const novoIngredientes = document.getElementById("novo-ingredientes").value;
        const novoPreco = parseFloat(document.getElementById("novo-preco").value);

        if (novoNome && novoIngredientes && !isNaN(novoPreco)) {
            // Atualiza a pizza no array 'cardapio' usando o índice original
            cardapio[pizzaParaAlterar.originalIndex] = { nome: novoNome, ingredientes: novoIngredientes, preco: novoPreco };
            localStorage.setItem('cardapioPizzaria', JSON.stringify(cardapio));
            atualizarLista();
            alert("Pizza alterada com sucesso!");
            document.getElementById("form-alterar").classList.add("hidden");
            pizzaParaAlterar = null; // Limpa a variável
            document.getElementById("busca-alterar").value = ''; // Limpa busca
        } else {
            alert("Por favor, preencha todos os campos corretamente.");
        }
    }
}

// --- Funções de Gerenciamento "Monte Sua Pizza" ---

// Função para carregar as opções de montagem do localStorage
function carregarOpcoesMontagem() {
    const opcoesSalvas = localStorage.getItem('opcoesMontagemPizzaria');
    if (opcoesSalvas) {
        opcoesMontagem = JSON.parse(opcoesSalvas);
    } else {
        // Inicializa com valores padrão se não houver nada salvo
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
                { nome: "Queijo Gorgonzola", preco: 10.00 }, // Premium exemplo
                { nome: "Queijo Parmesão", preco: 8.00 }, // Premium exemplo
                { nome: "Catupiry Original", preco: 8.00 } // Premium exemplo
            ],
            bordas: [
                { nome: "Sem Borda Recheada", preco: 0.00 },
                { nome: "Catupiry Original", preco: 10.00 },
                { nome: "Cheddar", preco: 10.00 },
                { nome: "Mussarela", preco: 8.00 }
            ]
        };
        salvarOpcoesMontagem(); // Salva os padrões iniciais
    }
}

// Função para salvar as opções de montagem no localStorage
function salvarOpcoesMontagem() {
    localStorage.setItem('opcoesMontagemPizzaria', JSON.stringify(opcoesMontagem));
}

// Função para atualizar as tabelas de gerenciamento de opções na interface do admin
function atualizarTabelasOpcoesMontagem() {
    const tabelas = {
        tamanhos: document.getElementById("lista-tamanhos"),
        ingredientes: document.getElementById("lista-ingredientes-admin"),
        bordas: document.getElementById("lista-bordas-admin")
    };

    // Limpa tabelas existentes
    for (const tipo in tabelas) {
        if (tabelas[tipo]) {
            tabelas[tipo].innerHTML = "";
        }
    }

    // Preenche tabela de Tamanhos/Massas
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

    // Preenche tabela de Ingredientes
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

    // Preenche tabela de Bordas
    if (tabelas.bordas) {
        opcoesMontagem.bordas.forEach((item, index) => {
            // Não mostra a opção "Sem Borda" para exclusão
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

// Função para adicionar uma nova opção de montagem (tamanho, ingrediente ou borda)
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
        return; // Tipo inválido
    }

    nome = nomeInput.value.trim();
    preco = parseFloat(precoInput.value);

    if (nome && !isNaN(preco)) {
        // Verifica duplicidade (case-insensitive)
        const existe = opcoesMontagem[tipo].some(item => item.nome.toLowerCase() === nome.toLowerCase());
        if (existe) {
            alert(`Erro: A opção '${nome}' já existe.`);
            return;
        }

        opcoesMontagem[tipo].push({ nome, preco });
        salvarOpcoesMontagem();
        atualizarTabelasOpcoesMontagem();
        // Limpa os campos
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

    // Impede a exclusão da opção "Sem Borda Recheada"
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

// --- Funções de Venda e Relatório (Mantidas como estavam) ---

// Função para registrar uma venda e exibir na lista
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

// --- Inicialização --- 

// Carregar dados quando a página for carregada
document.addEventListener('DOMContentLoaded', () => {
    carregarCardapio();
    carregarOpcoesMontagem(); // Carrega as opções de montagem
    // Não atualiza as tabelas aqui, pois a seção pode não estar visível inicialmente
    // A atualização ocorrerá ao clicar no botão do menu "Monte Sua Pizza"
});

