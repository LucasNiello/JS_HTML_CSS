let biblioteca = [];
let livroParaAlterar = null;

function mostrarSecao(secao) {
    const secoes = ["cadastro", "consulta", "alterar", "emprestimo", "venda"];
    secoes.forEach(id => document.getElementById(id).classList.add("hidden"));
    document.getElementById(secao).classList.remove("hidden");

    if (secao === "emprestimo") {
        prepararEmprestimo();
    }
}

function adicionarLivro() {
    const titulo = document.getElementById("titulo").value;
    const autor = document.getElementById("autor").value;
    const ano = parseInt(document.getElementById("ano").value);

    if (titulo && autor && ano) {
        biblioteca.push({ titulo, autor, ano });
        document.getElementById("titulo").value = "";
        document.getElementById("autor").value = "";
        document.getElementById("ano").value = "";
        atualizarLista();
        alert("Livro adicionado com sucesso!");
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

function atualizarLista(listaFiltrada = biblioteca) {
    let lista = document.getElementById("lista-livros");
    lista.innerHTML = "";

    listaFiltrada.forEach(livro => {
        let linha = `<tr>
                        <td>${livro.titulo}</td>
                        <td>${livro.autor}</td>
                        <td>${livro.ano}</td>
                    </tr>`;
        lista.innerHTML += linha;
    });
}

function buscarLivro() {
    const busca = document.getElementById("busca").value.toLowerCase();
    const resultados = biblioteca.filter((livro) => 
        livro.titulo.toLowerCase().includes(busca)
    );
    atualizarLista(resultados);
}

function buscarLivroParaAlterar() {
    const busca = document.getElementById("busca-alterar").value.toLowerCase();
    livroParaAlterar = biblioteca.find((livro) =>
        livro.titulo.toLowerCase().includes(busca)
    );

    if (livroParaAlterar) {
        document.getElementById("form-alterar").classList.remove("hidden");
        document.getElementById("novo-titulo").value = livroParaAlterar.titulo;
        document.getElementById("novo-autor").value = livroParaAlterar.autor;
        document.getElementById("novo-ano").value = livroParaAlterar.ano;
    }
}

function alterarLivro() {
    if (livroParaAlterar) {
        const novoTitulo = document.getElementById("novo-titulo").value;
        const novoAutor = document.getElementById("novo-autor").value;
        const novoAno = document.getElementById("novo-ano").value;

        if (novoTitulo && novoAutor && novoAno) {
            livroParaAlterar.titulo = novoTitulo;
            livroParaAlterar.autor = novoAutor;
            livroParaAlterar.ano = novoAno;

            atualizarLista();
            alert("Livro alterado com sucesso!");
            document.getElementById("form-alterar").classList.add("hidden");
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    }
}

function prepararEmprestimo() {
    const listaLivros = document.getElementById("livro-emprestimo");
    const mensagemErro = document.getElementById("mensagem-erro");
    const formEmprestimo = document.getElementById("form-emprestimo");

    listaLivros.innerHTML = "";

    if (biblioteca.length === 0) {
        mensagemErro.classList.remove("hidden");
        formEmprestimo.classList.add("hidden");
    } else {
        mensagemErro.classList.add("hidden");
        formEmprestimo.classList.remove("hidden");

        biblioteca.forEach((livro, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = livro.titulo;
            listaLivros.appendChild(option);
        });
    }
}

function registrarEmprestimo() {
    const livroIndex = document.getElementById("livro-emprestimo").value;
    const nomeUsuario = document.getElementById("nome-usuario").value;
    const dataRetirada = document.getElementById("data-retirada").value;
    const dataDevolucao = document.getElementById("data-devolucao").value;

    if (nomeUsuario && dataRetirada && dataDevolucao) {
        const livro = biblioteca[livroIndex];
        alert(`Livro "${livro.titulo}" emprestado para ${nomeUsuario} de ${dataRetirada} até ${dataDevolucao}.`);

        document.getElementById("nome-usuario").value = "";
        document.getElementById("data-retirada").value = "";
        document.getElementById("data-devolucao").value = "";
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

// Registro de vendas
let vendas = [];

function registrarVenda() {
    const titulo = document.getElementById("venda-titulo").value;
    const preco = document.getElementById("venda-preco").value;
    const comprador = document.getElementById("venda-comprador").value;

    if (titulo && preco && comprador) {
        const listaVendas = document.getElementById("lista-vendas");
        const item = document.createElement("li");
        item.textContent = `Título: ${titulo}, Preço: ${preco}, Comprador: ${comprador}`;
        listaVendas.appendChild(item);

        vendas.push({ titulo, preco, comprador });

        document.getElementById("venda-titulo").value = '';
        document.getElementById("venda-preco").value = '';
        document.getElementById("venda-comprador").value = '';
    } else {
        alert("Preencha todos os campos!");
    }
}

// Relatório de vendas
function gerarRelatorioVendas() {
    const tabelaRelatorio = document.getElementById("tabela-relatorio-vendas");
    tabelaRelatorio.innerHTML = ''; //Limpa a tabela

    if (vendas.length === 0) {
       alert("Nenhuma venda registrada.");
        return;
    }

    let totalVendas = 0; // Variável para armazenar o total de vendas

    if (totalVendas.length === 0) {
        alert("Valor de venda não registrado.");
        return;
    }

    vendas.forEach((venda) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
        <td>${venda.titulo}</td>
        <td>R$${parseFloat(venda.preco).toFixed(2)}</td>
        <td>${venda.comprador}</td>
        `;
        tabelaRelatorio.appendChild(linha);

        // Adiciona o valor da venda ao total
        totalVendas += parseFloat(venda.preco);
    })

    // Adiciona uma linha para o total de vendas
    const linhaTotal = document.createElement("tr");
linhaTotal.innerHTML = `
    <td><strong>Total de Vendas:</strong></td>
    <td><strong>R$${totalVendas.toFixed(2)}</strong></td>
    <td></td>
`;
}