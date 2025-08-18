const express = require("express");
const router = express.Router();
const { login, registrarUsuario, obtenerUsuarios, actualizarUsuario, borrarUsuario, resetPasswordUsuario, changeOwnPassword  } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", registrarUsuario);

// Obtener todos los usuarios
router.get("/usuarios", obtenerUsuarios);
router.put("/usuarios/:id", actualizarUsuario);
router.delete("/usuarios/:id", borrarUsuario)
router.put(
  '/usuarios/:id/reset-password',
  resetPasswordUsuario
);
router.put("/me/password", /*requireAuth,*/ changeOwnPassword);


module.exports = router;