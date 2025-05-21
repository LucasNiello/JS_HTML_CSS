function calculator(a, b, operation) {
  if (operation === "add") {
    return a + b;
  } else if (operation === "subtract") {
    return a - b;
  } else if (operation === "multiply") {
    return a * b;
  } else if (operation === "divide") {
    if (b !== 0) {
      return a / b;
    } else {
      return "Erro: Divisão por zero";
    }
  } else {
    return "Operação inválida";
  }
}

// Exemplo de uso
const a = parseFloat(prompt("Digite o primeiro número:"));
const b = parseFloat(prompt("Digite o segundo número:"));
const operation = prompt(
  "Digite a operação (add, subtract, multiply, divide):"
);

const resultado = calculator(a, b, operation);
console.log(`Resultado: ${resultado}`);




