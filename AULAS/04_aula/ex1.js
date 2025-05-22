// aula 4

// lacos de repetições

// FOR
//for (condicao) {
// bloco de codigo
//}

for (let i = 0; i < 10; i++) {
  console.log(i);
}

for (let i = 20; i > 10; i--) {
    console.log (i)
}

for (let i = 0; i <= 100; i += 10) {
    console.log (i);
}

let i = 20;
while (i < 10) {
    console.log (i);
    i++;
}

//////////////////////////////////////////////

//////////////////////////////////////////////

let numero = 5;

numero = Number(numero);

let fatorial = 1;
for (let i = 1; i <= numero; i++) {
    fatorial *= i;
}

console.log (`O fatorial de ${numero} é ${fatorial}.`);