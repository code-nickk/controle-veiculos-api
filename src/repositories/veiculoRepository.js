// Responsável por armazenar os veículos em memória

class VeiculoRepository {

    constructor() {
        this.veiculos = [];
        this.proximoId = 1;
    }

    // Gera um ID sequencial para cada cadastro de veículo
    gerarId() {
        return this.proximoId++;
    }

    // Salva um veículo
    salvar(veiculo) {
        this.veiculos.push(veiculo);

        return veiculo;
    }

    // Devolve uma lista com todos os veículos
    listar() {
        return this.veiculos;
    }

    // Busca um veículo pelo id
    buscarPorId(id) {
        return this.veiculos.find(
            veiculo => veiculo.id === id
        );
    }

    // Busca um veículo pela placa já padronizada (ABC1234)
    buscarPorPlaca(placa) {
        return this.veiculos.find(
            veiculo => veiculo.placa === placa
        );
    }

    // Excluir um veículo com base no seu id da lista. Não avisa se o id não existir, o service já verifica isso antes.
    excluir(id) {
     this.veiculos = this.veiculos.filter(veiculo => veiculo.id !== id);
    }
}

module.exports = VeiculoRepository;