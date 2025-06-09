const express = require("express");
const router = express.Router();
const { actualizarEstadoAsistencia, obtenerAsistenciasPresentes } = require("../controllers/asistenciasController");

router.put("/:id", actualizarEstadoAsistencia);
router.get("/presentes", obtenerAsistenciasPresentes);


module.exports = router;