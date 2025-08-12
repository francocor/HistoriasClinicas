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

export default function TurnoPaciente({ modo = "profesional", doctores = [] }) {
  const [cobro, setCobro] = useState("");
  const [doctorSeleccionado, setDoctorSeleccionado] = useState("");
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [fechaTurno, setFechaTurno] = useState("");
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;

  const especialidadesUnicas = Array.from(new Set(doctores.map((d) => d.especialidad)));
  const doctoresFiltrados = doctores.filter((doc) => doc.especialidad === especialidadSeleccionada);

  // Buscar pacientes
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

  // Autocompletar profesional logueado
  useEffect(() => {
    if (modo === "profesional" && doctores.length > 0) {
      const miDoctor = doctores.find((doc) => doc.user_id === userId);
      if (miDoctor) {
        setEspecialidadSeleccionada(miDoctor.especialidad);
        setDoctorSeleccionado(miDoctor.profesional_id.toString());
      }
    }
  }, [modo, doctores]);

  // Cargar horarios del doctor seleccionado
  useEffect(() => {
    if (doctorSeleccionado) {
      fetch(`http://localhost:4000/api/horarios/${doctorSeleccionado}`)
        .then(res => res.json())
        .then(data => setHorariosDisponibles(data))
        .catch(err => console.error("Error cargando horarios:", err));
    } else {
      setHorariosDisponibles([]);
    }
  }, [doctorSeleccionado]);

  // Validar día
  const validarDia = (fecha) => {
    const dayName = new Date(fecha).toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();
    return horariosDisponibles.some(h => h.dia_semana.toLowerCase() === dayName);
  };

  // Validar hora
  const validarHora = (fechaHora) => {
    const fecha = new Date(fechaHora);
    const dayName = fecha.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();
    const horarioDia = horariosDisponibles.find(h => h.dia_semana.toLowerCase() === dayName);
    if (!horarioDia) return false;

    const [hIn, mIn] = horarioDia.hora_entrada.split(":").map(Number);
    const [hOut, mOut] = horarioDia.hora_salida.split(":").map(Number);
    const horaNum = fecha.getHours() * 100 + fecha.getMinutes();
    const entradaNum = hIn * 100 + mIn;
    const salidaNum = hOut * 100 + mOut;

    return horaNum >= entradaNum && horaNum <= salidaNum;
  };

  // Grabar turno
  const handleGrabar = async () => {
    if (!pacienteSeleccionado || !fechaTurno || (modo !== "profesional" && !doctorSeleccionado)) {
      Swal.fire("Faltan datos", "Por favor complete todos los campos antes de grabar.", "warning");
      return;
    }

    const doctorId = parseInt(doctorSeleccionado);

    try {
      const res = await fetch("http://localhost:4000/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paciente_id: pacienteSeleccionado.id,
          fecha: fechaTurno,
          doctor_id: doctorId,
          especialidad: especialidadSeleccionada,
          creado_por: modo,
        }),
      });

      if (!res.ok) throw new Error("Error al crear turno");

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Turno y paciente registrados",
      }).then(() => {
        window.location.reload();
      });
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

          {/* Datos paciente */}
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

          {/* Especialidad */}
          {modo !== "profesional" && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Especialidad:</label>
              <Select
                onValueChange={(value) => {
                  setEspecialidadSeleccionada(value);
                  setDoctorSeleccionado("");
                }}
                value={especialidadSeleccionada}
              >
                <SelectTrigger className="w-full h-8 border-black">
                  <SelectValue placeholder="Seleccione especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {especialidadesUnicas.map((esp) => (
                    <SelectItem key={esp} value={esp}>
                      {esp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Profesional */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Profesional:</label>
            {modo === "profesional" ? (
              doctorSeleccionado && (
                <Input
                  value={doctores.find((d) => d.profesional_id.toString() === doctorSeleccionado)?.name || ""}
                  readOnly
                  className="w-full h-8 border-black"
                />
              )
            ) : especialidadSeleccionada ? (
              <Select onValueChange={setDoctorSeleccionado} value={doctorSeleccionado}>
                <SelectTrigger className="w-full h-8 border-black">
                  <SelectValue placeholder="Seleccione médico" />
                </SelectTrigger>
                <SelectContent>
                  {doctoresFiltrados.map((doc) => (
                    <SelectItem key={doc.profesional_id} value={doc.profesional_id.toString()}>
                      {doc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                disabled
                value=""
                placeholder="Seleccione especialidad primero"
                className="w-full h-8 border-black text-gray-500"
              />
            )}
          </div>

          {/* Fecha */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Fecha y hora del turno:</label>
            <Input
              type="datetime-local"
              className="w-full h-8 border-black"
              value={fechaTurno}
              onChange={(e) => {
                const valor = e.target.value;

                // Validar día
                if (!validarDia(valor)) {
                  Swal.fire("Día no disponible", "El profesional no trabaja ese día.", "warning");
                  setFechaTurno("");
                  return;
                }

                // Validar horario
                if (!validarHora(valor)) {
                  Swal.fire("Horario inválido", "El profesional no atiende en esa franja horaria.", "warning");
                  setFechaTurno("");
                  return;
                }

                setFechaTurno(valor);
              }}
              min={new Date().toISOString().slice(0, 16)}
              disabled={!doctorSeleccionado}
            />
          </div>

          {/* Cobro */}
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
              disabled={!pacienteSeleccionado || !fechaTurno || (modo !== "profesional" && !doctorSeleccionado)}
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
                setEspecialidadSeleccionada("");
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
