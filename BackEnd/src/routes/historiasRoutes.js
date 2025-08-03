const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { crearHistoriaClinica, obtenerHistoriasPorPaciente, obtenerHistoriasPorDoctor } = require("../controllers/historiasController");

router.post("/", upload.single("archivo"), crearHistoriaClinica);
router.get("/paciente/:pacienteId", obtenerHistoriasPorPaciente);
router.get("/doctor/:doctorId", obtenerHistoriasPorDoctor);

module.exports = router;
