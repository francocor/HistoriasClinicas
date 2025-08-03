const express = require("express");
const router = express.Router();
const {obtenerHorarios}= require("../controllers/horariosControllers")

router.get("/:profesional_id", obtenerHorarios)

module.exports=router