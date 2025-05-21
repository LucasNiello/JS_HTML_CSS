function calcularTroco(){
    let produto = prompt("O que estás comprando, nobre gafanhoto?");
    let preco = Number(prompt(`Qual o valor de ${produto}`));
    let pagamento = Number(prompt("Qual o valor pago pelo nobre cliente?"));

    let troco = pagamento - preco;

    alert(`O seu troco é ${troco.toFixed(2)}`) // .toFixed(2) arruma para 2 casas decimais depois da virgula, como o sistema monetário ---> 1,99; 10,00; etcetera.
}