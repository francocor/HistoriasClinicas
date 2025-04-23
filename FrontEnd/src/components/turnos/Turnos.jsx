import React, { useState } from "react";
import TurnosHeader from "@/components/turnos/TurnosHeader";
import TurnosList from "@/components/turnos/TurnosList";
import AsignarTurnoBox from "@/components/turnos/AsignarTurnoBox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function Turnos({ role = "profesional" }) {
  const [selectedDoctor, setSelectedDoctor] = useState("");

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      {/* Lista de turnos */}
      <div className="flex-1">
        <TurnosHeader />

        {/* Mostrar selector de médico solo si es secretaria */}
        {role === "secretaria" && (
          <div className="mb-6 w-full max-w-md">
            <label className="text-lg font-semibold text-black block mb-2">
              Seleccionar médico:
            </label>
            <Select onValueChange={(value) => setSelectedDoctor(value)}>
              <SelectTrigger className="w-full border border-black">
                <SelectValue placeholder="Elegir médico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dr-pepito">Dr. Pepito Fernández</SelectItem>
                <SelectItem value="dr-juarez">Dra. Juárez</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <TurnosList />
      </div>

      {/* Asignar turno */}
      <div className="w-full lg:w-[382px]">
        <AsignarTurnoBox />
      </div>
    </div>
  );
}