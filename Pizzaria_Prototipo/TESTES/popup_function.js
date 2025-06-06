// --- Função para Exibir Pop-up de Mensagem Global ---

/**
 * Exibe uma mensagem pop-up temporária na tela, estilizada conforme o tipo (sucesso, erro, informação).
 *
 * @param {string} mensagem - O texto que será exibido na janela pop-up.
 *                            Exemplo: "Operação realizada com sucesso!"
 *
 * @param {string} [tipo="info"] - O tipo de mensagem, usado para definir
 *                                 a estilização via classes CSS.
 *                                 Pode ser:
 *                                  - "success": mensagem de sucesso (fundo verde)
 *                                  - "error": mensagem de erro (fundo vermelho)
 *                                  - "info": mensagem informativa (fundo dourado - padrão)
 *
 * @param {number} [duracao=2000] - Tempo em milissegundos que a mensagem
 *                                  ficará visível na tela antes de desaparecer.
 *                                  Padrão: 2000 ms (2 segundos).
 */
function showPopup(mensagem, tipo = "info", duracao = 2000) {
    // Verifica se já existe um popup visível com o mesmo ID
    const popupExistente = document.getElementById("popup-global");

    // Se já existir, remove o antigo para evitar sobreposição
    if (popupExistente) {
        popupExistente.remove();
    }

    // Cria um novo elemento <div> para o popup
    const popup = document.createElement("div");

    // Define um ID fixo para facilitar manipulação futura
    popup.id = "popup-global";

    // Adiciona as classes CSS:
    // - "popup-mensagem": classe base com estilo geral
    // - "tipo": define a cor de fundo com base no tipo de mensagem
    popup.classList.add("popup-mensagem", tipo);

    // Define o conteúdo de texto do popup
    popup.textContent = mensagem;

    // Insere o popup no final do body do documento
    document.body.appendChild(popup);

    // Força um reflow (recalcula layout) para garantir que a transição CSS funcione
    // Essa linha "reinicia" o CSS antes de adicionar a classe .show
    void popup.offsetWidth;

    // Adiciona a classe 'show' após o reflow, ativando a animação de entrada
    popup.classList.add("show");

    // Aguarda o tempo especificado e inicia a remoção do popup
    setTimeout(() => {
        // Remove a classe 'show', ativando a animação de saída (fade-out)
        popup.classList.remove("show");

        // Aguarda o término da transição CSS antes de remover o elemento do DOM
        setTimeout(() => {
            // Confirma que o elemento ainda está no DOM antes de remover
            if (popup.parentNode) {
                popup.remove();
            }
        }, 500); // Deve coincidir com a duração da transição CSS (.4s no seu CSS = ~400ms)
    }, duracao);
}
