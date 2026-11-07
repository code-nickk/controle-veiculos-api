// Responsável por armazenar os veículos em memória

class VeiculoRepository {

    constructor() {
        this.veiculos = [];
        this.proximoId = 1;
    }

    // Gera um ID sequencial para cada cadastro
    gerarId() {
        return this.proximoId++;
    }

    // Salva um veiculo
    salvar(veiculo) {
        this.veiculos.push(veiculo);

        return veiculo;
    }

    // Gera uma lista de veiculos por id
    listar() {
        return this.veiculos;
    }

    // Busca um veículo pelo id
    buscarPorId(id) {
        return this.veiculos.find(
            veiculo => veiculo.id === id
        );
    }

    // Busca um veículo pela placa 
    
    buscarPorPlaca(placa) {
        return this.veiculos.find(
            veiculo => veiculo.placa === placa
        );
    }

    // Excluir um veiculo com base no seu id da lista
    excluir(id) {
     this.veiculos = this.veiculos.filter(veiculo => veiculo.id !== id);
    }
}

module.exports = VeiculoRepository;