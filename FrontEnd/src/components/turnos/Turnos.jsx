import React, { useState } from "react";
import TurnosHeader from "@/components/turnos/TurnosHeader";
import TurnosList from "@/components/turnos/TurnosList";
import AsignarTurnoBox from "@/components/turnos/AsignarTurnoBox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Turnos({ role = "profesional" }) {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [turnos, setTurnos] = useState([
    {
      id: 1,
      paciente: "Juan Pérez",
      fechaHora: "12/05/2024 - 10:30hs",
      doctor: "Dr. Fernández",
    },
    {
      id: 2,
      paciente: "Laura Gómez",
      fechaHora: "12/05/2024 - 11:00hs",
      doctor: "Dr. Fernández",
    },
  ]);

  const agregarTurno = (nuevoTurno) => {
    setTurnos((prev) => [...prev, { id: prev.length + 1, ...nuevoTurno }]);
  };

  return (
    <main className="flex justify-center w-full px-4 py-6">
      <div className="flex flex-col lg:flex-row w-full max-w-[1200px] gap-8">
        {/* Lista de turnos y filtros */}
        <div className="flex-1">
          <TurnosHeader />

          {role === "secretaria" && (
            <div className="mb-6 w-full max-w-md">
              <label className="text-lg font-semibold text-black block mb-2">
                Seleccionar médico:
              </label>
              <Select onValueChange={setSelectedDoctor}>
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

          <TurnosList turnos={turnos} />
        </div>

        {/* Asignar turno */}
        <div className="w-full lg:w-[382px]">
          <AsignarTurnoBox
            modo={role}
            doctores={[
              { id: 1, nombre: "Dr. Pepito Fernández" },
              { id: 2, nombre: "Dra. Juárez" },
            ]}
            onAgregarTurno={agregarTurno}
          />
        </div>
      </div>
    </main>
  );
}