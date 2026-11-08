// Cria uma única vez todos os repositories, services e controllers,
// para que as rotas compartilhem as mesmas instâncias (e os mesmos dados em memória).
const VeiculoRepository = require("./repositories/veiculoRepository");
const VeiculoService = require("./services/veiculoService");
const VeiculoController = require("./controllers/veiculoController");

const MotoristaRepository = require("./repositories/motoristaRepository");
const MotoristaService = require("./services/motoristaService");
const MotoristaController = require("./controllers/motoristaController");

const UtilizacaoRepository = require("./repositories/utilizacaoRepository");
const UtilizacaoService = require("./services/utilizacaoService");
const UtilizacaoController = require("./controllers/utilizacaoController");

const veiculoService = new VeiculoService(new VeiculoRepository());
const motoristaService = new MotoristaService(new MotoristaRepository());
const utilizacaoService = new UtilizacaoService(
    new UtilizacaoRepository(),
    veiculoService,
    motoristaService
);

module.exports = {
    veiculoController: new VeiculoController(veiculoService),
    motoristaController: new MotoristaController(motoristaService),
    utilizacaoController: new UtilizacaoController(utilizacaoService)
};