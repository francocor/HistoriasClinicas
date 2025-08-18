const db = require("../config/db");

const obtenerProfesionales = async (req, res) => {
  try {
    const [rows] = await db.execute(`
       SELECT 
        p.id AS profesional_id,        
        u.id AS user_id,                
        u.name,                         
        p.avatar,
        p.nacimiento,
        p.telefono,
        p.especialidad,                
        p.obras_sociales AS obrasSociales,
        p.plus,
        p.particular,
        p.matricula
      FROM users u
      JOIN profesionales p ON u.id = p.user_id
      WHERE u.role = 'profesional'
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener profesionales:", err);
    res.status(500).json({ message: "Error al obtener profesionales" });
  }
};
const obtenerProfesionalPorUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(`
       
       SELECT p.id, p.user_id, u.name AS nombre_completo, p.especialidad
      FROM profesionales p
      JOIN users u ON u.id = p.user_id
      WHERE p.user_id = ?
      LIMIT 1
    `, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Profesional no encontrado" });
    }

    res.json(rows[0]); // Devuelve solo uno
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener profesional" });
  }
};
async function getProfesionalMe(req, res) {
  try {
    // req.user.id es el id de la tabla users
    // si no tenés auth, podés leerlo de un query param por ahora
    const {user_id} = req.params
    if (!user_id) return res.status(400).json({ error: 'userId requerido' });

    const [rows] = await db.query(
      'SELECT p.id, p.user_id, u.name AS nombre_completo, p.especialidad FROM profesionales p JOIN users u ON u.id = p.user_id WHERE p.user_id = ? LIMIT 1',
      [user_id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Profesional no encontrado' });
    res.json({ id: rows[0].id, user_id: rows[0].user_id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
}
async function listProfesionales(req, res) {
  try {
    // opcional: ?fields=id,name para devolver liviano
    const fields = (req.query.fields || '').split(',').map(s => s.trim());
    const onlyIdName = fields.includes('id') && fields.includes('name') && fields.length === 2;

    if (onlyIdName) {
      const [rows] = await db.query(`
        SELECT pr.id, u.name
        FROM profesionales pr
        JOIN users u ON u.id = pr.user_id
        ORDER BY u.name ASC
      `);
      return res.json(rows);
    }

    const [rows] = await db.query(`
      SELECT pr.*, u.name, u.role
      FROM profesionales pr
      JOIN users u ON u.id = pr.user_id
      ORDER BY u.name ASC
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
}
module.exports = {
  obtenerProfesionales,obtenerProfesionalPorUserId, getProfesionalMe, listProfesionales
};
