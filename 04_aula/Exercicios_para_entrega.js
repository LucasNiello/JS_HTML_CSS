// Imprimir 11* a palavra "Olá mundo"

for (let i = 0; i < 11; i++) {
  console.log("Olá, mundo");
}

// Fazer uma tabuada

let numero = 5;

for (let i = 1; i <= 10; i++) {
  console.log(`${numero} x ${i} = ${numero * i}`);
}


// Soma(indicação) dos numeros impares de 1 à 5

let soma = 0;

for (let i = 1; i <= 100; i += 2) {
  console.log(i);
  soma += i;
}

console.log("Soma total:", soma);


//Contagem regreciva 10 à 0 e escrever "feliz ano novo!"

let i = 10;
while (i> 0) {
  console.log(i);
  i--;
}
console.log("Feliz ano novo!")

// Verificação de categoria de idade (caso vacina, por exemplo)
let idade = 5;
if (idade >= 60) {
  console.log("pode vacinar"); 
  } else if (idade <= 12) {
    console.log('Vacine imediatamente')
  } else {
  console.log("não pode vacinar");
}

// Verificação de nota
let nota1 = 93;
if (nota1 >= 90) {
  console.log("Excelente");
} else if (nota1 >= 80) {
  console.log("Bom");
} else {
  console.log(" ),: Você pode melhorar");
}

// Verificação de dia da semana
let dia = 'segunda-feira';
if (dia === 'segunda-feira') {
    console.log('Pagar as contas');
 } else if (dia === 'domingo') {
    console.log('Hoje tem churrasco');
 } else {
    console.log('Bom trabalho, até mais tarde');
 }

// Horario do dia
let hora = 11;
if (hora < 12) {
  console.log("manhã");
} else if (hora < 18) {
  console.log("tarde");
} else {
  console.log("noite");
}
