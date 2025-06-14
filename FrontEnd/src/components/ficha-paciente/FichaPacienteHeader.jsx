import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download } from "lucide-react";
import BotonHarmonia from "@/components/ui/botonHarmonia";

export default function FichaPacienteHeader() {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      {/* Botón volver + Títulos */}
      <div className="flex items-center mb-6">
        <button
          className="mr-4"
          onClick={() => navigate(-1)} // ✅ Funcionalidad para volver atrás
          aria-label="Volver"
        >
          <ChevronLeft className="w-[60px] h-[60px] cursor-pointer hover:opacity-80 transition" />
        </button>
        <div className="space-y-1">
          <h1 className="text-4xl font-sans font-normal">Pacientes</h1>
          <h2 className="text-2xl font-sans font-normal">Ficha Paciente</h2>
        </div>
      </div>

      {/* Nombre y botones de acción */}
      <div className="mb-6">
        <h3 className="text-2xl font-sans font-normal mb-3">Nombre Paciente</h3>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <BotonHarmonia onClick={() => navigate("/historia-clinica")}>
            <span className="text-2xl font-sans font-normal">Historia Clínica</span>
          </BotonHarmonia>

          <div className="flex flex-col sm:flex-row gap-4">
            <BotonHarmonia>
              <span className="text-xl font-sans font-normal">
                Descargar info del paciente
              </span>
              <Download className="w-6 h-6" />
            </BotonHarmonia>

            <Button
              onClick={() => navigate("/atencion")}
              className="rounded-[40px] bg-white text-black hover:bg-gray-100"
            >
              <span className="text-xl font-sans">+ Nueva Consulta</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}