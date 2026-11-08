const converterId = require("../utils/converterId");

// Controller dos motoristas: recebe a requisição HTTP, chama o service e devolve a resposta. Não contém regra de negócio (ela fica no service).
class MotoristaController {

    constructor(service) {
        this.service = service;
    }

    // GET /motoristas?nome=ana
    // Arrow function para o "this" não se perder quando o Express chamar o método
    listar = (req, res, next) => {
        try {
            const motoristas = this.service.listar(req.query);

            res.status(200).json(motoristas);
        } catch (erro) {
            next(erro);
        }
    };


    // GET /motoristas/:id
    buscarPorId = (req, res, next) => {
        try {
            const id = converterId(req.params.id);
            const motorista = this.service.buscarPorId(id);

            res.status(200).json(motorista);

        } catch (erro) {
            next(erro);
        }
    };


    // POST /motoristas
    criar = (req, res, next) => {
        try {
            const motorista = this.service.criar(req.body);

            res.status(201).json(motorista);
        } catch (erro) {
            next(erro);
        }
    };

    // PUT /motoristas/:id
    atualizar = (req, res, next) => {
        try {
            const id = converterId(req.params.id);
            const motorista = this.service.atualizar(id, req.body);

            res.status(200).json(motorista);
        } catch (erro) {
            next(erro);
        }
    };

    // DELETE /motoristas/:id
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

module.exports = MotoristaController;