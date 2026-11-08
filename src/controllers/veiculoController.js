const converterId = require("../utils/converterId");

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
            const id = converterId(req.params.id);
            const veiculo = this.service.buscarPorId(id);

            res.status(200).json(veiculo);

        } catch (erro) {
            next(erro);
        }
    };


    // POST /veiculos
    criar = (req, res, next) => {
        try {
            const veiculo = this.service.criar(req.body);

            res.status(201).json(veiculo);
        } catch (erro) {
            next(erro);
        }
    };

    // PUT /veiculos/:id
    atualizar = (req, res, next) => {
        try {
            const id = converterId(req.params.id);
            const veiculo = this.service.atualizar(id, req.body);

            res.status(200).json(veiculo);
        } catch (erro) {
            next(erro);
        }
    };

    // DELETE /veiculos/:id
    excluir = (req, res, next) => {
        try {
            const id = converterId(req.params.id);

            this.service.excluir(id);

            res.status(204).send();

        } catch (erro) {
            next(erro);
        }
    };


}

module.exports = VeiculoController;