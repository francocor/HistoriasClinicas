import React, { useState } from "react";
import ConsultaCard from "./ConsultaCard";

export default function ConsultasList() {
  const consultations = [
    {
      date: "01/04/2024",
      reason: "Dolor abdominal",
      doctor: "Dra. Paula López",
    },
    {
      date: "15/03/2024",
      reason: "Control mensual",
      doctor: "Dr. Juan Torres",
    },
    {
      date: "28/02/2024",
      reason: "Chequeo general",
      doctor: "Dr. Juan Torres",
    },
    {
      date: "10/02/2024",
      reason: "Primera consulta",
      doctor: "Dra. Paula López",
    },
  ];

  const itemsPorPagina = 5;
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.ceil(consultations.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const paginadas = consultations.slice(inicio, inicio + itemsPorPagina);

  return (
    <div className="space-y-4">
      {/* Lista paginada */}
      {paginadas.map((item, index) => (
        <ConsultaCard key={index} {...item} />
      ))}

      {/* Botones de navegación */}
      <div className="flex justify-center gap-6 mt-6 text-lg text-gray-700">
        {paginaActual > 1 && (
          <button
            onClick={() => setPaginaActual((prev) => prev - 1)}
            className="hover:underline text-blue-600"
          >
            ← Página anterior
          </button>
        )}

        {paginaActual < totalPaginas && (
          <button
            onClick={() => setPaginaActual((prev) => prev + 1)}
            className="hover:underline text-blue-600"
          >
            Página siguiente →
          </button>
        )}
      </div>
    </div>
  );
}