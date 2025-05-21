//3. Verificação de Votação: Escreva um programa que verifique se uma pessoa pode votar com base nasua idade e nacionalidade.

function verificarVoto() {
  idade = prompt("Digite sua idade:");
  nacionalidade = prompt("Digite sua nacionalidade:");

  if (idade >= 16 && nacionalidade === "Brasileiro") {
    alert("Você pode votar!");
  } else {
    alert("Você não pode votar!");
  }
}

verificarVoto();