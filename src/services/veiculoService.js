const Veiculo = require("../models/veiculo");
const NaoEncontradoError = require("../errors/NaoEncontradoError");
const ValidacaoError = require("../errors/ValidacaoError");
const ConflitoError = require("../errors/ConflitoError");
const textoValido = require("../utils/textoValido");

// Regras de negócio do cadastro de veículos.
// Recebe o repository pelo construtor (injeção de dependência),
// assim o service não precisa saber onde os dados são guardados.
class VeiculoService {

    constructor(repository) {
        this.repository = repository;
    }

   
    // Lista os veículos, com filtros opcionais por cor e/ou marca.
    // Os filtros ignoram maiúsculas/minúsculas e podem ser combinados.
    listar(filtros = {}) {
        let veiculos = this.repository.listar();

        if (filtros.cor) {
            veiculos = veiculos.filter(
                veiculo => veiculo.cor.toLowerCase() === filtros.cor.toLowerCase()
            );
        }

        if (filtros.marca) {
            veiculos = veiculos.filter(
                veiculo => veiculo.marca.toLowerCase() === filtros.marca.toLowerCase()
            );
        }

        return veiculos;
    }

    // Busca um veículo pelo id; lança erro 404 se não existir
    buscarPorId(id) {
        const veiculo = this.repository.buscarPorId(id);

        if (!veiculo) {
            throw new NaoEncontradoError("Veículo não encontrado");
        }

        return veiculo;
    }

    // Busca um veículo pela placa (devolve undefined se não existir).
    // Espera receber a placa já padronizada.
    buscarPorPlaca(placa) {
        return this.repository.buscarPorPlaca(placa);
    }

    // Cria um novo veículo
    criar(dados = {}) {

        // Valida os campos obrigatórios
        if (!textoValido(dados.placa)) {
            throw new ValidacaoError("A placa é obrigatória");
        }

        if (!textoValido(dados.cor)) {
            throw new ValidacaoError("A cor é obrigatória");
        }

        if (!textoValido(dados.marca)) {
            throw new ValidacaoError("A marca é obrigatória");
        }

        // Padroniza a placa (sem espaços e em maiúsculas),
        // para que "abc1234 " e "ABC1234" sejam tratadas como a mesma placa
        const placa = dados.placa.trim().toUpperCase();

        // Verifica se já existe um veículo com a mesma placa
        if (this.buscarPorPlaca(placa)) {
            throw new ConflitoError("Já existe um veículo com essa placa");
        }

        // Gera um novo id sequencial
        const id = this.repository.gerarId();

        // Cria o objeto veículo
        const novoVeiculo = new Veiculo(
            id,
            placa,
            dados.cor.trim(),
            dados.marca.trim()
        );

        // Salva no repositório e retorna o veículo criado
        this.repository.salvar(novoVeiculo);

        return novoVeiculo;
    }

    // Atualiza cor e/ou marca de um veículo existente.
    // A placa não pode ser alterada, pois é o que identifica o veículo no mundo real.
    atualizar(id, dados = {}) {

        // Lança 404 se o veículo não existir
        const veiculo = this.buscarPorId(id);

        // Atualiza a cor somente se ela foi enviada
        if (textoValido(dados.cor)) {
            veiculo.cor = dados.cor.trim();
        }

        // Atualiza a marca somente se ela foi enviada
        if (textoValido(dados.marca)) {
            veiculo.marca = dados.marca.trim();
        }

        // Retorna o veículo atualizado
        return veiculo;
    }

    // Excluir um veículo; lança erro 404 se ele não existir
    excluir(id) {
        this.buscarPorId(id);
        this.repository.excluir(id);
    }
}

module.exports = VeiculoService;