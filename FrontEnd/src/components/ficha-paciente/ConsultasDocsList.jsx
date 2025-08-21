import React, { useEffect, useState } from "react";
import ConsultaDocCard from "./ConsultaDocCard";

export default function ConsultasList({ pacienteId }) {
  const [consultations, setConsultations] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/historias/pacienteFiles/${pacienteId}`
        );

        if (!res.ok) throw new Error("Error al obtener consultas");

        const data = await res.json();
        // Ordenar por fecha descendente
        data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setConsultations(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    if (pacienteId) fetchConsultas();
  }, [pacienteId]);

  const totalPaginas = Math.ceil(consultations.length / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const paginadas = consultations.slice(inicio, inicio + itemsPorPagina);

  return (
    <div className="space-y-4">
      {paginadas.length > 0 ? (
        <>
          {paginadas.map((item) => (
            <ConsultaDocCard
              key={item.id}
              date={new Date(item.fecha).toLocaleDateString()}
              reason={item.motivo}
              doctor={`Dr: ${item.doctor}`}
              diagnostico={item.diagnostico}
              tipo_archivo={item.tipo_archivo}
              archivo={item.archivo} 
              nombre_archivo= {item.nombre_archivo}// o podés mostrar "Tu consulta" o el nombre si está incluido
            />
          ))}

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
        </>
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No hay consultas registradas.
        </p>
      )}
    </div>
  );
}
