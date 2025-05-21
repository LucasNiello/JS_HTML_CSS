//6. Loja de Móveis: Escreva um programa para representar um móvel com propriedades como tipo (cadeira, mesa, etc.), material, cor e preço. Em seguida, crie uma função para adicionar novos móveis a uma lista.


listaMoveis = [];

function representarMovel() {
  tipo = "Cadeira";
  material = "Madeira";
  cor = "Marrom";
  preco = "R$ 120,00";

  alert(
    "Detalhes do Móvel:\n" +
      "Tipo: " +
      tipo +
      "\n" +
      "Material: " +
      material +
      "\n" +
      "Cor: " +
      cor +
      "\n" +
      "Preço: " +
      preco
  );
}

function adicionarMovel() {
  tipo = prompt("Digite o tipo do móvel:");
  material = prompt("Digite o material do móvel:");
  cor = prompt("Digite a cor do móvel:");
  preco = prompt("Digite o preço do móvel:");

  listaMoveis.push({ tipo, material, cor, preco });
  alert("Móvel adicionado com sucesso!");
}

representarMovel();
adicionarMovel();