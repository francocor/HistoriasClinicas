const express = require("express");
const router = express.Router();
const { buscarPacientesPorNombre,crearPaciente, obtenerPacientes,obtenerPacientePorId, exportarExcelPacienteVista } = require("../controllers/pacientesController");

router.get("/buscar", buscarPacientesPorNombre);
router.post("/", crearPaciente);
router.get("/", obtenerPacientes);
router.get("/:id", obtenerPacientePorId);
router.get("/descargar-excel/:id", exportarExcelPacienteVista);



module.exports = router;