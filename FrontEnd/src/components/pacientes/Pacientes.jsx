import React from "react";
import PacientesHeader from "./PacientesHeader";
import PacientesList from "./PacientesList";

export default function Pacientes() {
  return (
    <div className="flex h-screen w-full">
      {/* Aca iría tu Sidebar y Header si lo querés usar desde el Layout */}
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-white p-4">
          <PacientesHeader />
          <PacientesList />
        </main>
      </div>
    </div>
  );
}