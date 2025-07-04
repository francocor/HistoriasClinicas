const express = require("express");
const router = express.Router();
const { buscarPacientesPorNombre,crearPaciente, obtenerPacientes } = require("../controllers/pacientesController");

router.get("/buscar", buscarPacientesPorNombre);
router.post("/", crearPaciente);
router.get("/", obtenerPacientes);

module.exports = router;