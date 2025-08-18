const express = require("express");
const router = express.Router();
const {obtenerHorarios, putHorariosBulk, getHorarios}= require("../controllers/horariosControllers")

router.get("/:profesional_id", obtenerHorarios)
router.put('/bulk', /*requireAuth,*/ putHorariosBulk);
router.get('/', /*requireAuth,*/ getHorarios);

module.exports=router