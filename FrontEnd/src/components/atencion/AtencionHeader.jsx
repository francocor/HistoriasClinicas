import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AtencionHeader() {
  return (
    <div className="mb-6">
      {/* Volver + Título */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="p-0 mr-4">
          <ArrowLeft className="w-[60px] h-[60px]" />
        </Button>
        <h1 className="text-4xl font-sans font-normal">Pacientes</h1>
      </div>

      {/* Nombre Paciente + botón Cargar Estudios */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-sans font-normal">Nombre Paciente</h2>
        <div className="flex flex-col items-end gap-2">
          <span className="text-lg font-sans">Estudios y/o análisis</span>
          <Button
            variant="outline"
            className="rounded-[40px] h-[31px] w-[100px] text-md font-sans"
          >
            Cargar
          </Button>
        </div>
      </div>
    </div>
  );
}
