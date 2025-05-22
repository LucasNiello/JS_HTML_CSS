// Calcular media de notas com base em duas notas, sendo a 1ª com peso 6 e a 2ª com peso 10 e mais um peso 4 para trabalhos

let nota1 = parseFloat(prompt("Digite a nota 1:"));
let nota2 = parseFloat(prompt("Digite a nota 2:"));
let trabalho= parseFloat(prompt("Digite a nota do trabalho:"))

let media = ((nota1 + nota2 + trabalho)) /2;
alert(`A media é: ${media}`);