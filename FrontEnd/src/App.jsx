import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import LayoutSecretaria from "@/components/secretaria/LayoutSecretaria";

// PROFESIONAL
import HomeProfesionales from "@/components/home/HomeProfesionales";
import Pacientes from "@/components/pacientes/Pacientes";
import HistoriaClinica from "@/components/historia-clinica/HistoriaClinica";
import FichaPaciente from "@/components/ficha-paciente/FichaPaciente";
import Atencion from "@/components/atencion/Atencion";
import Turnos from "@/components/turnos/Turnos";
import Recetas from "@/components/recetas/Recetas";
import Balance from "@/components/graficos/Balances";

// SECRETARIA
import HomeSecretaria from "@/components/secretaria/HomeSecretaria";
import MedicosSecretaria from "@/components/secretaria/MedicosSecretaria";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PROFESIONALES */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeProfesionales />} />
          <Route path="pacientes" element={<Pacientes />} />
          <Route path="historia-clinica" element={<HistoriaClinica />} />
          <Route path="ficha-paciente" element={<FichaPaciente />} />
          <Route path="atencion" element={<Atencion />} />
          <Route path="turnos" element={<Turnos role="profesional" />} />
          <Route path="recetas" element={<Recetas />} />
          <Route path="graficos" element={<Balance />} />
        </Route>

        {/* SECRETARIA */}
        <Route path="/secretaria" element={<LayoutSecretaria />}>
          <Route index element={<HomeSecretaria />} />
          <Route path="medicos" element={<MedicosSecretaria />} />
          <Route path="turnos" element={<Turnos role="secretaria" />} />
          <Route path="graficos" element={<Balance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}