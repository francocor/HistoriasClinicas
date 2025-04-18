import React from "react";
import FichaPacienteHeader from "./FichaPacienteHeader";
import ConsultasList from "./ConsultasList";

export default function FichaPaciente() {
  return (
    <div className="flex h-screen w-full">
      {/* Layout ya incluye Sidebar y Header */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-white p-4">
          <FichaPacienteHeader />
          <ConsultasList />
        </main>
      </div>
    </div>
  );
}