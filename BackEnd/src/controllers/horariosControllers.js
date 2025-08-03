const db = require("../config/db");

const obtenerHorarios = async (req,res) => {
     const { profesional_id } = req.params;
  const [rows] = await db.query(`
    SELECT dia_semana, hora_entrada, hora_salida 
    FROM profesional_horarios
    WHERE profesional_id = ?
  `, [profesional_id]);
  res.json(rows);
}

module.exports= {obtenerHorarios}