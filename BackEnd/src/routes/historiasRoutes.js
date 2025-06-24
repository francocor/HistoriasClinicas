const express = require("express");
const router = express.Router();
const {
  crearHistoriaClinica,
  obtenerHistoriasPorPaciente,
  obtenerHistoriasPorDoctor
} = require("../controllers/historiasController");

router.post("/", crearHistoriaClinica);
router.get("/paciente/:pacienteId", obtenerHistoriasPorPaciente);
router.get("/doctor/:doctorId", obtenerHistoriasPorDoctor);

module.exports = router;
