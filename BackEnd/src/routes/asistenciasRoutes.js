const express = require("express");
const router = express.Router();
const { actualizarEstadoAsistencia, obtenerAsistenciasPresentes, obtenerAsistenciasPresentesPorId } = require("../controllers/asistenciasController");

router.put("/:id", actualizarEstadoAsistencia);
router.get("/presentes", obtenerAsistenciasPresentes);
router.get("/presentesporId/:uId", obtenerAsistenciasPresentesPorId);



module.exports = router;