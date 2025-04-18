import React from "react";
import PacientesCard from "./PacientesCard";

export default function PacientesList() {
  // Datos de prueba
  const patients = [
    {
      id: 1,
      name: "Juan Pérez",
      age: "32 años",
      birthDate: "01/01/1992",
      insurance: "PAMI",
    },
    {
      id: 2,
      name: "Laura García",
      age: "45 años",
      birthDate: "15/08/1979",
      insurance: "OSDE",
    },
    {
      id: 3,
      name: "Carlos López",
      age: "28 años",
      birthDate: "10/10/1995",
      insurance: "Swiss Medical",
    },
  ];

  return (
    <div className="mt-8 space-y-8">
      {patients.map((patient) => (
        <PacientesCard key={patient.id} patient={patient} />
      ))}

      {/* Paginación */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button className="text-sm text-gray-700 hover:underline">Anterior</button>
        <span className="text-sm text-gray-700">|</span>
        <button className="text-sm text-gray-700 hover:underline">Siguiente</button>
      </div>
    </div>
  );
}
