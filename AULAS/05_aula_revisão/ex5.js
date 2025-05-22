const numeros = require("readline");

const num = numeros.createInterface({
    input: process.stdin,
    output: process.stout,
});
 
num.question("digite o primeiro número:", (num1) => {
    num.question("digite o segundo nùmero",(num2) => {
         let soma = Number(num1) + Number(num2) + Number(num3) + Number(num4);
    console.log(`A soma dos números é: ${soma}`);
    num.close();
    })
});