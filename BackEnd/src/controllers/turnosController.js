const db = require("../config/db");

const crearTurno = async (req, res) => {
  const { paciente_id, fecha, doctor_nombre, creado_por } = req.body;

  if (!paciente_id || !fecha || !doctor_nombre || !creado_por) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    await db.execute(
      "INSERT INTO turnos (paciente_id, fecha, doctor_nombre, creado_por) VALUES (?, ?, ?, ?)",
      [paciente_id, fecha, doctor_nombre, creado_por]
    );

    res.status(201).json({ message: "Turno creado correctamente" });
  } catch (err) {
    console.error("Error al crear turno:", err);
    res.status(500).json({ message: "Error al crear el turno" });
  }
};

module.exports = { crearTurno };
