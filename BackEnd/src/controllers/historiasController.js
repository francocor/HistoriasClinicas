const db = require("../config/db");

// ✅ Crear historia clínica con archivo opcional
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

  // Obtener archivo si existe
  const archivo = req.file ? req.file.buffer : null;
  const nombreArchivo = req.file ? req.file.originalname : null;
  const tipoArchivo = req.file ? req.file.mimetype : null;

  if (!turno_id || !paciente_id || !doctor_id || !fecha || !motivo || !sintomas || !diagnostico || !tratamiento) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    await db.execute(
      `INSERT INTO historias_clinicas 
        (turno_id, paciente_id, doctor_id, fecha, motivo, sintomas, parametros, diagnostico, tratamiento, medicamentos, archivo, nombre_archivo, tipo_archivo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        turno_id,
        paciente_id,
        doctor_id,
        fecha,
        motivo,
        sintomas,
        parametros || null,
        diagnostico,
        tratamiento,
        medicamentos || null,
        archivo,
        nombreArchivo,
        tipoArchivo
      ]
    );

    res.status(201).json({ message: "Historia clínica registrada correctamente" });
  } catch (error) {
    console.error("Error al guardar historia clínica:", error);
    res.status(500).json({ message: "Error al guardar historia clínica" });
  }
};

// ✅ Obtener historias por paciente
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
const obtenerArchivosPorPaciente = async (req, res) => {
  const { pacienteId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT hc.*, p.nombre AS paciente, u.name AS doctor
       FROM historias_clinicas hc
       JOIN pacientes p ON hc.paciente_id = p.id
       JOIN profesionales pr ON hc.doctor_id = pr.id
       JOIN users u ON pr.user_id = u.id
       WHERE hc.paciente_id = ?
       and hc.archivo is not null
       ORDER BY hc.fecha DESC`,
      [pacienteId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener historias por paciente:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};


// ✅ Obtener historias por doctor
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
  obtenerHistoriasPorDoctor,
  obtenerArchivosPorPaciente
};
