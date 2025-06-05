// Lista de pizzas disponíveis no sistema
let cardapio = []; // Array que armazena objetos de pizza {nome, ingredientes, preco}

// Variável para armazenar a pizza que será alterada
let pizzaParaAlterar = null; // Guarda temporariamente a pizza selecionada para alteração

// Estrutura para armazenar as opções da montagem de pizza
let opcoesMontagem = {
    tamanhos: [],       // Array de objetos {nome, preco} para tamanhos de pizza
    ingredientes: [],   // Array de objetos {nome, preco} para ingredientes adicionais
    bordas: []          // Array de objetos {nome, preco} para bordas recheadas ou não
};

// --- Funções do Cardápio Principal ---

// Carrega o cardápio do localStorage ao iniciar a página
function carregarCardapio() {
    const cardapioSalvo = localStorage.getItem("cardapioPizzaria");
    if (cardapioSalvo) {
        cardapio = JSON.parse(cardapioSalvo);
        atualizarLista(); // Atualiza a exibição do cardápio na interface
    }
}

// Mostra uma seção da interface e esconde as outras
function mostrarSecao(secao) {
    const secoes = ["cadastro", "consulta", "alterar", "monte-sua-pizza", "venda", "relatorio"];
    secoes.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.classList.add("hidden"); // Oculta todas as seções
    });
    const secaoAtiva = document.getElementById(secao);
    if (secaoAtiva) {
        secaoAtiva.classList.remove("hidden"); // Exibe a seção desejada
        if (secao === "monte-sua-pizza") {
            carregarOpcoesMontagem();
            atualizarTabelasOpcoesMontagem();
        }
    }
}

// Adiciona uma nova pizza ao cardápio principal
function adicionarPizza() {
    const nome = document.getElementById("titulo").value;
    const ingredientes = document.getElementById("ingredientes").value;
    const preco = parseFloat(document.getElementById("preco").value);

    if (nome && ingredientes && !isNaN(preco) && preco > 0) {
        cardapio.push({ nome, ingredientes, preco }); // Adiciona pizza ao array
        localStorage.setItem("cardapioPizzaria", JSON.stringify(cardapio)); // Salva no localStorage
        // Limpa os campos do formulário
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
    lista.innerHTML = ""; // Limpa a lista antes de popular

    listaFiltrada.forEach((pizza, index) => {
        const originalIndex = cardapio.findIndex(p => p.nome === pizza.nome && p.preco === pizza.preco);
        if (originalIndex === -1) return; // Evita erro se não encontrar
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
        lista.innerHTML += linha; // Insere linha na tabela
    });
}

// Exclui uma pizza do cardápio principal
function excluirPizza(index) {
    if (index < 0 || index >= cardapio.length) {
        showPopup("Erro ao encontrar pizza para excluir.", "error");
        return;
    }
    const nomePizza = cardapio[index].nome;
    cardapio.splice(index, 1); // Remove a pizza do array
    localStorage.setItem("cardapioPizzaria", JSON.stringify(cardapio)); // Atualiza localStorage
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
        pizzaParaAlterar = { ...cardapio[index], originalIndex: index }; // Clona pizza para alterar
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

// Carrega as opções de montagem do localStorage ou inicializa com padrão
function carregarOpcoesMontagem() {
    const opcoesSalvas = localStorage.getItem("opcoesMontagemPizzaria");
    if (opcoesSalvas) {
        opcoesMontagem = JSON.parse(opcoesSalvas);
    } else {
        opcoesMontagem = {
            tamanhos: [
                { nome: "Média - Massa Tradicional", preco: 40.00 },
                { nome: "Grande - Massa Tradicional", preco: 50.00 }
            ],
            ingredientes: [
                { nome: "Calabresa Fatiada", preco: 6.00 },
                { nome: "Queijo Mussarela", preco: 0.00 }
            ],
            bordas: [
                { nome: "Sem Borda Recheada", preco: 0.00 },
                { nome: "Catupiry Original", preco: 10.00 }
            ]
        };
        salvarOpcoesMontagem();
    }
}

// Salva as opções de montagem no localStorage
function salvarOpcoesMontagem() {
    localStorage.setItem("opcoesMontagemPizzaria", JSON.stringify(opcoesMontagem));
}

// Atualiza as tabelas de gerenciamento de opções na interface administrativa
function atualizarTabelasOpcoesMontagem() {
    const tabelas = {
        tamanhos: document.getElementById("lista-tamanhos"),
        ingredientes: document.getElementById("lista-ingredientes-admin"),
        bordas: document.getElementById("lista-bordas-admin")
    };

    for (const tipo in tabelas) {
        if (tabelas[tipo]) {
            tabelas[tipo].innerHTML = ""; // Limpa tabela
            if (opcoesMontagem[tipo]) {
                opcoesMontagem[tipo].forEach((item, index) => {
                    const podeExcluir = !(tipo === "bordas" && item.nome === "Sem Borda Recheada");
                    const botaoExcluirHTML = podeExcluir
                        ? `<td><button class="btn-excluir" onclick="excluirOpcaoMontagem('${tipo}', ${index})"><i class="fas fa-trash-alt"></i></button></td>`
                        : "<td></td>";

                    const linha = `<tr>
                                    <td>${item.nome}</td>
                                    <td>R$${item.preco.toFixed(2)}</td>
                                    ${botaoExcluirHTML}
                                 </tr>`;
                    tabelas[tipo].innerHTML += linha; // Insere linha na tabela
                });
            }
        }
    }
}

// Adiciona uma nova opção de montagem (tamanho, ingrediente ou borda)
function adicionarOpcaoMontagem(tipo) {
    let nomeInput, precoInput;

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
        return;
    }

    const nome = nomeInput.value.trim();
    const preco = parseFloat(precoInput.value);

    if (nome && !isNaN(preco) && preco >= 0) {
        if (!opcoesMontagem[tipo]) opcoesMontagem[tipo] = []; // Garante que array existe
        const existe = opcoesMontagem[tipo].some(item => item.nome.toLowerCase() === nome.toLowerCase());
        if (existe) {
            showPopup(`Erro: A opção '${nome}' já existe em ${tipo}.`, "error");
            return;
        }
        opcoesMontagem[tipo].push({ nome, preco }); // Adiciona nova opção
        salvarOpcoesMontagem();
        atualizarTabelasOpcoesMontagem();
        nomeInput.value = "";
        precoInput.value = "";
        showPopup(`Opção '${nome}' adicionada com sucesso!`, "success");
    } else {
        showPopup("Por favor, preencha o nome e um preço válido (pode ser 0).", "error");
    }
}

// Exclui uma opção de montagem
function excluirOpcaoMontagem(tipo, index) {
    if (!opcoesMontagem[tipo] || index < 0 || index >= opcoesMontagem[tipo].length) {
        showPopup("Erro ao encontrar opção para excluir.", "error");
        return;
    }

    if (tipo === "bordas" && opcoesMontagem[tipo][index].nome === "Sem Borda Recheada") {
        showPopup("A opção 'Sem Borda Recheada' não pode ser excluída.", "info");
        return;
    }

    const nomeOpcao = opcoesMontagem[tipo][index].nome;
    opcoesMontagem[tipo].splice(index, 1); // Remove do array
    salvarOpcoesMontagem();
    atualizarTabelasOpcoesMontagem();
    showPopup(`Opção '${nomeOpcao}' excluída com sucesso!`, "success");
}

// --- Funções de Venda e Relatório ---

// Registra uma venda no sistema
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
        // Limpa campos
        document.getElementById("venda-titulo").value = "";
        document.getElementById("venda-preco").value = "";
        document.getElementById("venda-comprador").value = "";
        showPopup("Venda registrada com sucesso!", "success");
    } else {
        showPopup("Preencha todos os campos da venda corretamente!", "error");
    }
}
// Exibe a seção de vendas e carrega as vendas registradas
// Função para gerar relatório de vendas
function gerarRelatorioVendas() {
    mostrarSecao("relatorio");  // Exibe a seção de relatório, escondendo as outras seções.

    // Recupera do localStorage o array de objetos de vendas, ou um array vazio se não houver vendas.
    const vendas = JSON.parse(localStorage.getItem("vendasPizzaria") || "[]");

    // Obtém a referência à tabela onde será exibido o relatório.
    const tabelaRelatorio = document.getElementById("tabela-relatorio-vendas");
    
    if (!tabelaRelatorio) return;  // Caso a tabela não exista no HTML, interrompe a função.

    tabelaRelatorio.innerHTML = "";  // Limpa o conteúdo da tabela antes de adicionar os dados.

    if (vendas.length === 0) {  // Se não houver vendas registradas.
        tabelaRelatorio.innerHTML = "<tr><td colspan='3'>Nenhuma venda registrada</td></tr>";
        return;  // Sai da função.
    }

    let totalVendas = 0;  // Variável para acumular o total das vendas.

    // Percorre cada venda no array 'vendas'.
    vendas.forEach(venda => {
        // Cria uma nova linha de tabela com os dados da venda: nome da pizza, preço, comprador e data.
        let linha = `<tr>
                        <td>${venda.pizza}</td>
                        <td>R$${venda.preco.toFixed(2)}</td>
                        <td>${venda.comprador}</td>
                        <td>${venda.data}</td>
                    </tr>`;
        
        // Adiciona a linha à tabela de relatório.
        tabelaRelatorio.innerHTML += linha;

        // Soma o preço da venda ao total.
        totalVendas += venda.preco;
    });

    // Adiciona uma linha ao final da tabela com o total de todas as vendas.
    const linhaTotal = `<tr>
                            <td colspan="1"><strong>Total</strong></td>
                            <td><strong>R$${totalVendas.toFixed(2)}</strong></td>
                            <td colspan="2"></td>
                       </tr>`;
    tabelaRelatorio.innerHTML += linhaTotal;  // Insere a linha de total na tabela.
}

// --- Inicialização --- 

// Aguarda o carregamento completo do DOM (Document Object Model).
document.addEventListener("DOMContentLoaded", () => {
    carregarCardapio();  // Função que carrega e exibe o cardápio de pizzas disponíveis.
    carregarOpcoesMontagem();  // Função que carrega as opções para montagem de pizzas.
    // A atualização das tabelas de montagem ocorre ao clicar no menu, evitando carregamento automático.
});



showPopup
// showPopup - provavelmente há uma função chamada 'showPopup' mais abaixo ou em outro arquivo
// responsável por exibir uma janela pop-up (modal) com informações ou mensagens ao usuário.
// Aqui está apenas a referência, talvez seja chamada ou configurada a seguir.