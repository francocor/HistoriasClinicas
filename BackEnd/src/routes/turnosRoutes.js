const express = require("express");
const router = express.Router();
const { crearTurno, obtenerTurnosProximos, actualizarTurno  } = require("../controllers/turnosController");

router.get("/proximos", obtenerTurnosProximos);
router.post("/", crearTurno);
router.put("/:id", actualizarTurno);


module.exports = router;
