const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const payload = {
      name: user.name,
      role: user.role,
      id:user.id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

    return res.json({ token, user: payload });

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
const registrarUsuario = async (req, res) => {
  const {
    username, password, nombre, apellido, role,
    nacimiento, telefono, direccion,
    matricula, especialidad
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const nombreCompleto = `${nombre} ${apellido}`;

    // Insertar en tabla users
    const [userResult] = await db.query(
      "INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, nombreCompleto, role]
    );

    const userId = userResult.insertId;

    // Si es profesional o admin con matrícula válida → crear en profesionales
    const esProfesional =
      role === "profesional" || (role === "admin" && matricula && matricula.trim() !== "");

    if (esProfesional) {
      await db.query(
        `INSERT INTO profesionales (
          user_id, nacimiento, telefono, matricula, especialidad
        ) VALUES (?, ?, ?, ?, ?)`,
        [userId, nacimiento, telefono, matricula.trim(), especialidad || null]
      );
    }

    res.status(201).json({ id: userId, username, role, name: nombreCompleto });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};
const obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.id, u.username, u.name, u.role,
             p.matricula, p.especialidad
      FROM users u
      LEFT JOIN profesionales p ON u.id = p.user_id
      ORDER BY u.id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};
// controllers/authController.js
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { name, username, especialidad, matricula } = req.body;

  await db.query("UPDATE users SET username = ?, name = ? WHERE id = ?", [username, name, id]);

  const [exists] = await db.query("SELECT * FROM profesionales WHERE user_id = ?", [id]);

  if (exists.length > 0) {
    await db.query("UPDATE profesionales SET especialidad = ?, matricula = ? WHERE user_id = ?", [
      especialidad || null,
      matricula || null,
      id,
    ]);
  }

  const [updated] = await db.query(
    `SELECT u.id, u.username, u.name, u.role, p.especialidad, p.matricula
     FROM users u
     LEFT JOIN profesionales p ON u.id = p.user_id
     WHERE u.id = ?`,
    [id]
  );

  res.json(updated[0]);
};


module.exports = { login,registrarUsuario, obtenerUsuarios, actualizarUsuario };