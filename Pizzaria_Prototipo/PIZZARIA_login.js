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
        showPopup("Login de administrador realizado com sucesso!", "success");
        setTimeout(() => {
            window.location.href = "PIZZARIA_admin.html"; // Página do administrador
        }, 2000);
    } else if (usuario === clienteUsuario && senha === clienteSenha) {
        showPopup("Login de cliente realizado com sucesso!", "success");
        setTimeout(() => {
            window.location.href = "PIZZARIA_cliente.html"; // Página do cliente
        }, 2000);
    } else {
        showPopup("Usuário ou senha incorretos!", "error");
    }
}



// Simula o login com Google usando um e-mail fictício
function loginComGoogle() {
    const emailFicticio = "usuarioficticio@google.com";
    
    // Exibe mensagem de sucesso simulado
    showPopup("Login com Google realizado.", "success");
    
    // Redireciona para a página do cliente após um pequeno atraso
    setTimeout(() => {
        window.location.href = "PIZZARIA_cliente.html"; // Página do cliente
    }, 2500); // Atraso um pouco maior para dar tempo de ler a mensagem
}

