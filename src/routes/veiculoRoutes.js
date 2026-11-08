const express = require("express");

const router = express.Router();

// Monta a cadeia de dependências uma única vez:
// repository -> service -> controller
const { veiculoController } = require("../container");

router.get("/", veiculoController.listar);
router.get("/:id", veiculoController.buscarPorId);
router.post("/", veiculoController.criar);
router.put("/:id", veiculoController.atualizar);
router.delete("/:id", veiculoController.excluir);

module.exports = router;