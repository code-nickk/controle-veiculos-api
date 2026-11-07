const express = require("express");
const VeiculoRepository = require("../repositories/veiculoRepository");
const VeiculoService = require("../services/veiculoService");
const VeiculoController = require("../controllers/veiculoController");



const router = express.Router();

// Monta a cadeia de dependências uma única vez:
// repository -> service -> controller
const repository = new VeiculoRepository();
const service = new VeiculoService(repository);
const controller = new VeiculoController(service);

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
module.exports = router;