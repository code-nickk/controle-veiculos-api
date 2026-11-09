const Utilizacao = require("../models/utilizacao");
const NaoEncontradoError = require("../errors/NaoEncontradoError");
const ValidacaoError = require("../errors/ValidacaoError");
const ConflitoError = require("../errors/ConflitoError");
const textoValido = require("../utils/textoValido");
const converterId = require("../utils/converterId");

// Gerencia as regras de negócio das utilizações.
// Recebe os services de veículos e motoristas para reutilizar suas validações
// e seus erros 404, mantendo os repositories responsáveis pelo acesso aos dados.
class UtilizacaoService {

    constructor(repository, veiculoService, motoristaService) {
        this.repository = repository;
        this.veiculoService = veiculoService;
        this.motoristaService = motoristaService;
    }

    // Inicia uma utilização, verificando se o motorista e o veículo existem
    // e garantindo que nenhum dos dois esteja envolvido em outra utilização ativa.
    iniciar(dados = {}) {
        const motoristaId = converterId(dados.motoristaId);
        const veiculoId = converterId(dados.veiculoId);

        if (!textoValido(dados.motivo)) {
            throw new ValidacaoError("O motivo é obrigatório");
        }

        // Estas duas chamadas lançam 404 se o motorista ou o veículo não existirem
        this.motoristaService.buscarPorId(motoristaId);
        this.veiculoService.buscarPorId(veiculoId);

        // Regra 1: um veículo só pode ser usado por um motorista por vez
        if (this.repository.buscarEmAndamentoPorVeiculo(veiculoId)) {
            throw new ConflitoError("Este veículo já está em uso");
        }

        // Regra 2: um motorista não pode usar dois veículos ao mesmo tempo
        if (this.repository.buscarEmAndamentoPorMotorista(motoristaId)) {
            throw new ConflitoError("Este motorista já está utilizando um veículo");
        }

        const id = this.repository.gerarId();
        const utilizacao = new Utilizacao(id, motoristaId, veiculoId, dados.motivo.trim());

        this.repository.salvar(utilizacao);

        return utilizacao;
    }

    // Busca uma utilização pelo seu id
    buscarPorId(id) {
        const utilizacao = this.repository.buscarPorId(id);

        if (!utilizacao) {
            throw new NaoEncontradoError("Utilização não encontrada");
        }

        return utilizacao;
    }

    // Finaliza uma utilização pelo seu id, lança erro 409 caso a utilização já tenha sido finalizada
    finalizar(id) {
        const utilizacao = this.buscarPorId(id);

        if (utilizacao.dataFim !== null) {
            throw new ConflitoError("Esta utilização já foi finalizada");
        }

        utilizacao.dataFim = new Date();

        return utilizacao;
    }

    // Lista as utilizações com os dados relacionados de motoristas e veículos.
    listar() {
        return this.repository.listar().map(utilizacao => {
            const motorista = this.motoristaService.buscarPorId(utilizacao.motoristaId);
            const veiculo = this.veiculoService.buscarPorId(utilizacao.veiculoId);

            return {
                id: utilizacao.id,
                motivo: utilizacao.motivo,
                dataInicio: utilizacao.dataInicio,
                dataFim: utilizacao.dataFim,
                motorista: { id: motorista.id, nome: motorista.nome },
                veiculo: {
                    id: veiculo.id,
                    placa: veiculo.placa,
                    cor: veiculo.cor,
                    marca: veiculo.marca
                }
            };
        });
    }
}

module.exports = UtilizacaoService;