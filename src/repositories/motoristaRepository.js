// Responsável por armazenar os motoristas em memória

class MotoristaRepository {

    constructor() {
        this.motoristas = [];
        this.proximoId = 1;
    }

    // Gera um ID sequencial para cada cadastro de motoristas
    gerarId() {
        return this.proximoId++;
    }

    // Salva um motorista
    salvar(motorista) {
        this.motoristas.push(motorista);

        return motorista;
    }

    // Gera uma lista com todos os motoristas
    listar() {
        return this.motoristas;
    }

    // Busca um motorista pelo id
    buscarPorId(id) {
        return this.motoristas.find(
            motorista => motorista.id === id
        );
    }

    // Busca um motorista pelo nome
    buscarPorNome(nome) {
        return this.motoristas.find(
            motorista => motorista.nome.trim().toLowerCase() === nome.trim().toLowerCase()
        );
    }

    // Remove um motorista com base no seu id na lista
    excluir(id) {
        this.motoristas = this.motoristas.filter(
            motorista => motorista.id !== id
        );
    }
}

module.exports = MotoristaRepository;