const db = require("../config/db");

const actualizarEstadoAsistencia = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ message: "Falta el estado de asistencia" });
  }

  try {
    const [result] = await db.execute(
      `UPDATE turnos SET estado_asistencia = ? WHERE id = ?`,
      [estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Turno no encontrado" });
    }

    res.status(200).json({ message: "Asistencia registrada correctamente" });
  } catch (err) {
    console.error("Error al actualizar asistencia:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};
const obtenerAsistenciasPresentes = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
  t.id, 
  t.estado_asistencia AS estado, 
  t.fecha AS appointmentDate,
  t.paciente_id AS patientId,
  p.nombre AS patientName,
  t.doctor_id AS doctorId,
  u.name AS doctorName,
  pr.especialidad AS especialidad
FROM turnos t
JOIN pacientes p ON t.paciente_id = p.id
JOIN profesionales pr ON t.doctor_id = pr.id
JOIN users u ON pr.user_id = u.id
WHERE t.estado_atencion IS NULL
  AND t.estado_asistencia is NULL 
  AND t.fecha >= CURDATE()
ORDER BY t.fecha ASC;
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener asistencias presentes:", err);
    res.status(500).json({ message: "Error al obtener asistencias" });
  }
};



module.exports = { actualizarEstadoAsistencia, obtenerAsistenciasPresentes };
