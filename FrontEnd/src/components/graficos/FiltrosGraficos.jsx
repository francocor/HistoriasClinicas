import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import BotonHarmonia from "@/components/ui/BotonHarmonia";


export default function FiltrosGraficos({ tipoGrafico, setTipoGrafico, comparar, setComparar }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Filtro: Obras Sociales */}
      <div className="flex items-center gap-2">
        <label className="font-montserrat text-lg">Obra Social:</label>
        <Select>
          <SelectTrigger className="w-[180px] h-9 border border-black bg-white">
            <SelectValue placeholder="Seleccione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pami">PAMI</SelectItem>
            <SelectItem value="osde">OSDE</SelectItem>
            <SelectItem value="swiss">Swiss Medical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtro: Edad */}
      <div className="flex items-center gap-2">
        <label className="font-montserrat text-lg">Edad:</label>
        <span>desde</span>
        <Input className="w-[80px] h-9 border border-black" type="number" />
        <span>hasta</span>
        <Input className="w-[80px] h-9 border border-black" type="number" />
      </div>

      {/* Filtro: Sexo */}
      <div className="flex items-center gap-2">
        <label className="font-montserrat text-lg">Sexo:</label>
        <Select>
          <SelectTrigger className="w-[130px] h-9 border border-black bg-white">
            <SelectValue placeholder="Seleccione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Masculino</SelectItem>
            <SelectItem value="female">Femenino</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtro: Fecha */}
      <div className="flex items-center gap-2">
        <label className="font-montserrat text-lg">Fecha:</label>
        <span>desde</span>
        <div className="relative">
          <Input className="w-[150px] h-9 border border-black pl-4 pr-10" type="date" />
          <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>
        <span>hasta</span>
        <div className="relative">
          <Input className="w-[150px] h-9 border border-black pl-4 pr-10" type="date" />
          <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-4 col-span-full mt-4">
        <BotonHarmonia>
          Aceptar
        </BotonHarmonia>
        <BotonHarmonia>
          Limpiar
        </BotonHarmonia>

        <label className="font-montserrat text-lg ml-auto">Tipo de gráfico:</label>
        <Select
          onValueChange={(value) => setTipoGrafico(value)}
          defaultValue={tipoGrafico}
        >
          <SelectTrigger className="w-[140px] h-9 border border-black bg-white">
            <SelectValue placeholder="Barras" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Barras</SelectItem>
            <SelectItem value="pie">Circular</SelectItem>
            <SelectItem value="line">Líneas</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          cclassName="w-[191px] h-[29px] rounded-[40px] bg-gradient-to-b from-[#179cba] to-white text-xl font-normal text-black font-sans"
          onClick={() => setComparar(!comparar)}
        >
          {comparar ? "Quitar comparación" : "Activar comparación"}
        </Button>
      </div>
    </div>
  );
}
