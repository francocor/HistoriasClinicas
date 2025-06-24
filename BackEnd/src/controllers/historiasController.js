const db = require("../config/db");

const crearHistoriaClinica = async (req, res) => {
  const {
    turno_id,
    paciente_id,
    doctor_id,
    fecha,
    motivo,
    sintomas,
    parametros,
    diagnostico,
    tratamiento,
    medicamentos
  } = req.body;

  if (!turno_id || !paciente_id || !doctor_id || !fecha || !motivo || !sintomas || !diagnostico || !tratamiento) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    await db.execute(
      `INSERT INTO historias_clinicas 
        (turno_id, paciente_id, doctor_id, fecha, motivo, sintomas, parametros, diagnostico, tratamiento, medicamentos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [turno_id, paciente_id, doctor_id, fecha, motivo, sintomas, parametros, diagnostico, tratamiento, medicamentos]
    );

    res.status(201).json({ message: "Historia clínica registrada correctamente" });
  } catch (error) {
    console.error("Error al guardar historia clínica:", error);
    res.status(500).json({ message: "Error al guardar historia clínica" });
  }
};
const obtenerHistoriasPorPaciente = async (req, res) => {
  const { pacienteId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT hc.*, p.nombre AS paciente, u.name AS doctor
       FROM historias_clinicas hc
       JOIN pacientes p ON hc.paciente_id = p.id
       JOIN profesionales pr ON hc.doctor_id = pr.id
       JOIN users u ON pr.user_id = u.id
       WHERE hc.paciente_id = ?
       ORDER BY hc.fecha DESC`,
      [pacienteId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener historias por paciente:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const obtenerHistoriasPorDoctor = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT hc.*, p.nombre AS paciente, u.name AS doctor
       FROM historias_clinicas hc
       JOIN pacientes p ON hc.paciente_id = p.id
       JOIN profesionales pr ON hc.doctor_id = pr.id
       JOIN users u ON pr.user_id = u.id
       WHERE hc.doctor_id = ?
       ORDER BY hc.fecha DESC`,
      [doctorId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener historias por doctor:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};


module.exports = {
  crearHistoriaClinica,
  obtenerHistoriasPorPaciente,
  obtenerHistoriasPorDoctor
};
