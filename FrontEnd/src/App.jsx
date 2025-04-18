import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import HomeProfesionales from "@/components/home/HomeProfesionales";
import Pacientes from "@/components/pacientes/Pacientes";
import HistoriaClinica from "@/components/historia-clinica/HistoriaClinica";
import FichaPaciente from "@/components/ficha-paciente/FichaPaciente";
import Atencion from "@/components/atencion/Atencion";
import Turnos from "@/components/turnos/Turnos";
import Recetas from "@/components/recetas/Recetas";
import Balance from "@/components/graficos/Balances";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeProfesionales />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/historia-clinica" element={<HistoriaClinica />} />
          <Route path="/ficha-paciente" element={<FichaPaciente />} />
          <Route path="/atencion" element={<Atencion />} />
          <Route path="/turnos" element={<Turnos />} />
          <Route path="/recetas" element={<Recetas />} />
          <Route path="/graficos" element={<Balance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}