import React, { useState, useEffect } from "react";
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
  const [selectedDoctor, setSelectedDoctor] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [profesionales,setProfesionales]= useState([])
  

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/asistencias/presentes");
        const data = await res.json();
        setTurnos(data);
      } catch (err) {
        console.error("Error al obtener turnos de asistencia:", err);
      }
    };

    fetchTurnos();
  }, []);
  useEffect(() => {
  const fetchProfesionales = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/profesionales");
      const data = await res.json();
            console.log("Profesionales recibidos:", data); // 👈 Agregá esto

      setProfesionales(data);
    } catch (err) {
      console.error("Error al obtener profesionales:", err);
    }
  };

  fetchProfesionales();
}, []);

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
  {profesionales.map((doc) => (
    <SelectItem key={doc.id} value={doc.id
}>
      {doc.name
}
    </SelectItem>
  ))}
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
            doctores={profesionales}
            onAgregarTurno={agregarTurno}
          />
        </div>
      </div>
    </main>
  );
}
