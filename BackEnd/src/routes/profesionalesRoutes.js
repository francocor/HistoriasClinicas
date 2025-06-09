const express = require("express");
const router = express.Router();
const { obtenerProfesionales } = require("../controllers/profesionalesController");

router.get("/", obtenerProfesionales);

module.exports = router;
