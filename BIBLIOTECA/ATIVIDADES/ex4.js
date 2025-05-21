// 4. Escreva um programa que verifique se um cliente tem direito a um descontocom base na quantidade de itens comprados e se é um cliente VIP.


function verificarDesconto() {
  quantidade = prompt("Digite a quantidade de itens comprados:");
  clienteVIP = prompt("Você é um cliente VIP? (sim/não)");

  if (quantidade >= 10 && clienteVIP === "sim") {
    alert("Você tem direito ao desconto!");
  } else {
    alert("Você não tem direito ao desconto.");
  }
}

verificarDesconto();