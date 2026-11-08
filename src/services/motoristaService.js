const Motorista = require("../models/motorista");
const NaoEncontradoError = require("../errors/NaoEncontradoError");
const ValidacaoError = require("../errors/ValidacaoError");
const ConflitoError = require("../errors/ConflitoError");
const textoValido = require("../utils/textoValido");

// Regras de negócio do cadastro de motoristas
// Recebe o repository pelo construtor (injeção de dependência)

class MotoristaService {

    constructor(repository) {
        this.repository = repository;
    }

    // Lista os motoristas.
    // Os filtros ignoram maiúsculas/minúsculas.
    // Buscar parcial funciona, se buscarem ana aparecerar também mariana
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

    // Valida se foi colocado o nome e sobrenome, barra nomes duplicados
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

    // Excluir um motorista; lança erro 404 se ele não existir
    excluir(id) {
        this.buscarPorId(id);
        this.repository.excluir(id);
    }
}

module.exports = MotoristaService;