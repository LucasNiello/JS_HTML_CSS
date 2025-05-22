let estado = 0;

function mudarLuz() {
    // Obtém os elementos do semáforo pelas suas IDs (Vermelha com V maiúsculo)
    const luzVermelha = document.getElementById("Vermelha");
    const luzLaranja = document.getElementById("laranja");
    const luzAmarela = document.getElementById("amarela");
    const luzVerde = document.getElementById("verde");
    const luzAzul = document.getElementById("azul"); // NOVO

    // Remove as classes de cor para apagar todas as luzes antes de acender a nova
    luzVermelha.classList.remove("vermelha");
    luzLaranja.classList.remove("laranja");
    luzAmarela.classList.remove("amarela");
    luzVerde.classList.remove("verde");
    luzAzul.classList.remove("azul"); // NOVO

    // Verifica o estado atual e acende a luz correspondente, depois atualiza o estado
    if (estado === 0) {
        luzVermelha.classList.add("vermelha"); // Acende vermelho
        estado = 1;
    } else if (estado === 1) {
        luzLaranja.classList.add("laranja"); // Acende laranja
        estado = 2;
    } else if (estado === 2) {
        luzAmarela.classList.add("amarela"); // Acende amarelo
        estado = 3;
    } else if (estado === 3) {
        luzVerde.classList.add("verde"); // acende o verde
        estado = 4;
    } else if (estado === 4) {
        luzAzul.classList.add("azul"); // NOVO_ acende o azul
        estado = 0;
    }
}
