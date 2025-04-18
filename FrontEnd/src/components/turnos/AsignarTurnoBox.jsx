import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TurnoPaciente from "@/components/turnos/TurnoPaciente";
import TurnoNuevoPaciente from "@/components/turnos/TurnoNuevoPaciente";

export default function AsignarTurnoBox() {
  const [showTurnoPaciente, setShowTurnoPaciente] = useState(false);
  const [showTurnoNuevoPaciente, setShowTurnoNuevoPaciente] = useState(false);

  const handleNuevoTurno = () => {
    setShowTurnoPaciente(true);
    setShowTurnoNuevoPaciente(false);
  };

  const handleNuevoPaciente = () => {
    setShowTurnoNuevoPaciente(true);
    setShowTurnoPaciente(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <Card className="w-full lg:w-[382px] rounded-[30px] bg-white">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-center text-2xl font-sans font-semibold text-black">
            Asignar Turno
          </h2>

          {/* Acceso a la Agenda */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-[120px] h-[100px] bg-gradient-to-b from-[#179cba] to-white rounded-full flex flex-col justify-center items-center shadow-md">
              <Calendar className="w-[40px] h-[40px] text-black" />
              <span className="text-base font-sans text-black">Agenda</span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col items-center gap-2">
            <Button
              onClick={handleNuevoTurno}
              className="w-[149px] h-[29px] rounded-[40px] bg-gradient-to-b from-[#179cba] to-white text-xl font-normal text-black font-sans"
            >
              Nuevo turno
            </Button>

            <Button
              onClick={handleNuevoPaciente}
              className="w-[191px] h-[29px] rounded-[40px] bg-gradient-to-b from-[#179cba] to-white text-xl font-normal text-black font-sans"
            >
              Nuevo Paciente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Formularios condicionales */}
      {showTurnoPaciente && <TurnoPaciente />}
      {showTurnoNuevoPaciente && <TurnoNuevoPaciente />}
    </div>
  );
}