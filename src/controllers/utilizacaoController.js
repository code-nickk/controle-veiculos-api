const converterId = require("../utils/converterId");

// Recebe as requisições HTTP de utilizações e encaminha as operações ao service.
class UtilizacaoController {

    constructor(service) {
        this.service = service;
    }

    // POST /utilizacoes
    // Incia uma utilização, travando um motorista e um veículo de serem incluidos em outra utilização
    iniciar = (req, res, next) => {
        try {
            const utilizacao = this.service.iniciar(req.body);

            res.status(201).json(utilizacao);
        } catch (erro) {
            next(erro);
        }
    };

    // PATCH /utilizacoes/:id/finalizar
    // Finalizar uma utilização pelo id.
    // Utilizar PATCH porque apenas a data de finalização é alterada,
    // sem substituir o recurso inteiro, como aconteceria com PUT.
    finalizar = (req, res, next) => {
        try {
            const id = converterId(req.params.id);
            const utilizacao = this.service.finalizar(id);

            res.status(200).json(utilizacao);
        } catch (erro) {
            next(erro);
        }
    };

    // GET /utilizacoes
    // Mostra uma lista com a utilização (Nome do motorista, veiculo e informações da utilização)
    listar = (req, res, next) => {
        try {
            const utilizacoes = this.service.listar();

            res.status(200).json(utilizacoes);
        } catch (erro) {
            next(erro);
        }
    };
}

module.exports = UtilizacaoController;