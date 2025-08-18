const db = require("../config/db");

const obtenerHorarios = async (req,res) => {
     const { profesional_id } = req.params;
  const [rows] = await db.query(`
    SELECT dia_semana, hora_entrada, hora_salida 
    FROM profesional_horarios
    WHERE profesional_id = ?
  `, [profesional_id]);
  res.json(rows);
}
function puedeTocar(reqUser, targetProfesionalUserId, targetProfesionalId) {
  // master/admin/secretaria -> pueden editar cualquier profesional
  if (['master', 'admin', 'secretaria'].includes(reqUser?.role)) return true;

  // profesional -> solo su propio registro en profesionales
  if (reqUser?.role === 'profesional') {
    // es el profesional del user actual?
    // Mapear user -> profesional
    // targetProfesionalUserId es el users.id dueño de ese profesional
    return reqUser.id === targetProfesionalUserId;
  }
  return false;
}

async function getHorarios(req, res) {
  try {
    const profesionalId = Number(req.query.profesionalId);
    if (!profesionalId) return res.status(400).json({ error: 'profesionalId requerido' });

    // Traigo el user_id dueño de ese profesional para validar permisos
    const [[owner]] = await db.query(
      'SELECT pr.id, pr.user_id FROM profesionales pr WHERE pr.id = ? LIMIT 1',
      [profesionalId]
    );
    if (!owner) return res.status(404).json({ error: 'Profesional no encontrado' });

    const reqUser = req.user || null; // si no tenés auth aún, quita esta validación
    if (reqUser && !puedeTocar(reqUser, owner.user_id, profesionalId)) {
      return res.status(403).json({ error: 'Sin permisos' });
    }

    const [rows] = await db.query(
      `SELECT id, profesional_id, dia_semana, TIME_FORMAT(hora_entrada, '%H:%i') AS hora_entrada,
              TIME_FORMAT(hora_salida, '%H:%i') AS hora_salida
       FROM profesional_horarios
       WHERE profesional_id = ?
       ORDER BY FIELD(dia_semana,'Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'),
                hora_entrada ASC`,
      [profesionalId]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  }
}

async function putHorariosBulk(req, res) {
  const conn = await db.getConnection();
  try {
    const { profesionalId, horarios } = req.body || {};
    if (!profesionalId || !Array.isArray(horarios)) {
      return res.status(400).json({ error: 'profesionalId y horarios[] requeridos' });
    }

    // validar profesional y permisos
    const [[owner]] = await conn.query(
      'SELECT pr.id, pr.user_id FROM profesionales pr WHERE pr.id = ? LIMIT 1',
      [profesionalId]
    );
    if (!owner) {
      conn.release();
      return res.status(404).json({ error: 'Profesional no encontrado' });
    }

    const reqUser = req.user || null; // si no tenés auth, omití y dejá pasar
    if (reqUser && !['master', 'admin', 'secretaria', 'profesional'].includes(reqUser.role)) {
      conn.release();
      return res.status(403).json({ error: 'Sin permisos' });
    }
    if (reqUser && !puedeTocar(reqUser, owner.user_id, profesionalId)) {
      conn.release();
      return res.status(403).json({ error: 'Sin permisos' });
    }

    // Validar contenido
    const allowedDays = new Set(['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']);
    for (const h of horarios) {
      if (!allowedDays.has(h.dia_semana) || !h.hora_entrada || !h.hora_salida) {
        conn.release();
        return res.status(400).json({ error: 'Datos de horario inválidos' });
      }
      if (h.hora_salida <= h.hora_entrada) {
        conn.release();
        return res.status(400).json({ error: 'La salida debe ser mayor a la entrada' });
      }
    }

    await conn.beginTransaction();
    await conn.query('DELETE FROM profesional_horarios WHERE profesional_id = ?', [profesionalId]);

    if (horarios.length) {
      const values = horarios.map((h) => [
        profesionalId,
        h.dia_semana,
        h.hora_entrada,
        h.hora_salida,
      ]);
      await conn.query(
        `INSERT INTO profesional_horarios (profesional_id, dia_semana, hora_entrada, hora_salida)
         VALUES ?`,
        [values]
      );
    }

    await conn.commit();
    res.json({ ok: true, profesionalId, count: horarios.length });
  } catch (e) {
    try { await conn.rollback(); } catch {}
    console.error(e);
    res.status(500).json({ error: 'Error interno' });
  } finally {
    try { conn.release(); } catch {}
  }
}

module.exports= {obtenerHorarios, putHorariosBulk, getHorarios}