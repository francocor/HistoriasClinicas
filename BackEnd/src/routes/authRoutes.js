const express = require("express");
const router = express.Router();
const { login, registrarUsuario, obtenerUsuarios, actualizarUsuario } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", registrarUsuario);

// Obtener todos los usuarios
router.get("/usuarios", obtenerUsuarios);
router.put("/usuarios/:id", actualizarUsuario);


module.exports = router;