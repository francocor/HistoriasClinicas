import React from "react";
import { Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TurnosHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Título */}
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-sans font-normal text-black">
          Turnos
        </h1>
        <Calendar className="w-8 h-8 text-black" />
      </div>

      {/* Buscador  */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Input
            className="w-[250px] sm:w-[310px] h-[54px] border-2 border-black"
            placeholder="Buscar paciente..."
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
        </div>
      </div>
    </div>
  );
}