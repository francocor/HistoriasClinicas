import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TurnoPaciente from "@/components/turnos/TurnoPaciente";
import TurnoNuevoPaciente from "@/components/turnos/TurnoNuevoPaciente";
import BotonHarmonia from "@/components/ui/BotonHarmonia";

export default function AsignarTurnoBox({ modo = "profesional", doctores = [], onAgregarTurno }) {
  const [showTurnoPaciente, setShowTurnoPaciente] = useState(false);
  const [showTurnoNuevoPaciente, setShowTurnoNuevoPaciente] = useState(false);
  const [showAgenda, setShowAgenda] = useState(false);

  const handleNuevoTurno = () => {
    setShowTurnoPaciente(true);
    setShowTurnoNuevoPaciente(false);
    setShowAgenda(false);
  };

  const handleNuevoPaciente = () => {
    setShowTurnoNuevoPaciente(true);
    setShowTurnoPaciente(false);
    setShowAgenda(false);
  };

  const handleAbrirAgenda = () => {
    setShowAgenda(true);
    setShowTurnoPaciente(false);
    setShowTurnoNuevoPaciente(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <Card className="w-full lg:w-[382px] rounded-[30px] bg-white">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-center text-2xl font-sans font-semibold text-black">
            Asignar Turno
          </h2>

          {/* Botón de Agenda */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleAbrirAgenda}
              className="w-[120px] h-[100px] bg-gradient-to-b from-[#179cba] to-white rounded-full flex flex-col justify-center items-center shadow-md hover:scale-105 transition-transform"
            >
              <Calendar className="w-[40px] h-[40px] text-black" />
              <span className="text-base font-sans text-black">Agenda</span>
            </button>
          </div>

          {/* Botones de formulario */}
          <div className="flex flex-col items-center gap-2">
            <BotonHarmonia onClick={handleNuevoTurno}>Nuevo turno</BotonHarmonia>
            <BotonHarmonia onClick={handleNuevoPaciente}>Nuevo Paciente</BotonHarmonia>
          </div>
        </CardContent>
      </Card>

      {/* Formulario para paciente ya cargado */}
      {showTurnoPaciente && (
        <TurnoPaciente
          modo={modo}
          doctores={doctores}
          onAgregarTurno={onAgregarTurno}
        />
      )}

      {/* Formulario para paciente nuevo */}
      {showTurnoNuevoPaciente && (
        <TurnoNuevoPaciente
          modo={modo}
          doctores={doctores}
          onAgregarTurno={onAgregarTurno}
        />
      )}

      {/* Vista simple de agenda */}
      {showAgenda && (
        <div className="bg-white w-full max-w-md p-4 border border-black rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2 text-center">Agenda del día</h3>
          <ul className="text-sm text-black space-y-1 list-disc list-inside">
            <li>09:00 - Juan Pérez</li>
            <li>09:30 - Laura Gómez</li>
            <li>10:00 - Carlos Ramírez</li>
          </ul>
          <div className="flex justify-end mt-4">
            <BotonHarmonia onClick={() => setShowAgenda(false)}>
              Cerrar
            </BotonHarmonia>
          </div>
        </div>
      )}
    </div>
  );
}
