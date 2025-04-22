import React from "react";
import TurnosHeader from "@/components/turnos/TurnosHeader";
import TurnosList from "@/components/turnos/TurnosList";
import AsignarTurnoBox from "@/components/turnos/AsignarTurnoBox";

export default function Turnos() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Header con título y buscador */}
      <div className="w-full max-w-[1300px] mb-6">
        <TurnosHeader />
      </div>

      {/* Contenedor principal con lista y box */}
      <div className="w-full max-w-[1300px] flex flex-col lg:flex-row justify-center lg:justify-between gap-10">
        {/* Lista de turnos */}
        <div className="flex-1">
          <TurnosList />
        </div>

        {/* Box para asignar turno */}
        <div className="flex-1 flex justify-center">
          <AsignarTurnoBox />
        </div>
      </div>
    </div>
  );
}