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

// Valida o Login do usuário e redireciona para a página correta
function validarLogin() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    // Credenciais fixas
    const adminUsuario = "admin";
    const adminSenha = "admin";

    const clienteUsuario = "cliente";
    const clienteSenha = "cliente";

    if (usuario === adminUsuario && senha === adminSenha) {
        exibirMensagem("Login de administrador realizado com sucesso!", "sucesso");
        setTimeout(() => {
            window.location.href = "PIZZARIA_admin.html"; // Página do administrador
        }, 2000);
    } else if (usuario === clienteUsuario && senha === clienteSenha) {
        exibirMensagem("Login de cliente realizado com sucesso!", "sucesso");
        setTimeout(() => {
            window.location.href = "PIZZARIA_cliente.html"; // Página do cliente
        }, 2000);
    } else {
        exibirMensagem("Usuário ou senha incorretos!", "erro");
    }
}



// Simula o login com Google usando um e-mail fictício
function loginComGoogle() {
    const emailFicticio = "usuarioficticio@google.com";
    
    // Exibe mensagem de sucesso simulado
    exibirMensagem(`Login com Google simulado com sucesso para ${emailFicticio}! Redirecionando...`, "sucesso");
    
    // Redireciona para a página do cliente após um pequeno atraso
    setTimeout(() => {
        window.location.href = "PIZZARIA_cliente.html"; // Página do cliente
    }, 2500); // Atraso um pouco maior para dar tempo de ler a mensagem
}

