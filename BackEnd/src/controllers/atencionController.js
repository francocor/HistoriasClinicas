const db = require("../config/db");

const editarAtencion = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!["atendido", "no atendido"].includes(estado)) {
    return res.status(400).json({ message: "Estado de atención inválido" });
  }

  try {
    const [result] = await db.execute(
      `UPDATE turnos SET estado_atencion = ? WHERE id = ?`,
      [estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Turno no encontrado" });
    }

    res.status(200).json({ message: "Estado actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar estado:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};


module.exports = {  editarAtencion };
