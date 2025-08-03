const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const turnosRoutes = require("./routes/turnosRoutes");
const asistencias= require("./routes/asistenciasRoutes")
const profesionalesRoutes = require("./routes/profesionalesRoutes");
const pacientesRoutes = require("./routes/pacientesRoutes");
const atencionRoutes = require("./routes/atencionRoutes");
const historiaRoutes = require("./routes/historiasRoutes"); 
const horarios= require("./routes/horariosRoutes"); // ✅ nuevo


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/turnos", turnosRoutes);
app.use("/api/asistencias", asistencias);
app.use("/api/profesionales", profesionalesRoutes);
app.use("/api/pacientes", pacientesRoutes);
app.use("/api/atendido", atencionRoutes)
app.use("/api/historias", historiaRoutes); // ✅ nuevo
app.use("/api/horarios", horarios)


app.get("/", (req, res) => {
  res.send("API funcionando");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});