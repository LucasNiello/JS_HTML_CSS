//1. Verificação de idade e habilitação

function verificarHabilitacao() {
  var idade = prompt("Digite sua idade:");
  var possuiHabilitacao = prompt("Você possui habilitação? (sim/não)");

  if (idade >= 18 && possuiHabilitacao === "sim") {
    alert("Você pode dirigir!");
  } else {
    alert("Você não pode dirigir!");
  }
}

verificarHabilitacao();