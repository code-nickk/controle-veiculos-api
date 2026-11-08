const express = require("express");

const router = express.Router();

// Monta a cadeia de dependências uma única vez:
// repository -> service -> controller
const { motoristaController } = require("../container");

router.get("/", motoristaController.listar);
router.get("/:id", motoristaController.buscarPorId);
router.post("/", motoristaController.criar);
router.put("/:id", motoristaController.atualizar);
router.delete("/:id", motoristaController.excluir);

module.exports = router;