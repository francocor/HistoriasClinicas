import React, { useState } from "react";
import PacientesHeader from "./PacientesHeader";
import PacientesList from "./PacientesList";

export default function Pacientes() {
  const [filters, setFilters] = useState({}); // Estado levantado acá

  return (
    <div className="flex h-screen w-full">
      {/* Aca iría tu Sidebar y Header si lo querés usar desde el Layout */}
      
      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-white p-4">
          <PacientesHeader onApplyFilters={setFilters} />
          <PacientesList filters={filters} />
        </main>
      </div>
    </div>
  );
}
