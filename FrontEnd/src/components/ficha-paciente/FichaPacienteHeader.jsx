import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download } from "lucide-react";
import BotonHarmonia from "@/components/ui/botonHarmonia";

export default function FichaPacienteHeader() {
  const navigate = useNavigate();

  // ⚠️ Usá un ID real del paciente desde contexto o props
  const pacienteId = 1;

  const handleDescargarFicha = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/pacientes/descargar-ficha/${pacienteId}`);
      if (!response.ok) throw new Error("Error al descargar ficha");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `ficha_paciente_${pacienteId}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar ficha:", error);
      alert("No se pudo descargar la ficha del paciente.");
    }
  };

  return (
    <div className="mb-8">
      {/* Botón volver + Títulos */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
        <button
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="w-fit"
        >
          <ChevronLeft className="w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] cursor-pointer hover:opacity-80 transition" />
        </button>
        <div>
          <h1 className="text-3xl sm:text-4xl font-sans font-normal">Pacientes</h1>
          <h2 className="text-xl sm:text-2xl font-sans font-normal">Ficha Paciente</h2>
        </div>
      </div>

      {/* Nombre y botones de acción */}
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-sans font-normal mb-3">Nombre Paciente</h3>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <BotonHarmonia onClick={() => navigate("/historia-clinica")}>
            <span className="text-lg sm:text-2xl font-sans font-normal">Historia Clínica</span>
          </BotonHarmonia>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <BotonHarmonia onClick={handleDescargarFicha} className="w-full sm:w-auto">
              <span className="text-base sm:text-xl font-sans font-normal">
                Descargar info del paciente
              </span>
              <Download className="w-5 h-5 sm:w-6 sm:h-6" />
            </BotonHarmonia>

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