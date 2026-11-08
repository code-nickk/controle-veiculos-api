// Responsável por armazenar as utilizações em memória
class UtilizacaoRepository {

    constructor() {
        this.utilizacoes = [];
        this.proximoId = 1;
    }

    // Gera um ID sequencial para cada cadastro de utilização
    gerarId() {
        return this.proximoId++;
    }

    // Salva uma utilização
    salvar(utilizacao) {
        this.utilizacoes.push(utilizacao);

        return utilizacao;
    }

    // Gera uma lista com todas as utilizações
    listar() {
        return this.utilizacoes;
    }

    // Busca uma utilização por id
    buscarPorId(id) {
        return this.utilizacoes.find(
            utilizacao => utilizacao.id === id
        );
    }

    // Buscar uma utilização ativa(em andamento) pelo id do veículo.
    buscarEmAndamentoPorVeiculo(veiculoId) {
        return this.utilizacoes.find(
            utilizacao => utilizacao.veiculoId === veiculoId && utilizacao.dataFim === null
        );
    }

    // Buscar uma utilização ativa (em andamento) pelo id do motorista
    buscarEmAndamentoPorMotorista(motoristaId) {
        return this.utilizacoes.find(
            utilizacao => utilizacao.motoristaId === motoristaId && utilizacao.dataFim === null
        );
    }
}

module.exports = UtilizacaoRepository;