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
import BuscadorPaciente from "@/components/ui/BuscadorPaciente";

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
    <main className="w-full flex justify-center px-4 py-8">
      <div className="w-full max-w-[1300px] flex flex-col lg:flex-row items-start justify-center gap-10">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="w-full lg:w-2/3 flex flex-col items-start">
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

        {/* COLUMNA DERECHA */}
        <div className="w-full lg:w-[400px] flex flex-col items-center gap-6">
          <div className="w-full">
            <BuscadorPaciente />
          </div>

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