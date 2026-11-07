// Responsável por armazenar os veículos em memória

class VeiculoRepository {

    constructor() {
        this.veiculos = [];
        this.proximoId = 1;
    }
// Gera um ID sequêncial para cada cadastro
    gerarId() {
        return this.proximoId++;
    }

    salvar(veiculo) {
        this.veiculos.push(veiculo);

        return veiculo;
    }
    listar() {
        return this.veiculos;
    }
    buscarPorId(id) {
        return this.veiculos.find(
            veiculo => veiculo.id === id
        );
    }

    buscarPorPlaca(placa) {
        return this.veiculos.find(
            veiculo => veiculo.placa === placa  
        );
    }

    remover(id) {    
     this.veiculos = this.veiculos.filter(veiculo => veiculo.id !== id);
    }
}

module.exports = VeiculoRepository;