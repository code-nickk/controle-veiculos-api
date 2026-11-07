const Veiculo = require("../models/veiculo");

class VeiculoService {

    constructor(repository) {
        this.repository = repository;
    }

    // Retorna todos os veículos
    listar() {
        return this.repository.listar();
    }

    // Busca um veículo pelo id
    buscarPorId(id) {
        return this.repository.buscarPorId(id);
    }

    // Busca um veículo pela placa
    buscarPorPlaca(placa) {
        return this.repository.buscarPorPlaca(placa);
    }

    // Cria um novo veículo
    criar(dados) {

        // Valida os campos obrigatórios
        if (!dados.placa) {
            throw new Error("A placa é obrigatória");
        }

        if (!dados.cor) {
            throw new Error("A cor é obrigatória");
        }

        if (!dados.marca) {
            throw new Error("A marca é obrigatória");
        }

        // Verifica se já existe um veículo com a mesma placa
        const veiculoExistente =
            this.buscarPorPlaca(dados.placa);

        if (veiculoExistente) {
            throw new Error(
                "Já existe um veículo com essa placa"
            );
        }

        // Gera um novo id sequencial
        const id = this.repository.gerarId();

        // Cria o objeto veículo
        const novoVeiculo = new Veiculo(
            id,
            dados.placa,
            dados.cor,
            dados.marca
        );

        // Salva no repositório
        this.repository.salvar(novoVeiculo);

        // Retorna o veículo criado
        return novoVeiculo;
    }

    atualizar(id, dados) {

        const veiculo = this.repository.buscarPorId(id);

        if (!veiculo) {
            throw new Error("Veiculo não encontrado");
        }

        // Atualiza a cor somente se ela foi enviada
        if (dados.cor) {
            veiculo.cor = dados.cor;
        }

        // Atualiza a marca somente se ela foi enviada
        if (dados.marca) {
            veiculo.marca = dados.marca;
        }

        // Retorna o veículo atualizado
        return veiculo;
    }

    excluir(id){
        const veiculo = this.repository.buscarPorId(id);
            if (!veiculo) {
            throw new Error("Veiculo não encontrado");
        }

        
    }
}

module.exports = VeiculoService;