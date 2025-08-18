const express = require("express");
const router = express.Router();
const { listarFacturacion } = require("../controllers/facturacionController");



router.get("/", listarFacturacion);

module.exports = router;
