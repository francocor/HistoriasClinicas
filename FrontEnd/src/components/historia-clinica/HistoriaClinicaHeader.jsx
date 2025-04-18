import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Filter, Search } from "lucide-react";

export default function HistoriaClinicaHeader() {
  return (
    <div className="mb-6">
      {/* Título con botón de volver */}
      <div className="flex items-center mb-6">
        <button className="mr-4">
          <ChevronLeft className="w-[60px] h-[60px]" />
        </button>
        <div className="space-y-1">
          <h1 className="text-4xl font-sans font-normal">Pacientes</h1>
          <h2 className="text-2xl font-sans font-normal">Historias clínicas</h2>
          <h3 className="text-2xl font-sans font-normal">Nuevo paciente</h3>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <div className="relative w-full sm:w-[310px]">
          <Input
            className="h-[54px] border-2 border-black"
            placeholder="Buscar paciente..."
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6" />
        </div>

        <Button
          variant="outline"
          className="h-[53px] w-[163px] rounded-[15px] border border-black flex items-center justify-between px-4"
        >
          <span className="text-xl font-sans font-normal">Filtros</span>
          <Filter className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}