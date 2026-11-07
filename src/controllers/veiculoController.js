const ValidacaoError = require("../errors/ValidacaoError");

// Controller dos veículos: recebe a requisição HTTP, chama o service e devolve a resposta. Não contém regra de negócio (ela fica no service).
class VeiculoController {

    constructor(service) {
        this.service = service;
    }

    // GET /veiculos?cor=azul&marca=fiat
    // Arrow function para o "this" não se perder quando o Express chamar o método
    listar = (req, res, next) => {
        try {
            const veiculos = this.service.listar(req.query);

            res.status(200).json(veiculos);
        } catch (erro) {
            next(erro);
        }
    };


    // GET /veiculos/:id
    buscarPorId = (req, res, next) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                throw new ValidacaoError("O id informado é inválido");
            }

            const veiculo = this.service.buscarPorId(id);

            res.status(200).json(veiculo);

        } catch (erro) {
            next(erro);
        }
    };
}

module.exports = VeiculoController;