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
  const { nombre, dni, telefono, email, fecha_nacimiento, sexo, obra_social } = req.body;

  if (!nombre || !dni) {
    return res.status(400).json({ message: "Nombre y DNI son obligatorios." });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO pacientes (nombre, dni, telefono, email, fecha_nacimiento, sexo, obra_social)
       VALUES (?, ?, ?, ?, ?, ?,?)`,
      [nombre, dni, telefono, email, fecha_nacimiento, sexo, obra_social]
    );

    res.status(201).json({ message: "Paciente creado", pacienteId: result.insertId });
  } catch (err) {
    console.error("Error al crear paciente:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};
const obtenerPacientes = async (req, res) => {
  const { obra_social, edad, sexo } = req.query;

  let query = `
    SELECT 
      id, 
      nombre AS name,
      DATE_FORMAT(fecha_nacimiento, '%d/%m/%Y') AS birthDate,
      TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) AS age,
      obra_social AS insurance,
      sexo
    FROM pacientes
    WHERE 1=1
  `;

  const params = [];

  if (obra_social) {
    query += " AND obra_social = ?";
    params.push(obra_social);
  }

  if (sexo) {
    query += " AND sexo = ?";
    params.push(sexo);
  }

  if (edad === "asc") {
    query += " ORDER BY TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) ASC";
  } else if (edad === "desc") {
    query += " ORDER BY TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) DESC";
  } else {
    query += " ORDER BY nombre ASC";
  }

  try {
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener pacientes filtrados:", err);
    res.status(500).json({ message: "Error del servidor al obtener pacientes" });
  }
};



module.exports = { buscarPacientesPorNombre, crearPaciente, obtenerPacientes };
