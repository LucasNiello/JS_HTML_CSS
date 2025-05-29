// cliente_updated.js - Funcionalidades para a página do cliente com integração localStorage

document.addEventListener('DOMContentLoaded', function() {
    // Carregar cardápio do localStorage e adicionar à página
    carregarCardapioCliente();
    
    // Navegação entre seções
    const navLinks = document.querySelectorAll('.nav-link');
    const secoes = document.querySelectorAll('.secao');
    const modal = document.getElementById('carrinho-modal');

    // Função para mostrar seção
    function mostrarSecao(targetId) {
        // Ocultar todas as seções
        secoes.forEach(secao => {
            secao.classList.remove('active');
        });

        // Remover classe active de todos os links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Se for o carrinho, mostrar o modal
        if (targetId === 'carrinho-modal') {
            modal.classList.add('active');
            return;
        }

        // Mostrar a seção alvo
        const targetSecao = document.getElementById(targetId);
        if (targetSecao) {
            targetSecao.classList.add('active');
        }

        // Adicionar classe active ao link correspondente
        navLinks.forEach(link => {
            if (link.getAttribute('data-target') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // Adicionar evento de clique aos links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            mostrarSecao(targetId);
        });
    });

    // Fechar modal do carrinho
    const fecharModal = document.querySelector('.fechar-modal');
    if (fecharModal) {
        fecharModal.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }

    // Continuar comprando (fechar modal)
    const btnContinuarComprando = document.querySelectorAll('.btn-continuar-comprando');
    btnContinuarComprando.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    });

    // Filtro de categorias no cardápio
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const cardProdutos = document.querySelectorAll('.card-produto');

    filtroBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filtroBtns.forEach(b => b.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            const categoria = this.getAttribute('data-categoria');
            
            // Filtrar produtos
            cardProdutos.forEach(card => {
                if (categoria === 'todas' || card.getAttribute('data-categoria') === categoria) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Montar Pizza - Atualizar resumo
    const inputsTamanho = document.querySelectorAll('input[name="tamanho"]');
    const inputsMassa = document.querySelectorAll('input[name="massa"]');
    const inputsIngredientes = document.querySelectorAll('input[name="ingredientes"]');
    const inputsBorda = document.querySelectorAll('input[name="borda"]');
    const resumoIngredientes = document.getElementById('resumo-ingredientes');
    const resumoBorda = document.getElementById('resumo-borda');
    const precoTotal = document.getElementById('preco-total');

    // Função para atualizar o resumo
    function atualizarResumo() {
        let total = 0;
        let tamanhoSelecionado = '';
        let precoTamanho = 0;
        let massaSelecionada = '';
        let precoMassa = 0;
        let bordaSelecionada = '';
        let precoBorda = 0;
        
        // Obter tamanho selecionado
        inputsTamanho.forEach(input => {
            if (input.checked) {
                tamanhoSelecionado = input.value;
                precoTamanho = parseFloat(input.getAttribute('data-preco'));
                total += precoTamanho;
            }
        });
        
        // Obter massa selecionada
        inputsMassa.forEach(input => {
            if (input.checked) {
                massaSelecionada = input.value;
                precoMassa = parseFloat(input.getAttribute('data-preco'));
                total += precoMassa;
            }
        });
        
        // Obter borda selecionada
        inputsBorda.forEach(input => {
            if (input.checked) {
                bordaSelecionada = input.value;
                precoBorda = parseFloat(input.getAttribute('data-preco'));
                total += precoBorda;
                
                // Atualizar resumo da borda
                if (bordaSelecionada === 'sem') {
                    resumoBorda.innerHTML = `
                        <span>Sem borda recheada</span>
                        <span>Incluso</span>
                    `;
                } else {
                    const labelBorda = document.querySelector(`label[for="borda-${bordaSelecionada}"]`).textContent.split('-')[0].trim();
                    resumoBorda.innerHTML = `
                        <span>Borda ${labelBorda}</span>
                        <span>+ R$ ${precoBorda.toFixed(2)}</span>
                    `;
                }
            }
        });
        
        // Obter ingredientes selecionados
        let ingredientesSelecionados = [];
        let ingredientesHTML = '';
        let contadorIngredientes = 0;
        
        inputsIngredientes.forEach(input => {
            if (input.checked) {
                const precoIngrediente = parseFloat(input.getAttribute('data-preco'));
                const labelIngrediente = document.querySelector(`label[for="${input.id}"]`).textContent.split('-')[0].trim();
                
                ingredientesSelecionados.push({
                    nome: labelIngrediente,
                    preco: precoIngrediente
                });
                
                contadorIngredientes++;
            }
        });
        
        // Calcular preço dos ingredientes (os 3 primeiros são grátis)
        ingredientesSelecionados.forEach((ingrediente, index) => {
            if (index < 3) {
                ingredientesHTML += `
                    <div class="resumo-item">
                        <span>${ingrediente.nome}</span>
                        <span>Incluso</span>
                    </div>
                `;
            } else {
                total += ingrediente.preco;
                ingredientesHTML += `
                    <div class="resumo-item">
                        <span>${ingrediente.nome}</span>
                        <span>+ R$ ${ingrediente.preco.toFixed(2)}</span>
                    </div>
                `;
            }
        });
        
        // Atualizar resumo dos ingredientes
        resumoIngredientes.innerHTML = ingredientesHTML;
        
        // Atualizar preço total
        precoTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
    
    // Adicionar eventos para atualizar o resumo
    inputsTamanho.forEach(input => {
        input.addEventListener('change', atualizarResumo);
    });
    
    inputsMassa.forEach(input => {
        input.addEventListener('change', atualizarResumo);
    });
    
    inputsIngredientes.forEach(input => {
        input.addEventListener('change', atualizarResumo);
    });
    
    inputsBorda.forEach(input => {
        input.addEventListener('change', atualizarResumo);
    });
    
    // Inicializar o resumo
    atualizarResumo();
    
    // Inicializar carrinho
    inicializarCarrinho();
});

// Função para carregar o cardápio do localStorage e exibir na interface do cliente
function carregarCardapioCliente() {
    const cardapioSalvo = localStorage.getItem('cardapioPizzaria');
    if (cardapioSalvo) {
        const pizzas = JSON.parse(cardapioSalvo);
        const gridProdutos = document.querySelector('.grid-produtos');
        
        // Se não houver pizzas, não fazer nada
        if (pizzas.length === 0) return;
        
        // Adicionar uma seção para as pizzas do administrador
        const categoriaBotao = document.createElement('button');
        categoriaBotao.className = 'filtro-btn';
        categoriaBotao.setAttribute('data-categoria', 'admin');
        categoriaBotao.textContent = 'Do Administrador';
        
        // Adicionar o botão apenas se ainda não existir
        const filtroCategorias = document.querySelector('.filtro-categorias');
        if (!document.querySelector('[data-categoria="admin"]')) {
            filtroCategorias.appendChild(categoriaBotao);
            
            // Adicionar evento de clique ao novo botão
            categoriaBotao.addEventListener('click', function() {
                // Remover classe active de todos os botões
                document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
                
                // Adicionar classe active ao botão clicado
                this.classList.add('active');
                
                // Filtrar produtos
                document.querySelectorAll('.card-produto').forEach(card => {
                    if (card.getAttribute('data-categoria') === 'admin') {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
        
        // Adicionar cada pizza do cardápio à grade de produtos
        pizzas.forEach((pizza, index) => {
            // Verificar se a pizza já existe na página (para evitar duplicatas)
            const pizzaExistente = Array.from(document.querySelectorAll('.produto-info h3')).some(
                h3 => h3.textContent === pizza.nome
            );
            
            if (!pizzaExistente) {
                const cardHTML = `
                    <div class="card-produto" data-categoria="admin">
                        <div class="produto-img">
                            <img src="https://via.placeholder.com/300x200" alt="${pizza.nome}">
                            <span class="tag-destaque">Novo</span>
                        </div>
                        <div class="produto-info">
                            <h3>${pizza.nome}</h3>
                            <p class="ingredientes">${pizza.ingredientes}</p>
                            <div class="produto-footer">
                                <span class="preco">R$ ${pizza.preco.toFixed(2)}</span>
                                <button class="btn-adicionar" data-id="admin-${index}" data-nome="${pizza.nome}" data-preco="${pizza.preco}">
                                    <i class="fas fa-plus"></i> Adicionar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                gridProdutos.insertAdjacentHTML('afterbegin', cardHTML);
            }
        });
        
        // Reativar os botões de adicionar para os novos itens
        ativarBotoesAdicionar();
    }
}

// Função para ativar os botões de adicionar ao carrinho
function ativarBotoesAdicionar() {
    const botoesAdicionar = document.querySelectorAll('.btn-adicionar');
    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const nome = this.getAttribute('data-nome');
            const preco = parseFloat(this.getAttribute('data-preco'));
            
            adicionarAoCarrinho(id, nome, preco);
        });
    });
}

// Carrinho de compras
let carrinho = [];

// Inicializar carrinho
function inicializarCarrinho() {
    // Carregar carrinho do localStorage se existir
    const carrinhoSalvo = localStorage.getItem('carrinhoPizzaria');
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
        atualizarContadorCarrinho();
        atualizarCarrinhoUI();
    }
    
    // Ativar botões de adicionar ao carrinho
    ativarBotoesAdicionar();
    
    // Ativar botões de promoção
    const botoesPromocao = document.querySelectorAll('.btn-promocao');
    botoesPromocao.forEach(botao => {
        botao.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const nome = this.getAttribute('data-nome');
            const preco = parseFloat(this.getAttribute('data-preco'));
            
            adicionarAoCarrinho(id, nome, preco);
        });
    });
}

// Adicionar item ao carrinho
function adicionarAoCarrinho(id, nome, preco) {
    // Verificar se o item já está no carrinho
    const itemExistente = carrinho.find(item => item.id === id);
    
    if (itemExistente) {
        // Incrementar quantidade
        itemExistente.quantidade += 1;
    } else {
        // Adicionar novo item
        carrinho.push({
            id: id,
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }
    
    // Salvar carrinho no localStorage
    localStorage.setItem('carrinhoPizzaria', JSON.stringify(carrinho));
    
    // Atualizar UI
    atualizarContadorCarrinho();
    atualizarCarrinhoUI();
    
    // Mostrar mensagem
    alert(`${nome} adicionado ao carrinho!`);
}

// Atualizar contador de itens no carrinho
function atualizarContadorCarrinho() {
    const contador = document.querySelector('.contador-itens');
    const total = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    contador.textContent = total;
}

// Atualizar UI do carrinho
function atualizarCarrinhoUI() {
    const carrinhoItens = document.getElementById('carrinho-itens');
    const carrinhoVazio = document.getElementById('carrinho-vazio');
    const carrinhoResumo = document.getElementById('carrinho-resumo');
    const subtotalSpan = document.getElementById('subtotal-valor');
    const totalSpan = document.getElementById('total-valor');
    
    // Verificar se o carrinho está vazio
    if (carrinho.length === 0) {
        if (carrinhoVazio) carrinhoVazio.style.display = 'block';
        if (carrinhoResumo) carrinhoResumo.style.display = 'none';
        if (carrinhoItens) carrinhoItens.innerHTML = '';
        return;
    }
    
    // Mostrar itens e resumo
    if (carrinhoVazio) carrinhoVazio.style.display = 'none';
    if (carrinhoResumo) carrinhoResumo.style.display = 'block';
    
    // Preencher itens
    if (carrinhoItens) {
        carrinhoItens.innerHTML = '';
        
        carrinho.forEach(item => {
            const itemHTML = `
                <div class="carrinho-item">
                    <div class="item-info">
                        <h4>${item.nome}</h4>
                        <p>R$ ${item.preco.toFixed(2)} x ${item.quantidade}</p>
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
            carrinhoItens.insertAdjacentHTML('beforeend', itemHTML);
        });
        
        // Adicionar eventos aos botões de remover
        document.querySelectorAll('.btn-remover').forEach(botao => {
            botao.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                removerDoCarrinho(id);
            });
        });
    }
    
    // Calcular subtotal
    const subtotal = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
    const taxaEntrega = 10.00;
    const total = subtotal + taxaEntrega;
    
    // Atualizar valores
    if (subtotalSpan) subtotalSpan.textContent = `R$ ${subtotal.toFixed(2)}`;
    if (totalSpan) totalSpan.textContent = `R$ ${total.toFixed(2)}`;
}

// Remover item do carrinho
function removerDoCarrinho(id) {
    // Encontrar índice do item
    const index = carrinho.findIndex(item => item.id === id);
    
    if (index !== -1) {
        // Remover item
        carrinho.splice(index, 1);
        
        // Salvar carrinho no localStorage
        localStorage.setItem('carrinhoPizzaria', JSON.stringify(carrinho));
        
        // Atualizar UI
        atualizarContadorCarrinho();
        atualizarCarrinhoUI();
    }
}
