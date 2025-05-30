// --- Função para Exibir Pop-up de Mensagem ---

/**
 * Exibe uma mensagem pop-up temporária na tela.
 * @param {string} mensagem - O texto a ser exibido.
 * @param {string} [tipo=\"info\"] - O tipo de mensagem (
success", "error", "info") para estilização.
 * @param {number} [duracao=2000] - Duração em milissegundos que o pop-up ficará visível.
 */
function showPopup(mensagem, tipo = "info", duracao = 2000) {
    // Remove qualquer popup existente para evitar sobreposição
    const popupExistente = document.getElementById("popup-global");
    if (popupExistente) {
        popupExistente.remove();
    }

    const popup = document.createElement("div");
    popup.id = "popup-global"; // ID para fácil remoção
    popup.className = `popup-mensagem ${tipo}`;
    popup.textContent = mensagem;

    document.body.appendChild(popup);

    // Adiciona a classe 'show' após um pequeno atraso para permitir a transição CSS
    setTimeout(() => {
        popup.classList.add("show");
    }, 10); // Pequeno delay para a transição funcionar

    // Remove o pop-up após a duração especificada
    setTimeout(() => {
        popup.classList.remove("show");
        // Espera a transição de fade-out terminar antes de remover o elemento do DOM
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 500); // Deve corresponder à duração da transição CSS (opacity)
    }, duracao);
}


