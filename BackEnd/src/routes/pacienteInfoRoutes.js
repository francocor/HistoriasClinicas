const express = require("express");
const router = express.Router();
const {
  crearPacienteInfoExistente,
  crearPacienteYInfo,
} = require("../controllers/pacienteInfoController");

// Paciente existente → requiere paciente_id
router.post("/existente", crearPacienteInfoExistente);

// Paciente nuevo → crea paciente + pacienteInfo (transacción)
router.post("/nuevo", crearPacienteYInfo);

module.exports = router;