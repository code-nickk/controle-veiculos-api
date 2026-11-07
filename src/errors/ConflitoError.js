// Erro lançado quando a operação entra em conflito com o estado atual (HTTP 409)

class ConflitoError extends Error {
    constructor(mensagem) {
        super(mensagem);
        this.statusCode = 409;
    }
}

module.exports = ConflitoError;