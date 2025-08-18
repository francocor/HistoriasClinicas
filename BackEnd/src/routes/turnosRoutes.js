const express = require("express");
const router = express.Router();
const {obtenerTurnosAtendidosPorDoctor, crearTurno, obtenerTurnosProximos, actualizarTurno, obtenerTurnosDelDia, obtenerObrasSociales  } = require("../controllers/turnosController");

router.get("/proximos", obtenerTurnosProximos);
router.post("/", crearTurno);
router.put("/:id", actualizarTurno);
router.get("/vistos/:doctor", obtenerTurnosAtendidosPorDoctor);
router.get("/hoy/:doctorId", obtenerTurnosDelDia);
router.get("/obras-sociales", obtenerObrasSociales);


module.exports = router;
