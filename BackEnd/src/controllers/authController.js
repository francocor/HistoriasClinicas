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
      role.toLowerCase() === "profesional" || (role.toLowerCase() === "admin" && matricula && matricula.trim() !== "");
    
    if (esProfesional) {
      await db.query(
        `INSERT INTO profesionales (
          user_id, nacimiento, telefono, matricula, especialidad
        ) VALUES (?, ?, ?, ?, ?)`,
        [userId, nacimiento, telefono, matricula.trim(), especialidad || null]
      );
    }

        const [finalUser] = await db.query(`
      SELECT u.id, u.username, u.name, u.role,
            p.matricula, p.especialidad
      FROM users u
      LEFT JOIN profesionales p ON u.id = p.user_id
      WHERE u.id = ?
    `, [userId]);
    res.status(201).json(finalUser[0]);

  } catch (error) {
    console.error("Error al registrar usuario:", error.message, error);
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
const borrarUsuario = async (req, res) => {
   const { id } = req.params;

  try {
    // Si tu db es mysql2/promise con pool:
    const conn = await db.getConnection?.();

    if (conn) {
      try {
        await conn.beginTransaction();
        await conn.query("DELETE FROM profesionales WHERE user_id = ?", [id]);
        const [userResult] = await conn.query("DELETE FROM users WHERE id = ?", [id]);
        await conn.commit();
        conn.release();

        // Si querés devolver info mínima:
        // return res.json({ deleted: userResult.affectedRows > 0 });
        return res.status(204).send(); // sin cuerpo
      } catch (e) {
        await conn.rollback();
        conn.release();
        console.error("Error al borrar usuario (tx):", e);
        return res.status(500).json({ error: "Error al eliminar usuario" });
      }
    }

    // Fallback sin transacción dedicada
    await db.query("DELETE FROM profesionales WHERE user_id = ?", [id]);
    const [userResult] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    // return res.json({ deleted: userResult.affectedRows > 0 });
    return res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({ error: "Error al eliminar usuario" });
  }
       
};
function puedeResetearPassword(reqUser, targetUser) {
  if (!reqUser || !targetUser) return false;
  if (reqUser.id === targetUser.id) return false; // no resetearse a sí mismo
  if (reqUser.role === 'master') {
    return targetUser.role !== 'master';
  }
  if (reqUser.role === 'admin') {
    return !['admin', 'master'].includes(targetUser.role);
  }
  return false;
}

async function resetPasswordUsuario(req, res) {
  try {
    const { id } = req.params;
    const NEW_PASSWORD = (req.body && req.body.newPassword) || '1234';

    // Traer el usuario target para verificar rol
    const [rows] = await db.query('SELECT id, role FROM users WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });

    const targetUser = rows[0];

    // req.user debe existir si usás auth; si no, setearlo stub/omitir chequeo
    if (req.user) {
      if (!puedeResetearPassword(req.user, targetUser)) {
        return res.status(403).json({ error: 'No tenés permisos para esta acción' });
      }
    }

    const hash = await bcrypt.hash(NEW_PASSWORD, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hash, id]);

    return res.status(200).json({ ok: true, id: Number(id) });
  } catch (err) {
    console.error('resetPasswordUsuario error:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}
function validatePassword(pwd) {
  return typeof pwd === "string" && pwd.length >= 8;
}

async function changeOwnPassword(req, res) {
  try {
    const { currentPassword, newPassword, userId: bodyUserId } = req.body || {};
    // Preferimos el id del token:
    const userId = req.user?.id ?? bodyUserId; // ⚠️ quitar bodyUserId en prod

    if (!userId) return res.status(401).json({ error: "No autenticado" });
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Datos incompletos" });
    }
    if (!validatePassword(newPassword)) {
      return res.status(400).json({ error: "La nueva contraseña es demasiado corta" });
    }

    // Traer hash actual
    const [rows] = await db.query("SELECT id, password FROM users WHERE id = ? LIMIT 1", [userId]);
    if (!rows.length) return res.status(404).json({ error: "Usuario no encontrado" });

    const user = rows[0];

    // Comparar contraseña actual
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      return res.status(401).json({ error: "La contraseña actual es incorrecta" });
    }

    // Evitar misma contraseña
    const same = await bcrypt.compare(newPassword, user.password);
    if (same) {
      return res.status(400).json({ error: "La nueva contraseña no puede ser igual a la actual" });
    }

    // Guardar nueva
    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [newHash, userId]);

    return res.json({ ok: true });
  } catch (err) {
    console.error("changeOwnPassword error:", err);
    return res.status(500).json({ error: "Error interno" });
  }
}

module.exports = { login,registrarUsuario, obtenerUsuarios, actualizarUsuario,borrarUsuario, resetPasswordUsuario, changeOwnPassword   };