import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import BotonHarmonia from "@/components/ui/botonHarmonia";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PacientesHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      {/* Título y botón */}
      <div className="flex flex-col gap-2">
        <h1 className="font-normal text-4xl">Pacientes</h1>
        <BotonHarmonia onClick={() => navigate("/historia-clinica")}>
          Generar Historia Clínica
        </BotonHarmonia>
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
