// cliente_updated.js - Funcionalidades para a página do cliente

document.addEventListener('DOMContentLoaded', function() {
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
});
