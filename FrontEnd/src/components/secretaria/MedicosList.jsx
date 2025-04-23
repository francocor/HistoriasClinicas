import React from "react";
import MedicoCard from "./MedicoCard";

const doctors = [
  {
    id: 1,
    name: "Dr. Pepito Fernandez",
    avatar: "/3d-avatar-17.png",
    nacimiento: "01/01/1980",
    telefono: "123456789",
    horarios: "Lun a Vie 8 a 16hs",
    obrasSociales: "OSDE, PAMI",
    plus: "$1000",
    particular: "$5000",
    matricula: "123456",
  },
  // ... más médicos
];

export default function MedicosList() {
  return (
    <div className="flex flex-col items-center py-6 px-4">
      <h1 className="text-3xl font-semibold mb-8">Profesionales</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {doctors.map((medico) => (
          <MedicoCard key={medico.id} medico={medico} />
        ))}
      </div>
    </div>
  );
}