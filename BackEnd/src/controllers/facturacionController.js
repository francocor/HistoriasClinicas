const db = require("../config/db"); // tu pool/conn de mysql2

// ayuda: users.id → profesionales.id (si existe)
async function getProfesionalIdByUserId(userId) {
  const [[row]] = await db.query(
    "SELECT id FROM profesionales WHERE user_id = ? LIMIT 1",
    [userId]
  );
  return row?.id ?? null;
}

async function listarFacturacion(req, res) {
  try {
    const { role, user_id, doctor_id, desde, hasta, obra_social, estado } = req.query;

    const where = [];
    const params = [];

    // Si role=profesional, necesitamos user_id para limitar a "sus" turnos
    if (role === "profesional") {
      if (!user_id) {
        return res.status(400).json({ message: "Falta user_id para role=profesional" });
      }
      const myProfId = await getProfesionalIdByUserId(Number(user_id));
      if (!myProfId) return res.json([]);

      where.push("profesional_id = ?");
      params.push(myProfId);
    } else {
      // otros roles: si llega doctor_id, filtramos por ese profesional
      if (doctor_id) {
        where.push("profesional_id = ?");
        params.push(Number(doctor_id));
      }
    }

    // Filtros opcionales
    if (desde)       { where.push("fecha >= ?");        params.push(desde); }
    if (hasta)       { where.push("fecha <= ?");        params.push(hasta); }
    if (obra_social) { where.push("obraSocial = ?");    params.push(obra_social); }
    if (estado)      { where.push("estado = ?");        params.push(estado); }

    const sql = `
      SELECT turno_id, profesional_id, profesional, fecha, paciente_id, paciente,
             dni, obraSocial, practica, cobro, estado
      FROM vw_facturacion_turnos
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY fecha DESC, turno_id DESC
    `;

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error("listarFacturacion", e);
    res.status(500).json({ message: "Error al listar facturación" });
  }
}

module.exports = { listarFacturacion};
