import React, { useEffect, useState } from "react";
import PacientesCard from "./PacientesCard";

export default function PacientesList({ filters }) {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        let query = new URLSearchParams();
        for (const [key, value] of Object.entries(filters)) {
          if (value) query.append(key, value);
        }

        const res = await fetch(`http://localhost:4000/api/pacientes?${query.toString()}`);
        const data = await res.json();
        setPatients(data);
        setCurrentPage(1); // Reiniciar paginación al aplicar nuevos filtros
      } catch (error) {
        console.error("Error al obtener pacientes:", error);
      }
    };

    fetchPatients();
  }, [filters]);

  // Paginación en el cliente
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedPatients = patients.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-6">
        {displayedPatients.length > 0 ? (
          displayedPatients.map((patient) => (
            <PacientesCard key={patient.id} patient={patient} />
          ))
        ) : (
          <p className="text-center text-gray-500">No se encontraron pacientes.</p>
        )}
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          className="text-sm text-gray-700 hover:underline disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700">{currentPage}</span>
        <button
          className="text-sm text-gray-700 hover:underline disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) =>
              prev * itemsPerPage < patients.length ? prev + 1 : prev
            )
          }
          disabled={currentPage * itemsPerPage >= patients.length}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
