import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download } from "lucide-react";
import BotonHarmonia from "@/components/ui/botonHarmonia";

export default function FichaPacienteHeader({ pacienteId,
  view = "consultas",                 // <- default si no llega
  setView = (v) => console.warn("setView no provisto, intento a:", v), }) {
  const navigate = useNavigate();
  const params = useParams();
  const effectiveId = pacienteId ?? params.id;

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:4000/api/pacientes/${effectiveId}`);
        if (!res.ok) throw new Error("Error al obtener paciente");
        const data = await res.json();
        setPaciente(data);
      } catch (err) {
        console.error("Error al traer paciente:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (effectiveId) fetchPaciente();
  }, [effectiveId]);

  const handleDescargarExcel = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/pacientes/descargar-excel/${effectiveId}`);
      if (!response.ok) throw new Error("Error al descargar Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ficha_paciente_${paciente?.nombre ?? "paciente"}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar Excel:", error);
      alert("No se pudo descargar el Excel del paciente.");
    }
  };

  // estilos activos para el toggle
  const toggleBtnBase = "rounded-full px-4 py-2 text-sm sm:text-base transition w-full sm:w-auto";
  const active = "bg-black text-white hover:bg-black/90";
  const inactive = "bg-white text-black hover:bg-gray-100 border";

  return (
    <div className="mb-8">
      {/* Volver + títulos */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
        <button onClick={() => navigate(-1)} aria-label="Volver" className="w-fit">
          <ChevronLeft className="w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] cursor-pointer hover:opacity-80 transition" />
        </button>
        <div>
          <h1 className="text-3xl sm:text-4xl font-sans font-normal">Pacientes</h1>
          <h2 className="text-xl sm:text-2xl font-sans font-normal">Ficha Paciente</h2>
        </div>
      </div>

      {/* Nombre + acciones */}
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-sans font-normal mb-3">
          {loading ? "Cargando..." : error ? "Paciente no disponible" : (paciente?.nombre ?? paciente?.nombreCompleto ?? "Sin nombre")}
        </h3>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <BotonHarmonia onClick={() => navigate("/historia-clinica", { state: { paciente } })}>
            <span className="text-lg sm:text-2xl font-sans font-normal">Historia Clínica</span>
          </BotonHarmonia>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <BotonHarmonia onClick={handleDescargarExcel} className="w-full sm:w-auto">
              <span className="text-base sm:text-xl font-sans font-normal">Descargar info del paciente</span>
              <Download className="w-5 h-5 sm:w-6 sm:h-6" />
            </BotonHarmonia>

              {/* Toggle exclusivo: si estás en consultas, muestra "Ver Documentos";
      si estás en documentos, muestra "Ver Consultas" */}
  {view === "consultas" ? (
    <button
      type="button"
      onClick={() => setView("documentos")}
      className="rounded-full px-4 py-2 bg-white text-black hover:bg-gray-100 border w-full sm:w-auto"
    >
      Ver Documentos
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setView("consultas")}
      className="rounded-full px-4 py-2 bg-white text-black hover:bg-gray-100 border w-full sm:w-auto"
    >
      Ver Consultas
    </button>
)}

            <Button
              onClick={() => navigate("/atencion")}
              className="rounded-full bg-white text-black hover:bg-gray-100 w-full sm:w-auto"
            >
              <span className="text-base sm:text-xl font-sans">+ Nueva Consulta</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
