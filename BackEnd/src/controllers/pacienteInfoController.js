const db = require("../config/db");

// ------------------------
// Helpers de mapeo (INSERT)
// ------------------------
function mapInfoFields(body, paciente_id) {
  return [
    paciente_id,                                // 1
    body.direccion ?? null,                     // 2
    body.edad ?? null,                          // 3
    body.rh ?? null,                            // 4
    body.alergias ?? null,                      // 5
    body.diabetes ?? null,                      // 6
    body.cirugias ?? null,                      // 7
    body.medicamentos ?? null,                  // 8
    body.otras_enfermedades ?? null,            // 9
    body.enf_cardiovasculares ?? null,          // 10
    body.enf_pulmonares ?? null,                // 11
    body.enf_digestivas ?? null,                // 12
    body.enf_renales ?? null,                   // 13
    body.alcohol ?? null,                       // 14
    body.tabaquismo ?? null,                    // 15
    body.drogas ?? null,                        // 16
    body.inmunizaciones ?? null,                // 17
    body.otros_personales ?? null,              // 18
    body.padre ?? null,                         // 19
    body.padre_enfermedades ?? null,            // 20
    body.madre ?? null,                         // 21
    body.madre_enfermedades ?? null,            // 22
    body.hermanos ?? null,                      // 23
    body.hermanos_enfermedades ?? null,         // 24
    body.estado_civil ?? null,                  // 25
    body.nacionalidad ?? null,                  // 26
    body.ocupacion ?? null,                     // 27
  ];
}

// -----------------------------------
// Helpers de mapeo (UPDATE parcial)
// - Convierte ""/undefined -> NULL
// - Usamos COALESCE(?, col) para no pisar con NULL
// -----------------------------------
const emptyToNull = (v) => (v === "" || v === undefined ? null : v);

function mapInfoFieldsForUpdate(body) {
  return [
    emptyToNull(body.direccion),
    emptyToNull(body.edad),
    emptyToNull(body.rh),
    emptyToNull(body.alergias),
    emptyToNull(body.diabetes),
    emptyToNull(body.cirugias),
    emptyToNull(body.medicamentos),
    emptyToNull(body.otras_enfermedades),
    emptyToNull(body.enf_cardiovasculares),
    emptyToNull(body.enf_pulmonares),
    emptyToNull(body.enf_digestivas),
    emptyToNull(body.enf_renales),
    emptyToNull(body.alcohol),
    emptyToNull(body.tabaquismo),
    emptyToNull(body.drogas),
    emptyToNull(body.inmunizaciones),
    emptyToNull(body.otros_personales),
    emptyToNull(body.padre),
    emptyToNull(body.padre_enfermedades),
    emptyToNull(body.madre),
    emptyToNull(body.madre_enfermedades),
    emptyToNull(body.hermanos),
    emptyToNull(body.hermanos_enfermedades),
    emptyToNull(body.estado_civil),
    emptyToNull(body.nacionalidad),
    emptyToNull(body.ocupacion),
  ];
}

// POST /api/paciente-info/existente
// Si ya hay fila -> UPDATE parcial; si no hay -> INSERT
const crearPacienteInfoExistente = async (req, res) => {
  const { paciente_id } = req.body;

  if (!paciente_id) {
    return res.status(400).json({ error: "Falta 'paciente_id'." });
  }

  const conn = await db.getConnection();
  try {
    // 0) Chequeo que exista el paciente
    const [chkPac] = await conn.query(`SELECT id FROM pacientes WHERE id = ?`, [paciente_id]);
    if (chkPac.length === 0) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    // 1) ¿Ya hay info cargada?
    const [chkInfo] = await conn.query(
      `SELECT id FROM pacienteInfo WHERE paciente_id = ? LIMIT 1`,
      [paciente_id]
    );

    if (chkInfo.length > 0) {
      // -------- UPDATE PARCIAL --------
      const updateSql = `
        UPDATE pacienteInfo SET
          direccion          = COALESCE(?, direccion),
          edad               = COALESCE(?, edad),
          rh                 = COALESCE(?, rh),
          alergias           = COALESCE(?, alergias),
          diabetes           = COALESCE(?, diabetes),
          cirugias           = COALESCE(?, cirugias),
          medicamentos       = COALESCE(?, medicamentos),
          otras_enfermedades = COALESCE(?, otras_enfermedades),
          enf_cardiovasculares = COALESCE(?, enf_cardiovasculares),
          enf_pulmonares       = COALESCE(?, enf_pulmonares),
          enf_digestivas       = COALESCE(?, enf_digestivas),
          enf_renales          = COALESCE(?, enf_renales),
          alcohol            = COALESCE(?, alcohol),
          tabaquismo         = COALESCE(?, tabaquismo),
          drogas             = COALESCE(?, drogas),
          inmunizaciones     = COALESCE(?, inmunizaciones),
          otros_personales   = COALESCE(?, otros_personales),
          padre              = COALESCE(?, padre),
          padre_enfermedades = COALESCE(?, padre_enfermedades),
          madre              = COALESCE(?, madre),
          madre_enfermedades = COALESCE(?, madre_enfermedades),
          hermanos           = COALESCE(?, hermanos),
          hermanos_enfermedades = COALESCE(?, hermanos_enfermedades),
          estado_civil       = COALESCE(?, estado_civil),
          nacionalidad       = COALESCE(?, nacionalidad),
          ocupacion          = COALESCE(?, ocupacion)
        WHERE paciente_id = ?`;
      const updateValues = [...mapInfoFieldsForUpdate(req.body), paciente_id];

      const [r] = await conn.query(updateSql, updateValues);
      return res.status(200).json({ ok: true, mode: "updated", paciente_id, affectedRows: r.affectedRows });
    } else {
      // -------- INSERT --------
      const sql = `
        INSERT INTO pacienteInfo
        (paciente_id, direccion, edad, rh, alergias, diabetes, cirugias, medicamentos,
         otras_enfermedades, enf_cardiovasculares, enf_pulmonares, enf_digestivas, enf_renales,
         alcohol, tabaquismo, drogas, inmunizaciones, otros_personales,
         padre, padre_enfermedades, madre, madre_enfermedades, hermanos, hermanos_enfermedades,
         estado_civil, nacionalidad, ocupacion)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const values = mapInfoFields(req.body, paciente_id);

      const [r] = await conn.query(sql, values);
      return res.status(201).json({ ok: true, mode: "inserted", paciente_id, pacienteInfo_id: r.insertId });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error guardando información" });
  } finally {
    conn.release();
  }
};

// POST /api/paciente-info/nuevo
// (igual que tenías) Crea paciente + pacienteInfo en transacción
const crearPacienteYInfo = async (req, res) => {
  const {
    nombre, telefono, email, fecha_nacimiento, sexo, obra_social,
    direccion, edad, rh, alergias, diabetes, cirugias, medicamentos,
    otras_enfermedades, enf_cardiovasculares, enf_pulmonares, enf_digestivas, enf_renales,
    alcohol, tabaquismo, drogas, inmunizaciones, otros_personales,
    padre, padre_enfermedades, madre, madre_enfermedades, hermanos, hermanos_enfermedades,
    estado_civil, nacionalidad, ocupacion,
  } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "Falta 'nombre' para crear paciente" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [r1] = await conn.query(
      `INSERT INTO pacientes (nombre, telefono, email, fecha_nacimiento, sexo, obra_social)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre ?? null, telefono ?? null, email ?? null, fecha_nacimiento ?? null, sexo ?? null, obra_social ?? null]
    );
    const nuevoId = r1.insertId;

    const sqlInfo = `
      INSERT INTO pacienteInfo
      (paciente_id, direccion, edad, rh, alergias, diabetes, cirugias, medicamentos,
       otras_enfermedades, enf_cardiovasculares, enf_pulmonares, enf_digestivas, enf_renales,
       alcohol, tabaquismo, drogas, inmunizaciones, otros_personales,
       padre, padre_enfermedades, madre, madre_enfermedades, hermanos, hermanos_enfermedades,
       estado_civil, nacionalidad, ocupacion)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const values = mapInfoFields(
      {
        direccion, edad, rh, alergias, diabetes, cirugias, medicamentos,
        otras_enfermedades, enf_cardiovasculares, enf_pulmonares, enf_digestivas, enf_renales,
        alcohol, tabaquismo, drogas, inmunizaciones, otros_personales,
        padre, padre_enfermedades, madre, madre_enfermedades, hermanos, hermanos_enfermedades,
        estado_civil, nacionalidad, ocupacion,
      },
      nuevoId
    );

    const [r2] = await conn.query(sqlInfo, values);

    await conn.commit();
    return res.status(201).json({
      ok: true,
      paciente_id: nuevoId,
      pacienteInfo_id: r2.insertId,
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    return res.status(500).json({ error: "Error creando paciente e información" });
  } finally {
    conn.release();
  }
};

module.exports = {
  crearPacienteInfoExistente,
  crearPacienteYInfo,
};
