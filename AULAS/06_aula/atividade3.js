function calcular() {
  let numero = Number(prompt("Digite um número:"));

  let antecessor = numero - 1;
  let sucessor = numero + 1;

  alert(
    `O antecessor de ${numero} é ${antecessor} e o sucessor é ${sucessor}.`
  );
}
