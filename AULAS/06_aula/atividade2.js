function solicitarDados() {
  let nome = prompt("Digite seu nome:");
  let idade = prompt("Digite sua idade:");

  if (nome && idade) {
    let mensagem = `Olá, ${nome}! Você tem ${idade} anos.`;
    window.alert(mensagem);
  }
}
