const express = require("express");
const router = express.Router();
const { login, registrarUsuario, obtenerUsuarios, actualizarUsuario, borrarUsuario } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", registrarUsuario);

// Obtener todos los usuarios
router.get("/usuarios", obtenerUsuarios);
router.put("/usuarios/:id", actualizarUsuario);
router.delete("/usuarios/:id", borrarUsuario)


module.exports = router;