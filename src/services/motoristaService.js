const Motorista = require("../models/motorista");
const NaoEncontradoError = require("../errors/NaoEncontradoError");
const ValidacaoError = require("../errors/ValidacaoError");
const ConflitoError = require("../errors/ConflitoError");
const textoValido = require("../utils/textoValido");

// Gerencia as regras de negócio dos motoristas.
// O primeiro nome pode se repetir, mas o nome completo não pode ser duplicado.

class MotoristaService {

    constructor(repository) {
        this.repository = repository;
    }

    // Lista motoristas, permitindo filtros por nome.
    // Permite busca parcial ignorando maiúsculas e minúsculas.  
    listar(filtros = {}) {
        let motoristas = this.repository.listar();

        if (filtros.nome) {
            motoristas = motoristas.filter(
                motorista => motorista.nome.trim().toLowerCase().includes(filtros.nome.trim().toLowerCase())
            );
        }

        return motoristas;
    }

    // Busca um motorista pelo id; lança erro 404 se não existir
    buscarPorId(id) {
        const motorista = this.repository.buscarPorId(id);

        if (!motorista) {
            throw new NaoEncontradoError("Motorista não encontrado");
        }

        return motorista;
    }

    // Cria um novo motorista
    criar(dados = {}) {
        this.validarNome(dados.nome);

        const id = this.repository.gerarId();
        const novoMotorista = new Motorista(id, dados.nome.trim());

        this.repository.salvar(novoMotorista);

        return novoMotorista;
    }

    // Valida o nome e impedir duplicidade.
    // O idAtual identifica o motorista que está sendo atualizado,
    // evitando que ele seja considerado duplicado de si mesmo.
    validarNome(nome, idAtual) {
        if (!textoValido(nome)) {
            throw new ValidacaoError("O nome é obrigatório");
        }

        if (nome.trim().split(/\s+/).length < 2) {
            throw new ValidacaoError("Informe nome e sobrenome");
        }

        const existente = this.repository.buscarPorNome(nome.trim());

        if (existente && existente.id !== idAtual) {
            throw new ConflitoError("Já existe um motorista com esse nome completo");
        }
    }

    // Atualiza os dados do motorista (nome)
    atualizar(id, dados = {}) {
        const motorista = this.buscarPorId(id);

        this.validarNome(dados.nome, id);

        motorista.nome = dados.nome.trim();

        return motorista;
    }

    // Exclui um motorista; lança erro 404 se ele não existir
    excluir(id) {
        this.buscarPorId(id);
        this.repository.excluir(id);
    }
}

module.exports = MotoristaService;