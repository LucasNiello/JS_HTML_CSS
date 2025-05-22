function converter(){
  let valorReais = parseFloat(prompt("digite o valor em Reais:"));
  const cotacaoDolar = 5.8;
  let valorDolares = valorReais / cotacaoDolar;

  alert(
    `${valorReais.toFixed(2)} BRL equivale a ${valorDolares.toFixed(2)} USD.`
  );
}