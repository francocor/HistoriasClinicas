import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TurnoPaciente from "@/components/turnos/TurnoPaciente";
import TurnoNuevoPaciente from "@/components/turnos/TurnoNuevoPaciente";
import BotonHarmonia from "@/components/ui/BotonHarmonia";
import AgendaPanel from "@/components/agenda/AgendaPanel";
import { useUser } from "@/context/UserContext";
import { useNotifications } from "@/context/NotificationContext";

export default function AsignarTurnoBox({ modo = "profesional", doctores = [], onAgregarTurno }) {
  const [showTurnoPaciente, setShowTurnoPaciente] = useState(false);
  const [showTurnoNuevoPaciente, setShowTurnoNuevoPaciente] = useState(false);
  const [showAgenda, setShowAgenda] = useState(false);
  const [agendaDoctor, setAgendaDoctor] = useState("");
  const [agendaTurnos, setAgendaTurnos] = useState([]);

  const { addNotification } = useNotifications();
  const { user } = useUser();

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

  const handleAbrirAgenda = async () => {
    setShowAgenda(true);
    setShowTurnoPaciente(false);
    setShowTurnoNuevoPaciente(false);

    let doctorId = user.id;
    if (modo === "secretaria" && doctores.length > 0) {
      doctorId = doctores[0].id;
    }

    setAgendaDoctor(doctorId);

    // ejemplo de carga desde backend
    try {
      const res = await fetch(`http://localhost:4000/api/turnos?doctorId=${doctorId}`);
      const data = await res.json();
      setAgendaTurnos(data);

      // ejemplo de Notificaciones simuladas
      addNotification(`🔔 Agenda de hoy para el profesional ID ${doctorId} cargada.`);
    } catch (err) {
      console.error("Error al cargar agenda:", err);
      setAgendaTurnos([]);
    }
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
              className="w-[120px] h-[100px] bg-gradient-to-b from-[#179cba] to-white rounded-full flex flex-col justify-center items-center shadow-md hover:opacity-80 transition"
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

      {showTurnoPaciente && (
        <TurnoPaciente
          modo={modo}
          doctores={doctores}
          onAgregarTurno={onAgregarTurno}
        />
      )}

      {showTurnoNuevoPaciente && (
        <TurnoNuevoPaciente
          modo={modo}
          doctores={doctores}
          onAgregarTurno={onAgregarTurno}
        />
      )}

      {showAgenda && (
        <AgendaPanel
          visible={showAgenda}
          onClose={() => setShowAgenda(false)}
          turnos={agendaTurnos}
          doctor={agendaDoctor}
        />
      )}
    </div>
  );
}

