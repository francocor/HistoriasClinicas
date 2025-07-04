const express = require("express");
const router = express.Router();
const {obtenerTurnosAtendidosPorDoctor, crearTurno, obtenerTurnosProximos, actualizarTurno  } = require("../controllers/turnosController");

router.get("/proximos", obtenerTurnosProximos);
router.post("/", crearTurno);
router.put("/:id", actualizarTurno);
router.get("/vistos/:doctor", obtenerTurnosAtendidosPorDoctor);



module.exports = router;
