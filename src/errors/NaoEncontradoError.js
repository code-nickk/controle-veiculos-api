// Erro lançado quando um registro procurado não existe (HTTP 404)

class NaoEncontradoError extends Error {
    constructor(mensagem) {
        super(mensagem);
        this.statusCode = 404;
    }
}

module.exports = NaoEncontradoError;