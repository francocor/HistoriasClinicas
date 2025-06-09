import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import Swal from "sweetalert2";

export default function TurnoPaciente({ modo = "profesional", doctores = [], onAgregarTurno }) {
  const [cobro, setCobro] = useState("");
  const [doctorSeleccionado, setDoctorSeleccionado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [fechaTurno, setFechaTurno] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (busqueda.length > 2) {
        try {
          const res = await fetch(`http://localhost:4000/api/pacientes/buscar?q=${busqueda}`);
          const data = await res.json();
          setResultados(data);
        } catch (err) {
          console.error("Error al buscar pacientes:", err);
        }
      } else {
        setResultados([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [busqueda]);

  const handleGrabar = async () => {
    if (!pacienteSeleccionado || !fechaTurno || (modo === "secretaria" && !doctorSeleccionado)) {
      Swal.fire("Faltan datos", "Por favor complete todos los campos antes de grabar.", "warning");
      return;
    }

    const doctor =
      modo === "secretaria"
        ? doctores.find((d) => d.id.toString() === doctorSeleccionado)?.name
        : "Dr. Pepito Fernández";

    try {
      const res = await fetch("http://localhost:4000/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paciente_id: pacienteSeleccionado.id,
          fecha: fechaTurno,
          doctor_nombre: doctor,
          creado_por: modo,
        }),
      });

      if (!res.ok) throw new Error("Error al crear turno");

      const nuevoTurno = await res.json();
      Swal.fire("Éxito", "Turno registrado", "success");

      // Resetear
      setCobro("");
      setDoctorSeleccionado("");
      setBusqueda("");
      setPacienteSeleccionado(null);
      setFechaTurno("");
    } catch (error) {
      console.error("Error al grabar turno:", error);
      Swal.fire("Error", "No se pudo grabar el turno", "error");
    }
  };

  return (
    <div className="flex justify-center w-full">
      <Card className="rounded-[20px] w-[254px] h-auto">
        <CardContent className="p-4">
          {/* Buscador */}
          <div className="relative mb-4">
            <Input
              placeholder="Buscar Paciente..."
              className="pl-8 border-black"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPacienteSeleccionado(null);
              }}
            />
            <Search className="absolute left-2 top-2 w-4 h-4 text-gray-500" />
          </div>

          {/* Resultados */}
          {resultados.length > 0 && !pacienteSeleccionado && (
            <ul className="bg-white border border-black rounded-md mb-3 max-h-40 overflow-y-auto">
              {resultados.map((pac) => (
                <li
                  key={pac.id}
                  className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setPacienteSeleccionado(pac);
                    setResultados([]);
                    setBusqueda(pac.nombre);
                  }}
                >
                  {pac.nombre} - {pac.dni}
                </li>
              ))}
            </ul>
          )}

          {/* Datos del paciente */}
          {pacienteSeleccionado && (
            <Card className="border border-black mb-4">
              <CardContent className="p-3 space-y-2">
                <h3 className="text-center font-semibold">Paciente</h3>
                <p><strong>Nombre:</strong> {pacienteSeleccionado.nombre}</p>
                <p><strong>DNI:</strong> {pacienteSeleccionado.dni}</p>
                <p><strong>Obra Social:</strong> {pacienteSeleccionado.obra_social || "Sin datos"}</p>
              </CardContent>
            </Card>
          )}

          {/* Profesional */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Profesional:</label>
            {modo === "secretaria" ? (
              <Select onValueChange={setDoctorSeleccionado}>
                <SelectTrigger className="w-full h-8 border-black">
                  <SelectValue placeholder="Seleccione médico" />
                </SelectTrigger>
                <SelectContent>
                  {doctores.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id.toString()}>
                      {doc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input value="Dr. Pepito Fernández" readOnly className="w-full h-8 border-black" />
            )}
          </div>

          {/* Fecha del turno */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Fecha y hora del turno:</label>
            <Input
  type="datetime-local"
  className="w-full h-8 border-black"
  value={fechaTurno}
  onChange={(e) => setFechaTurno(e.target.value)}
  min={new Date().toISOString().slice(0, 16)} // esto limita desde hoy con hora
/>
          </div>

          {/* Cobro (opcional) */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Cobro:</label>
            <Input
              className="w-full h-8 border-black"
              value={cobro}
              onChange={(e) => setCobro(e.target.value)}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-between">
            <Button
              onClick={handleGrabar}
              disabled={!pacienteSeleccionado || !fechaTurno || (modo === "secretaria" && !doctorSeleccionado)}
              className="rounded-[40px] bg-gradient-to-b from-cyan-300 to-cyan-500 text-black px-4"
            >
              Grabar
            </Button>
            <Button
              variant="outline"
              className="rounded-[40px] border-black text-black px-4"
              onClick={() => {
                setCobro("");
                setDoctorSeleccionado("");
                setBusqueda("");
                setPacienteSeleccionado(null);
                setFechaTurno("");
              }}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
