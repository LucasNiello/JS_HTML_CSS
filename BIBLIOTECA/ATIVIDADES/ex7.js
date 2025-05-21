// 7. Parque de Diversões:
//Escreva um programa que calcule os valores de entrada e de opções para tipos de ingressos. Ao final representar os valores e tipo de ingressos.


listaIngressos = [];
total = 0;



tipo = prompt("Digite o tipo do ingresso (Infantil, Adulto, VIP):");

if (tipo == "Infantil") {
  valor = 50.0;
} else if (tipo == "Adulto") {
  valor = 100.0;
} else if (tipo == "VIP") {
  valor = 200.0;
} else {
  alert("Tipo inválido.");
}



listaIngressos.push({ tipo: tipo, valor: valor });
total += valor;


tipo = prompt("Digite o tipo do ingresso (Infantil, Adulto, VIP):");

if (tipo == "Infantil") {
  valor = 50.0;
} else if (tipo == "Adulto") {
  valor = 100.0;
} else if (tipo == "VIP") {
  valor = 200.0;
} else {
  alert("Tipo inválido.");
}



listaIngressos.push({ tipo: tipo, valor: valor });
total += valor; 



if (listaIngressos.length > 0) {
  mensagem = "Lista de ingressos:\n";
  for (i = 0; i < listaIngressos.length; i++) {
    mensagem +=
      "Tipo: " +
      listaIngressos[i].tipo +
      " | Valor: R$ " +
      listaIngressos[i].valor +
      "\n";
  }
  mensagem += "Total: R$ " + total;
  alert(mensagem);
} else {
  alert("Nenhum ingresso comprado.");
}
