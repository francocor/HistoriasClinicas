import React from "react";
import { useLocation } from "react-router-dom";
import FichaPacienteHeader from "./FichaPacienteHeader";
import ConsultasList from "./ConsultasList";

export default function FichaPaciente() {
  const { state } = useLocation();
  const pacienteId = state?.pacienteId;

  return (
    <div className="w-full min-h-screen overflow-y-auto bg-white px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <FichaPacienteHeader pacienteId={pacienteId} />
        {pacienteId ? (
          <ConsultasList pacienteId={pacienteId} />
        ) : (
          <p className="text-center text-gray-500 mt-6">No se encontró el ID del paciente.</p>
        )}
      </div>
    </div>
  );
}
