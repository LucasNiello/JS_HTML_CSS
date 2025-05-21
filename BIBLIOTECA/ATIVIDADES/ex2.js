//2. Verificação de Acesso a um Sistema

function verificarAcesso() {
  usuario = prompt("Digite seu nome de usuário:");
  senha = prompt("Digite sua senha:");

  if (usuario === "Manveru" && senha === "Rebolation") {
    alert("Acesso permitido!");
  } else {
    alert("Acesso negado!");
  }
}

verificarAcesso();