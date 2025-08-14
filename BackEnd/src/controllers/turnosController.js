const db = require("../config/db");

const crearTurno = async (req, res) => {
  const { paciente_id, fecha, doctor_id, especialidad, creado_por } = req.body;

  if (!paciente_id || !fecha || !doctor_id || !creado_por) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  const fechaTurno = new Date(fecha);
  const hoy = new Date();
  if (fechaTurno < hoy) {
    return res.status(400).json({ message: "La fecha no puede ser anterior a hoy" });
  }

  try {
    // Verificar existencia del doctor
    const [[existeDoctor]] = await db.query(
      "SELECT id FROM profesionales WHERE id = ?",
      [doctor_id]
    );

    if (!existeDoctor) {
      return res.status(400).json({ message: "El doctor seleccionado no existe" });
    }

    // Insertar el turno
    const [result] = await db.execute(
      `INSERT INTO turnos (paciente_id, fecha, doctor_id, especialidad, creado_por)
       VALUES (?, ?, ?, ?, ?)`,
      [paciente_id, fecha, doctor_id, especialidad, creado_por]
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
    t.doctor_id AS doctor,
    t.especialidad as especialidad
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
  const { paciente_nombre, fecha, doctor_id, especialidad } = req.body;

  if (!paciente_nombre || !fecha || !doctor_id) {
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
       SET paciente_id = ?, fecha = ?, doctor_id = ?, especialidad=?
       WHERE id = ?`,
      [paciente_id, fecha, doctor_id, especialidad, id]
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
        t.especialidad as especialidad
      FROM turnos t
      JOIN pacientes p ON t.paciente_id = p.id
      WHERE t.estado_atencion = 'atendido'
        AND t.doctor_id = ?
      ORDER BY t.fecha DESC
      LIMIT 3
    `, [doctor]);

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error al obtener turnos atendidos:", err);
    res.status(500).json({ message: "Error del servidor al buscar turnos atendidos" });
  }
};


const obtenerTurnosDelDia = async (req, res) => {
  const doctorId = req.params.doctorId;

  try {
    const [rows] = await db.query(
      `SELECT 
         t.id,
         t.fecha,
         p.nombre AS paciente
       FROM turnos t
       JOIN pacientes p ON t.paciente_id = p.id
       WHERE DATE(t.fecha) = CURDATE() AND t.doctor_id = ?
       ORDER BY t.fecha ASC`,
      [doctorId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener turnos del día:", error);
    res.status(500).json({ message: "Error al obtener turnos del día" });
  }
};

module.exports = {obtenerTurnosAtendidosPorDoctor, crearTurno, obtenerTurnosProximos, actualizarTurno, obtenerTurnosDelDia };
