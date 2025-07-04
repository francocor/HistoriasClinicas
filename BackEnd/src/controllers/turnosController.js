const db = require("../config/db");

const crearTurno = async (req, res) => {
  const { paciente_id, fecha, doctor_nombre, creado_por } = req.body;

  if (!paciente_id || !fecha || !doctor_nombre || !creado_por) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  const fechaTurno = new Date(fecha);
  const hoy = new Date();
  if (fechaTurno < hoy) {
    return res.status(400).json({ message: "La fecha no puede ser anterior a hoy" });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO turnos (paciente_id, fecha, doctor_nombre, creado_por)
       VALUES (?, ?, ?, ?)`,
      [paciente_id, fecha, doctor_nombre, creado_por]
    );
    res.status(201).json({ message: "Turno creado", turnoId: result.insertId });
  } catch (err) {
    console.error("Error al crear turno:", err);
    res.status(500).json({ message: "Error al crear turno" });
  }
};
const obtenerTurnosProximos = async (req, res) => {
  try {
    const [rows] = await db.execute(`
        SELECT 
    t.id, 
    t.paciente_id AS patientId, 
    p.nombre AS patientName, 
    t.fecha AS appointmentDate, 
    t.doctor_nombre AS doctor
  FROM turnos t
  JOIN pacientes p ON t.paciente_id = p.id
  WHERE t.fecha >= NOW()
  ORDER BY t.fecha ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener turnos:", err);
    res.status(500).json({ message: "Error al obtener turnos" });
  }
};
const actualizarTurno = async (req, res) => {
  const { id } = req.params;
  const { paciente_nombre, fecha, doctor_nombre } = req.body;

  if (!paciente_nombre || !fecha || !doctor_nombre) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  // Validar que la fecha no sea anterior a hoy
  const fechaIngresada = new Date(fecha);
  const ahora = new Date();
  ahora.setHours(0, 0, 0, 0); // Limpiar hora

  if (fechaIngresada < ahora) {
    return res.status(400).json({ message: "La fecha no puede ser anterior a hoy" });
  }

  try {
    // Buscar ID del paciente
    const [paciente] = await db.execute(
      "SELECT id FROM pacientes WHERE nombre = ? LIMIT 1",
      [paciente_nombre]
    );

    if (paciente.length === 0) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    const paciente_id = paciente[0].id;

    // Actualizar turno
    await db.execute(
      `UPDATE turnos
       SET paciente_id = ?, fecha = ?, doctor_nombre = ?
       WHERE id = ?`,
      [paciente_id, fecha, doctor_nombre, id]
    );

    res.json({ message: "Turno actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar turno:", error);
    res.status(500).json({ message: "Error al actualizar el turno" });
  }
};
const obtenerTurnosAtendidosPorDoctor = async (req, res) => {
  const doctor = decodeURIComponent(req.params.doctor); // por si tiene espacios o tildes

  try {
    const [rows] = await db.execute(`
      SELECT 
        t.id,
        t.fecha,
        p.nombre AS name,
        TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) AS age,
        DATE_FORMAT(p.fecha_nacimiento, '%d/%m/%Y') AS birthDate,
        p.obra_social AS socialSecurity
      FROM turnos t
      JOIN pacientes p ON t.paciente_id = p.id
      WHERE t.estado_atencion = 'atendido'
        AND t.doctor_nombre = ?
      ORDER BY t.fecha DESC
      LIMIT 3
    `, [doctor]);

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error al obtener turnos atendidos:", err);
    res.status(500).json({ message: "Error del servidor al buscar turnos atendidos" });
  }
};


module.exports = {obtenerTurnosAtendidosPorDoctor, crearTurno, obtenerTurnosProximos, actualizarTurno };
