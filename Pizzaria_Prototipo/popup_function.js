// --- Função para Exibir Pop-up de Mensagem ---

// Esta função mostra uma mensagem pop-up temporária na tela.
//
// Parâmetros:
// - mensagem (string): o texto que será exibido na janela pop-up.
//   Exemplo: "Operação realizada com sucesso!"
//
// - tipo (string) [opcional, padrão = "info"]: define o estilo do pop-up com base no tipo.
//   Pode ser:
//     - "success" → para mensagens de sucesso
//     - "error"   → para mensagens de erro
//     - "info"    → para mensagens informativas (valor padrão)
//
// - duracao (number) [opcional, padrão = 2000]: o tempo em milissegundos que a mensagem
//   ficará visível na tela antes de desaparecer. Exemplo: 3000 = 3 segundos.
function showPopup(mensagem, tipo = "info", duracao = 2000) {
    // Verifica se já existe um popup com o ID "popup-global" na tela
    const popupExistente = document.getElementById("popup-global");
    if (popupExistente) {
        // Se existir, remove para evitar que apareçam vários popups ao mesmo tempo
        popupExistente.remove();
    }

    // Cria um novo elemento <div> para o popup
    const popup = document.createElement("div");
    
    // Define um ID para facilitar futuras manipulações ou remoções
    popup.id = "popup-global";
    
    // Adiciona classes CSS para estilização: "popup-mensagem" e o tipo ("success", "error", "info")
    popup.className = `popup-mensagem ${tipo}`;
    
    // Define o conteúdo de texto que será exibido no popup
    popup.textContent = mensagem;

    // Insere o popup no final do corpo do documento (body)
    document.body.appendChild(popup);

    // Após um pequeno atraso, adiciona a classe 'show' para ativar a animação de entrada (via CSS)
    setTimeout(() => {
        popup.classList.add("show");
    }, 10); // Delay necessário para garantir que a transição CSS funcione corretamente

    // Define o tempo após o qual o popup começará a desaparecer
    setTimeout(() => {
        // Remove a classe 'show' para acionar a animação de saída (fade-out)
        popup.classList.remove("show");

        // Após o término da animação de saída, remove o elemento do DOM
        setTimeout(() => {
            // Confirma se o popup ainda está no DOM antes de tentar removê-lo
            if (popup.parentNode) {
                popup.remove();
            }
        }, 500); // Tempo deve ser igual ao tempo da transição CSS de opacidade
    }, duracao);
}
