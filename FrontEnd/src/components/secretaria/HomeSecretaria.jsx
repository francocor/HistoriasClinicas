import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import Swal from "sweetalert2";
import AsignarTurnoBox from "@/components/turnos/AsignarTurnoBox";

export default function HomeSecretaria() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [profesionales, setProfesionales] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/profesionales")
      .then((res) => res.json())
      .then(setProfesionales)
      .catch((err) => console.error("Error cargando profesionales:", err));
  }, []);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/asistencias/presentes");
        const data = await res.json();
        setTurnos(data);
      } catch (err) {
        console.error("Error al obtener turnos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
  }, []);

  const marcarAsistencia = async (turnoId, estado) => {
    try {
      const res = await fetch(`http://localhost:4000/api/asistencias/${turnoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });

      if (!res.ok) throw new Error("Error al registrar asistencia");

      setTurnos((prev) => prev.filter((t) => t.id !== turnoId));
      Swal.fire({
        icon: "success",
        title: "Asistencia registrada",
        text: `Turno marcado como ${estado}`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al marcar asistencia:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se pudo registrar la asistencia.",
      });
    }
  };

  const totalPages = Math.ceil(turnos.length / itemsPerPage);
  const indexStart = (currentPage - 1) * itemsPerPage;
  const turnosPaginados = turnos.slice(indexStart, indexStart + itemsPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const abrirModalEdicion = (turno) => {
    setTurnoSeleccionado({
      ...turno,
      doctorId: turno.doctorId,
      especialidad: turno.especialidad,
    });
    setModalAbierto(true);
  };

  const formatearFechaLocal = (fecha) => {
    const date = new Date(fecha);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  const esFechaValida = (fechaISO) => new Date(fechaISO) >= new Date();

  return (
    <main className="w-full flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-[1400px] flex flex-col lg:flex-row justify-center gap-10">
        {/* Turnos próximos */}
        <div className="w-full max-w-[480px] bg-gradient-to-b from-white via-[#4fdfbe] to-[#33bebc] rounded-[20px] p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[28px] font-semibold text-black">Próximos Turnos</h2>
            <Calendar className="w-8 h-8 text-black" />
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Cargando turnos...</p>
          ) : turnosPaginados.length === 0 ? (
            <p className="text-center text-black">No hay turnos próximos.</p>
          ) : (
            <div className="space-y-4">
              {turnosPaginados.map((appointment) => (
                <Card key={appointment.id} className="bg-white border border-black rounded-[20px]">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium text-black">{appointment.patientName}</p>
                      <Button onClick={() => marcarAsistencia(appointment.id, "ausente")} className="rounded-full bg-white text-black border border-black px-4 h-8 text-sm shadow">
                        Ausente
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-base text-black">
                        {new Date(appointment.appointmentDate).toLocaleString("es-AR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                      <Button onClick={() => abrirModalEdicion(appointment)} className="rounded-full bg-white text-black border border-black px-4 h-8 text-sm shadow">
                        Editar
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-base text-black">{appointment.doctorName}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Paginación */}
          {turnos.length > itemsPerPage && (
            <Pagination className="mt-6 w-full flex justify-center">
              <PaginationContent className="flex justify-center gap-6">
                <PaginationItem>
                  <PaginationLink onClick={handlePrev} disabled={currentPage === 1}>
                    Anterior
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={handleNext} disabled={currentPage === totalPages}>
                    Siguiente
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        {/* Asignar turno */}
        <div className="w-full max-w-[420px]">
          <AsignarTurnoBox
            modo="secretaria"
            doctores={profesionales}
            onAgregarTurno={(nuevo) => setTurnos((prev) => [...prev, nuevo])}
          />
        </div>
      </div>

      {/* Modal Edición */}
      {modalAbierto && turnoSeleccionado && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Editar Turno</h2>
            <div className="space-y-4">
              <input
                value={turnoSeleccionado.patientName}
                onChange={(e) =>
                  setTurnoSeleccionado({ ...turnoSeleccionado, patientName: e.target.value })
                }
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="datetime-local"
                value={formatearFechaLocal(turnoSeleccionado.appointmentDate)}
                onChange={(e) =>
                  setTurnoSeleccionado({ ...turnoSeleccionado, appointmentDate: e.target.value })
                }
                className="border border-gray-300 p-2 w-full rounded"
              />

              {/* Doctor y Especialidad */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Doctor</label>
                <select
                  className="border border-gray-300 p-2 w-full rounded"
                  value={turnoSeleccionado.doctorId || ""}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const doc = profesionales.find((d) => d.id === selectedId);
                    setTurnoSeleccionado((prev) => ({
                      ...prev,
                      doctorId: selectedId,
                      especialidad: doc?.especialidad || "",
                    }));
                  }}
                >
                  <option value="" disabled>Seleccionar doctor</option>
                  {profesionales.map((doc) => (
                    <option key={doc.id} value={doc.id}>{doc.name}</option>
                  ))}
                </select>

                <label className="text-sm font-medium text-gray-700">Especialidad</label>
                <input
                  className="border border-gray-300 p-2 w-full rounded"
                  value={turnoSeleccionado.especialidad || ""}
                  readOnly
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setModalAbierto(false)}>Cancelar</Button>
              <Button
                onClick={async () => {
                  if (!esFechaValida(turnoSeleccionado.appointmentDate)) {
                    return Swal.fire("Fecha inválida", "La fecha no puede ser anterior a hoy", "warning");
                  }

                  try {
                    const res = await fetch(`http://localhost:4000/api/turnos/${turnoSeleccionado.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        paciente_nombre: turnoSeleccionado.patientName,
                        fecha: turnoSeleccionado.appointmentDate,
                        doctor_id: turnoSeleccionado.doctorId,
                        especialidad: turnoSeleccionado.especialidad,
                      }),
                    });

                    if (!res.ok) throw new Error("Error");

                    Swal.fire("Turno actualizado", "", "success");
                    setTurnos((prev) =>
                      prev.map((t) =>
                        t.id === turnoSeleccionado.id ? turnoSeleccionado : t
                      )
                    );
                    setModalAbierto(false);
                  } catch (err) {
                    console.error(err);
                    Swal.fire("Error", "No se pudo actualizar el turno", "error");
                  }
                }}
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
