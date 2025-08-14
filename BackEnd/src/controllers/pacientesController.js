const db = require("../config/db");
const ExcelJS = require("exceljs");

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
const obtenerPacientePorId = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [rows] = await db.query(
      "SELECT * FROM pacientes WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener paciente por ID:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};
const exportarExcelPacienteVista = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const conn = await db.getConnection();
  try {
    // Consultamos la vista (asegurate de haber creado vw_paciente_con_info)
    const [rows] = await conn.query(
      `SELECT * FROM vw_paciente_con_info WHERE paciente_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No hay datos para ese paciente" });
    }

    // Armar workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Ficha Paciente");

    // Columnas dinámicas según la vista
    const columns = Object.keys(rows[0]).map((key) => ({
      header: key, // podés mapear a títulos lindos si querés
      key,
      width: Math.min(Math.max(String(key).length + 2, 14), 40), // ancho razonable
    }));
    sheet.columns = columns;

    // Estilo de header
    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 1 }];

    // Filas
    rows.forEach((r) => sheet.addRow(r));

    // Content-Type y descarga
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="ficha_paciente_${id}.xlsx"`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error exportando Excel:", err);
    res.status(500).json({ error: "Error al generar Excel" });
  } finally {
    conn.release();
  }
};



module.exports = { buscarPacientesPorNombre, crearPaciente, obtenerPacientes,obtenerPacientePorId, exportarExcelPacienteVista };
