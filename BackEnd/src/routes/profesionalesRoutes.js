const express = require("express");
const router = express.Router();
const { obtenerProfesionales, obtenerProfesionalPorUserId, getProfesionalMe,listProfesionales } = require("../controllers/profesionalesController");

router.get("/", obtenerProfesionales);
router.get("/by-user/:user_id", obtenerProfesionalPorUserId)
router.get('/me/:user_id', /*requireAuth,*/ getProfesionalMe);
router.get("/profesionalFields", listProfesionales);

module.exports = router;
