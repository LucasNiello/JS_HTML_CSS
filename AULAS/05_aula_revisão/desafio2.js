// Mercadinho
let valores = [];
let quantidade = parseInt(prompt("Quantos produtos você deseja comprar?"));

for (let i = 0; i < quantidade; i++) {
  let valor = parseFloat(prompt(`Digite o valor do produto ${i + 1} (R$):`));
  valores.push(valor);
}

let total = valores.reduce((acc, val) => acc + val, 0);
alert(`O total da compra é: R$ ${total.toFixed(2)}`);
