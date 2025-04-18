import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import React from "react";

export default function PacientesHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      {/* Título y botón */}
      <div className="flex flex-col gap-2">
        <h1 className="font-normal text-4xl">Pacientes</h1>
        <Button className="w-[250px] sm:w-[285px] h-[49px] rounded-[40px] shadow-[8px_8px_1.9px_#00000040] text-[18px] sm:text-[23px] font-normal">
          Generar Historia Clínica
        </Button>
      </div>

      {/* Buscador y filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative">
          <Input
            className="w-[250px] sm:w-[310px] h-[54px] border-2 border-black"
            placeholder="Buscar paciente..."
          />
          <Search className="absolute w-6 h-6 top-3 right-3" />
        </div>

        <Button
          variant="outline"
          className="h-[53px] w-[163px] rounded-[15px] border border-black flex items-center justify-between px-6"
        >
          <span className="font-normal text-xl">Filtros</span>
          <Filter className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
