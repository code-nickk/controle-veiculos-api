const express = require("express");
const { utilizacaoController } = require("../container");

const router = express.Router();

router.post("/", utilizacaoController.iniciar);
router.patch("/:id/finalizar", utilizacaoController.finalizar);
router.get("/", utilizacaoController.listar);

module.exports = router;