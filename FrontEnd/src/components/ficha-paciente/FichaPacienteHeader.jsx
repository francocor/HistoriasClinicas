import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download } from "lucide-react";

export default function FichaPacienteHeader() {
  const navigate = useNavigate();
  return (
    <div className="mb-8">
      {/* Botón volver + Títulos */}
      <div className="flex items-center mb-6">
        <button className="mr-4">
          <ChevronLeft className="w-[60px] h-[60px]" />
        </button>
        <div className="space-y-1">
          <h1 className="text-4xl font-sans font-normal">Pacientes</h1>
          <h2 className="text-2xl font-sans font-normal">Ficha Paciente</h2>
        </div>
      </div>

      {/* Nombre y botones de acción */}
      <div className="mb-6">
        <h3 className="text-2xl font-sans font-normal mb-3">
          Nombre Paciente
        </h3>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            onClick={() => navigate("/historia-clinica")}
            className="rounded-[40px] shadow-md h-[49px] bg-white text-black hover:bg-gray-100"
          >
            <span className="text-2xl font-sans font-normal">Historia Clínica</span>
          </Button>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="rounded-[40px] bg-white text-black shadow-[8px_8px_1.9px_rgba(0,0,0,0.25)] flex items-center gap-2 px-4 h-[49px] hover:bg-gray-100">
              <span className="text-xl font-sans font-normal">
                Descargar info del paciente
              </span>
              <Download className="w-6 h-6" />
            </Button>

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