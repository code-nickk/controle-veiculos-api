const ValidacaoError = require("../errors/ValidacaoError");

// Converte o id recebido pela URL (que chega como texto) em número.
// Aceita apenas inteiros maiores que zero; caso contrário, lança erro 400.
function converterId(valor) {
    const id = Number(valor);

    if (!Number.isInteger(id) || id <= 0) {
        throw new ValidacaoError("O id informado é inválido");
    }

    return id;
}

module.exports = converterId;