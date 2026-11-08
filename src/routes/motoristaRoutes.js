const express = require("express");
const MotoristaRepository = require("../repositories/motoristaRepository");
const MotoristaService = require("../services/motoristaService");
const MotoristaController = require("../controllers/motoristaController");

const router = express.Router();

// Monta a cadeia de dependências uma única vez:
// repository -> service -> controller
const repository = new MotoristaRepository();
const service = new MotoristaService(repository);
const controller = new MotoristaController(service);

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.post("/", controller.criar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.excluir);

module.exports = router;