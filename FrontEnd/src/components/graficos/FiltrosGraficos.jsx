import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select as SelectUI,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import BotonHarmonia from "@/components/ui/BotonHarmonia";
import Select from "react-select"; // 👈 Módulo para multi-select

// Opciones de patologías para el select múltiple
const opcionesPatologias = [
  { value: "diabetes", label: "Diabetes" },
  { value: "hipertension", label: "Hipertensión" },
  { value: "epoc", label: "EPOC" },
  { value: "asma", label: "Asma" },
  { value: "cardiopatia", label: "Cardiopatía" },
];

export default function FiltrosGraficos({ tipoGrafico, setTipoGrafico, comparar, setComparar }) {
  const [patologiasSeleccionadas, setPatologiasSeleccionadas] = useState([]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Obra Social */}
      <div className="flex flex-col gap-1">
        <label className="text-lg font-montserrat">Obra Social</label>
        <SelectUI>
          <SelectTrigger className="border border-black h-10 bg-white">
            <SelectValue placeholder="Seleccione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pami">PAMI</SelectItem>
            <SelectItem value="osde">OSDE</SelectItem>
            <SelectItem value="swiss">Swiss Medical</SelectItem>
          </SelectContent>
        </SelectUI>
      </div>

      {/* Edad */}
      <div className="flex flex-col gap-1">
        <label className="text-lg font-montserrat">Edad</label>
        <div className="flex gap-2">
          <Input className="w-full border border-black" type="number" placeholder="Desde" />
          <Input className="w-full border border-black" type="number" placeholder="Hasta" />
        </div>
      </div>

      {/* Sexo */}
      <div className="flex flex-col gap-1">
        <label className="text-lg font-montserrat">Sexo</label>
        <SelectUI>
          <SelectTrigger className="border border-black h-10 bg-white">
            <SelectValue placeholder="Seleccione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Masculino</SelectItem>
            <SelectItem value="female">Femenino</SelectItem>
          </SelectContent>
        </SelectUI>
      </div>

      {/* Fecha */}
      <div className="flex flex-col gap-1 col-span-1 md:col-span-2 lg:col-span-3">
        <label className="text-lg font-montserrat">Fecha</label>
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Input className="w-[150px] h-9 border border-black pr-10" type="date" />
            <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
          <div className="relative">
            <Input className="w-[150px] h-9 border border-black pr-10" type="date" />
            <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Patologías (Multi-select) */}
      <div className="flex flex-col gap-1 col-span-1 md:col-span-2 lg:col-span-3">
        <label className="text-lg font-montserrat">Patologías</label>
        <Select
          options={opcionesPatologias}
          isMulti
          value={patologiasSeleccionadas}
          onChange={setPatologiasSeleccionadas}
          className="text-black"
          styles={{
            control: (base) => ({
              ...base,
              borderColor: "black",
              borderRadius: "8px",
              minHeight: "40px",
              fontSize: "14px",
            }),
          }}
        />
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-4 col-span-full mt-4 flex-wrap">
        <BotonHarmonia>Aceptar</BotonHarmonia>
        <BotonHarmonia>Limpiar</BotonHarmonia>

        <div className="flex items-center gap-2 ml-auto">
          <label className="font-montserrat text-lg">Tipo de gráfico:</label>
          <SelectUI
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
          </SelectUI>
        </div>
      </div>
    </div>
  );
}