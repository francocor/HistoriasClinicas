const express = require("express");
const router = express.Router();
const { buscarPacientesPorNombre,crearPaciente } = require("../controllers/pacientesController");

router.get("/buscar", buscarPacientesPorNombre);
router.post("/", crearPaciente);


module.exports = router;