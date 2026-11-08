// Verifica se o valor é um texto com conteúdo (não vazio e não só espaços)
function textoValido(valor) {
    return typeof valor === "string" && valor.trim() !== "";
}

module.exports = textoValido;