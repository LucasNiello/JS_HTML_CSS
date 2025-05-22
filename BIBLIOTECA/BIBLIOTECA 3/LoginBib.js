function exibirMensagem(texto, tipo) {
    const mensagem = document.getElementById("mensagem");
    mensagem.textContent = texto;

    // Adiciona a classe de estilo
    mensagem.className = `mensagem-${tipo}`;
    mensagem.classList.remove("hidden");

    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        mensagem.classList.add("hidden");
    }, 3000);    
}

// validar o login
function validarLogin() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    // Usuário e senha fixos para validação
    const usuarioCorreto = "admin";
    const senhaCorreta = "1234";

    if (usuario === usuarioCorreto && senha === senhaCorreta) {
        exibirMensagem("Login realizado com sucesso!", "sucesso");
        setTimeout(() => {
            window.location.href = "Biblioteca.html" // Redireciona para a página da biblioteca após 1 segundo
        }, 1000);
    } else {
        exibirMensagem("Usuário ou senha incorretos!", "erro");
    }
}
