const db = require("../config/db");

const obtenerProfesionales = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        u.id, u.name, p.avatar, p.nacimiento, p.telefono, p.horarios, 
        p.obras_sociales AS obrasSociales, p.plus, p.particular, p.matricula
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

module.exports = {
  obtenerProfesionales,
};
