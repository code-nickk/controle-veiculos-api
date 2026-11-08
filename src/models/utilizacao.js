// Classe responsável por representar uma utilização do sistema
class Utilizacao {
    constructor(id, motoristaId, veiculoId, motivo) {
        this.id = id;
        this.motoristaId = motoristaId;
        this.veiculoId = veiculoId;
        this.motivo = motivo;
        this.dataInicio = new Date();
        this.dataFim = null;
    }
}

module.exports = Utilizacao;