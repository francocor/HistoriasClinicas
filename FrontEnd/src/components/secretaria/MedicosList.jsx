import React, { useEffect, useState } from "react";
import MedicoCard from "./MedicoCard";

export default function MedicosList() {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctores = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/profesionales");
        const data = await res.json();
        setDoctores(data);
      } catch (err) {
        console.error("Error al obtener los profesionales:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctores();
  }, []);

  return (
    <div className="flex flex-col items-center py-6 px-4">
      <h1 className="text-3xl font-semibold mb-8">Profesionales</h1>

      {loading ? (
        <p className="text-gray-600">Cargando profesionales...</p>
      ) : doctores.length === 0 ? (
        <p className="text-gray-600">No hay profesionales cargados.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {doctores.map((medico) => (
            <MedicoCard key={medico.id} medico={medico} />
          ))}
        </div>
      )}
    </div>
  );
}
