import React from "react";
import FichaPacienteHeader from "./FichaPacienteHeader";
import ConsultasList from "./ConsultasList";

export default function FichaPaciente() {
  return (
    <div className="w-full min-h-screen overflow-y-auto bg-white px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <FichaPacienteHeader />
        <ConsultasList />
      </div>
    </div>
  );
}