const db = require("../config/db");

const buscarPacientesPorNombre = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Consulta vacía" });
  }

  try {
    const [rows] = await db.execute(
      `SELECT id, nombre, dni, obra_social FROM pacientes WHERE nombre LIKE ? LIMIT 10`,
      [`%${q}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al buscar pacientes:", err);
    res.status(500).json({ message: "Error al buscar pacientes" });
  }
};

const crearPaciente = async (req, res) => {
  const { nombre, dni, telefono, email, fecha_nacimiento, obra_social } = req.body;

  if (!nombre || !dni) {
    return res.status(400).json({ message: "Nombre y DNI son obligatorios." });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO pacientes (nombre, dni, telefono, email, fecha_nacimiento, obra_social)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, dni, telefono, email, fecha_nacimiento, obra_social]
    );

    res.status(201).json({ message: "Paciente creado", pacienteId: result.insertId });
  } catch (err) {
    console.error("Error al crear paciente:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};


module.exports = { buscarPacientesPorNombre, crearPaciente };
