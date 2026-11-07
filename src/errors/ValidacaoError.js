// Erro lançado quando os dados enviados são inválidos ou estão incompletos (HTTP 400)

class ValidacaoError extends Error {
    constructor(mensagem) {
        super(mensagem);
        this.statusCode = 400;
    }
}

module.exports = ValidacaoError;