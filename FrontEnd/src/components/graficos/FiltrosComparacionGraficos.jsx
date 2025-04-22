import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

export default function FiltrosComparacionGraficos({ tipoGrafico, setTipoGrafico }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Obra Social */}
      <div className="flex items-center gap-2">
        <label className="text-lg text-black">Obra Social:</label>
        <Select>
          <SelectTrigger className="w-[180px] h-[34px] border border-black">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pami">PAMI</SelectItem>
            <SelectItem value="osde">OSDE</SelectItem>
            <SelectItem value="swiss">Swiss Medical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Edad */}
      <div className="flex items-center gap-2">
        <label className="text-lg text-black">Edad:</label>
        <Input placeholder="Desde" className="w-[80px] h-[34px] border border-black" />
        <Input placeholder="Hasta" className="w-[80px] h-[34px] border border-black" />
      </div>

      {/* Sexo */}
      <div className="flex items-center gap-2">
        <label className="text-lg text-black">Sexo:</label>
        <Select>
          <SelectTrigger className="w-[120px] h-[34px] border border-black">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="masculino">Masculino</SelectItem>
            <SelectItem value="femenino">Femenino</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tipo de gráfico */}
      <div className="flex items-center gap-2">
        <label className="text-lg text-black">Tipo de gráfico:</label>
        <Select
          value={tipoGrafico}
          onValueChange={(value) => setTipoGrafico(value)}
        >
          <SelectTrigger className="w-[140px] h-[34px] border border-black">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Barras</SelectItem>
            <SelectItem value="pie">Circular</SelectItem>
            <SelectItem value="line">Líneas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fecha desde - hasta */}
      <div className="flex items-center gap-2 col-span-full">
        <label className="text-lg text-black">Fecha:</label>
        <span className="text-sm text-black">desde</span>
        <div className="relative">
          <Input
            className="w-[150px] h-[34px] border border-black pl-4 pr-10"
            placeholder="dd/mm/aaaa"
          />
          <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
        <span className="text-sm text-black ml-2">hasta</span>
        <div className="relative">
          <Input
            className="w-[150px] h-[34px] border border-black pl-4 pr-10"
            placeholder="dd/mm/aaaa"
          />
          <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
      </div>
    </div>
  );
}