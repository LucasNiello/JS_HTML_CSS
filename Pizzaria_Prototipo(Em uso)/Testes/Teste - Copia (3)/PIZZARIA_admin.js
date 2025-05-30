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
    const cardapioSalvo = localStorage.getItem("cardapioPizzaria");
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
        // Garante que as opções de montagem sejam carregadas e exibidas ao mostrar a seção
        if (secao === "monte-sua-pizza") {
            carregarOpcoesMontagem(); // Carrega os dados mais recentes
            atualizarTabelasOpcoesMontagem(); // Atualiza a exibição na tela
        }
    }
}

// Função para adicionar uma nova pizza ao cardápio principal
function adicionarPizza() {
    const nome = document.getElementById("titulo").value;
    const ingredientes = document.getElementById("ingredientes").value;
    const preco = parseFloat(document.getElementById("preco").value);

    if (nome && ingredientes && !isNaN(preco) && preco > 0) {
        cardapio.push({ nome, ingredientes, preco });
        localStorage.setItem("cardapioPizzaria", JSON.stringify(cardapio));
        document.getElementById("titulo").value = "";
        document.getElementById("ingredientes").value = "";
        document.getElementById("preco").value = "";
        atualizarLista();
        showPopup("Pizza cadastrada com sucesso!", "success");
    } else {
        showPopup("Por favor, preencha todos os campos com valores válidos.", "error");
    }
}

// Atualiza a lista de pizzas exibida na seção de consulta
function atualizarLista(listaFiltrada = cardapio) {
    let lista = document.getElementById("lista-pizzas");
    if (!lista) return;
    lista.innerHTML = "";

    listaFiltrada.forEach((pizza, index) => {
        const originalIndex = cardapio.findIndex(p => p.nome === pizza.nome && p.preco === pizza.preco);
        if (originalIndex === -1) return; // Segurança extra
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
        showPopup("Erro ao encontrar pizza para excluir.", "error");
        return;
    }
    const nomePizza = cardapio[index].nome;
    // Removido o confirm() conforme solicitado, ação direta com popup
    cardapio.splice(index, 1);
    localStorage.setItem("cardapioPizzaria", JSON.stringify(cardapio));
    atualizarLista();
    showPopup(`Pizza '${nomePizza}' excluída com sucesso!`, "success");
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
    const index = cardapio.findIndex(pizza => pizza.nome.toLowerCase().includes(busca));

    if (index !== -1) {
        pizzaParaAlterar = { ...cardapio[index], originalIndex: index };
        document.getElementById("form-alterar").classList.remove("hidden");
        document.getElementById("novo-nome").value = pizzaParaAlterar.nome;
        document.getElementById("novo-ingredientes").value = pizzaParaAlterar.ingredientes;
        document.getElementById("novo-preco").value = pizzaParaAlterar.preco;
    } else {
        pizzaParaAlterar = null;
        document.getElementById("form-alterar").classList.add("hidden");
        showPopup("Pizza não encontrada.", "info");
    }
}

// Aplica as alterações feitas à pizza selecionada
function alterarPizza() {
    if (pizzaParaAlterar && pizzaParaAlterar.originalIndex !== undefined) {
        const novoNome = document.getElementById("novo-nome").value;
        const novoIngredientes = document.getElementById("novo-ingredientes").value;
        const novoPreco = parseFloat(document.getElementById("novo-preco").value);

        if (novoNome && novoIngredientes && !isNaN(novoPreco) && novoPreco > 0) {
            cardapio[pizzaParaAlterar.originalIndex] = { nome: novoNome, ingredientes: novoIngredientes, preco: novoPreco };
            localStorage.setItem("cardapioPizzaria", JSON.stringify(cardapio));
            atualizarLista();
            showPopup("Pizza alterada com sucesso!", "success");
            document.getElementById("form-alterar").classList.add("hidden");
            pizzaParaAlterar = null;
            document.getElementById("busca-alterar").value = "";
        } else {
            showPopup("Por favor, preencha todos os campos com valores válidos.", "error");
        }
    }
}

// --- Funções de Gerenciamento "Monte Sua Pizza" ---

// Função para carregar as opções de montagem do localStorage
function carregarOpcoesMontagem() {
    const opcoesSalvas = localStorage.getItem("opcoesMontagemPizzaria");
    if (opcoesSalvas) {
        try {
            opcoesMontagem = JSON.parse(opcoesSalvas);
            // Garante que as chaves principais existem
            if (!opcoesMontagem.tamanhos) opcoesMontagem.tamanhos = [];
            if (!opcoesMontagem.ingredientes) opcoesMontagem.ingredientes = [];
            if (!opcoesMontagem.bordas) opcoesMontagem.bordas = [];
        } catch (e) {
            console.error("Erro ao parsear opcoesMontagem do localStorage:", e);
            // Reseta para o padrão se houver erro no parse
            inicializarOpcoesMontagemPadrao();
            salvarOpcoesMontagem();
        }
    } else {
        // Inicializa com valores padrão se não houver nada salvo
        inicializarOpcoesMontagemPadrao();
        salvarOpcoesMontagem();
    }
}

// Função auxiliar para definir os valores padrão
function inicializarOpcoesMontagemPadrao() {
    opcoesMontagem = {
        tamanhos: [
            { nome: "Média - Massa Tradicional", preco: 40.00 },
            { nome: "Grande - Massa Tradicional", preco: 50.00 }
        ],
        ingredientes: [
            { nome: "Calabresa Fatiada", preco: 6.00 },
            { nome: "Queijo Mussarela", preco: 0.00 } // Exemplo base
        ],
        bordas: [
            { nome: "Sem Borda Recheada", preco: 0.00 },
            { nome: "Catupiry Original", preco: 10.00 }
        ]
    };
}

// Função para salvar as opções de montagem no localStorage
function salvarOpcoesMontagem() {
    try {
        localStorage.setItem("opcoesMontagemPizzaria", JSON.stringify(opcoesMontagem));
    } catch (e) {
        console.error("Erro ao salvar opcoesMontagem no localStorage:", e);
        showPopup("Erro ao salvar as opções. Verifique o console.", "error");
    }
}

// Função para atualizar as tabelas de gerenciamento de opções na interface do admin
function atualizarTabelasOpcoesMontagem() {
    const tabelas = {
        tamanhos: document.getElementById("lista-tamanhos"),
        ingredientes: document.getElementById("lista-ingredientes-admin"),
        bordas: document.getElementById("lista-bordas-admin")
    };

    for (const tipo in tabelas) {
        const tbody = tabelas[tipo];
        if (tbody) {
            tbody.innerHTML = ""; // Limpa tabela
            // Garante que o array existe em opcoesMontagem antes de iterar
            if (opcoesMontagem && Array.isArray(opcoesMontagem[tipo])) {
                opcoesMontagem[tipo].forEach((item, index) => {
                    // Não permite excluir "Sem Borda Recheada"
                    const podeExcluir = !(tipo === "bordas" && item.nome === "Sem Borda Recheada");
                    const botaoExcluirHTML = podeExcluir
                        ? `<button class="btn-excluir" onclick="excluirOpcaoMontagem('${tipo}', ${index})"><i class="fas fa-trash-alt"></i></button>`
                        : ""; // Coluna vazia se não puder excluir

                    const linha = `<tr>
                                    <td>${item.nome}</td>
                                    <td>R$${item.preco.toFixed(2)}</td>
                                    <td>${botaoExcluirHTML}</td>
                                 </tr>`;
                    tbody.innerHTML += linha;
                });
            }
        } else {
            console.warn(`Elemento tbody não encontrado para o tipo: ${tipo}`);
        }
    }
}


// Função para adicionar uma nova opção de montagem (tamanho, ingrediente ou borda)
function adicionarOpcaoMontagem(tipo) {
    let nomeInput, precoInput, nome, preco;

    if (tipo === "tamanhos") {
        nomeInput = document.getElementById("tamanho-nome");
        precoInput = document.getElementById("tamanho-preco");
    } else if (tipo === "ingredientes") {
        nomeInput = document.getElementById("ingrediente-nome");
        precoInput = document.getElementById("ingrediente-preco");
    } else if (tipo === "bordas") {
        nomeInput = document.getElementById("borda-nome");
        precoInput = document.getElementById("borda-preco");
    } else {
        console.error(`Tipo inválido para adicionarOpcaoMontagem: ${tipo}`);
        return;
    }

    // Verifica se os inputs foram encontrados
    if (!nomeInput || !precoInput) {
         console.error(`Inputs não encontrados para tipo: ${tipo}. Nome ID: ${tipo}-nome, Preço ID: ${tipo}-preco`);
         showPopup(`Erro interno: Campos de entrada não encontrados para ${tipo}.`, "error");
         return;
    }

    nome = nomeInput.value.trim();
    preco = parseFloat(precoInput.value);

    if (nome && !isNaN(preco) && preco >= 0) { // Permite preço 0
        // Garante que o array exista em opcoesMontagem
        if (!opcoesMontagem || !Array.isArray(opcoesMontagem[tipo])) {
            console.warn(`Array opcoesMontagem.${tipo} não existe ou não é um array. Inicializando.`);
            // Tenta recarregar ou inicializar como segurança, embora não devesse ser necessário
            carregarOpcoesMontagem(); 
            if (!opcoesMontagem || !Array.isArray(opcoesMontagem[tipo])) {
                 opcoesMontagem[tipo] = []; // Inicializa se ainda não existir
            }
        }

        const existe = opcoesMontagem[tipo].some(item => item.nome.toLowerCase() === nome.toLowerCase());
        if (existe) {
            showPopup(`Erro: A opção '${nome}' já existe em ${tipo}.`, "error");
            return;
        }

        opcoesMontagem[tipo].push({ nome, preco });
        salvarOpcoesMontagem();
        atualizarTabelasOpcoesMontagem(); // Atualiza a interface
        nomeInput.value = ""; // Limpa os campos
        precoInput.value = "";
        showPopup(`Opção '${nome}' adicionada com sucesso!`, "success");
    } else {
        showPopup("Por favor, preencha o nome e um preço válido (pode ser 0).", "error");
    }
}

// Função para excluir uma opção de montagem
function excluirOpcaoMontagem(tipo, index) {
    if (!opcoesMontagem || !Array.isArray(opcoesMontagem[tipo]) || index < 0 || index >= opcoesMontagem[tipo].length) {
        showPopup("Erro ao encontrar opção para excluir.", "error");
        return;
    }

    // Impede a exclusão da opção padrão "Sem Borda Recheada"
    if (tipo === "bordas" && opcoesMontagem[tipo][index].nome === "Sem Borda Recheada") {
        showPopup("A opção 'Sem Borda Recheada' não pode ser excluída.", "info");
        return;
    }

    const nomeOpcao = opcoesMontagem[tipo][index].nome;
    opcoesMontagem[tipo].splice(index, 1);
    salvarOpcoesMontagem();
    atualizarTabelasOpcoesMontagem();
    showPopup(`Opção '${nomeOpcao}' excluída com sucesso!`, "success");
}

// --- Funções de Venda e Relatório (Mantidas como estavam, mas com popups) ---

// Função para registrar uma venda (simplificado, sem validação de existência da pizza)
function registrarVenda() {
    const nomePizza = document.getElementById("venda-titulo").value;
    const precoPizza = parseFloat(document.getElementById("venda-preco").value);
    const comprador = document.getElementById("venda-comprador").value;

    if (nomePizza && !isNaN(precoPizza) && precoPizza > 0 && comprador) {
        const venda = {
            pizza: nomePizza,
            preco: precoPizza,
            comprador: comprador,
            data: new Date().toLocaleString()
        };
        let vendas = JSON.parse(localStorage.getItem("vendasPizzaria") || "[]");
        vendas.push(venda);
        localStorage.setItem("vendasPizzaria", JSON.stringify(vendas));

        const listaVendas = document.getElementById("lista-vendas");
        if (listaVendas) {
            const item = document.createElement("li");
            item.textContent = `Pizza: ${nomePizza}, Preço: R$${precoPizza.toFixed(2)}, Comprador: ${comprador}`;
            listaVendas.appendChild(item);
        }

        document.getElementById("venda-titulo").value = "";
        document.getElementById("venda-preco").value = "";
        document.getElementById("venda-comprador").value = "";
        showPopup("Venda registrada com sucesso!", "success");
    } else {
        showPopup("Preencha todos os campos da venda corretamente!", "error");
    }
}

// Função para gerar relatório de vendas
function gerarRelatorioVendas() {
    mostrarSecao("relatorio");
    const vendas = JSON.parse(localStorage.getItem("vendasPizzaria") || "[]");
    const tabelaRelatorio = document.getElementById("tabela-relatorio-vendas");
    if (!tabelaRelatorio) return;
    tabelaRelatorio.innerHTML = "";

    if (vendas.length === 0) {
        tabelaRelatorio.innerHTML = "<tr><td colspan='4'>Nenhuma venda registrada</td></tr>"; // Ajustado colspan
        return;
    }

    let totalVendas = 0;
    vendas.forEach(venda => {
        let linha = `<tr>
                        <td>${venda.pizza}</td>
                        <td>R$${venda.preco.toFixed(2)}</td>
                        <td>${venda.comprador}</td>
                        <td>${venda.data}</td>
                    </tr>`;
        tabelaRelatorio.innerHTML += linha;
        totalVendas += venda.preco;
    });

    // Adiciona linha de total
    const linhaTotal = `<tr class="total-row">
                            <td><strong>Total</strong></td>
                            <td><strong>R$${totalVendas.toFixed(2)}</strong></td>
                            <td colspan="2"></td>
                       </tr>`;
    tabelaRelatorio.innerHTML += linhaTotal;
}

// --- Inicialização --- 

document.addEventListener("DOMContentLoaded", () => {
    carregarCardapio();
    carregarOpcoesMontagem();
    // A atualização inicial das tabelas de montagem agora ocorre dentro de mostrarSecao
    // quando a seção 'monte-sua-pizza' é exibida pela primeira vez.
});

