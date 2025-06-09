import React, { useEffect, useState } from "react";
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


export default function HomeSecretaria() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [pacientes, setPacientes] = useState([]);
const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
  fetch("http://localhost:4000/api/pacientes")
    .then((res) => res.json())
    .then(setPacientes)
    .catch((err) => console.error("Error cargando pacientes:", err));
}, []);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/turnos/proximos");
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

    // Sacar de la lista de turnos porque ya tiene asistencia
    setTurnos((prevTurnos) => prevTurnos.filter((t) => t.id !== turnoId));

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

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const abrirModalEdicion = (turno) => {
  setTurnoSeleccionado(turno);
  setModalAbierto(true);
};
const esFechaValida = (fechaISO) => {
  const fechaTurno = new Date(fechaISO);
  const ahora = new Date();
  return fechaTurno >= ahora;
};
const formatearFechaLocal = (fecha) => {
  const date = new Date(fecha);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

  return (
    <section className="flex flex-col items-center py-10 px-4 w-full">
      <div className="w-full max-w-[420px] bg-gradient-to-b from-white via-[#4fdfbe] to-[#33bebc] rounded-[20px] p-6">
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
              <Card
                key={appointment.id}
                className="bg-white border border-black rounded-[20px]"
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium text-black">
                      {appointment.patientName}
                    </p>
                    <Button className="rounded-full bg-white text-black border border-black px-4 h-8 text-sm shadow" onClick={() => marcarAsistencia(appointment.id, "presente")}>
                      Presente
                    </Button>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-base text-black">
                      {new Date(appointment.appointmentDate).toLocaleString("es-AR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                    <Button className="rounded-full bg-white text-black border border-black px-4 h-8 text-sm shadow" onClick={() => marcarAsistencia(appointment.id, "ausente")}>
                      Ausente
                    </Button>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-base text-black">{appointment.doctor}</p>
                     <Button   onClick={() => abrirModalEdicion(appointment)}
 className="rounded-full bg-white text-black border border-black px-4 h-8 text-sm shadow">
                          Editar
                        </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Paginación */}
        {turnos.length > itemsPerPage && (
          <Pagination className="mt-6">
            <PaginationContent className="flex justify-center gap-8">
              <PaginationItem>
  <PaginationLink
    onClick={handlePrev}
    className={`px-6 py-2 rounded-full border text-lg min-w-[120px] text-center transition ${
      currentPage === 1
        ? "bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed"
        : "border-black text-black bg-white hover:bg-gray-100 cursor-pointer"
    }`}
    disabled={currentPage === 1}
  >
    Anterior
  </PaginationLink>
</PaginationItem>

<PaginationItem>
  <PaginationLink
    onClick={handleNext}
    className={`px-6 py-2 rounded-full border text-lg min-w-[120px] text-center transition ${
      currentPage === totalPages
        ? "bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed"
        : "border-black text-black bg-white hover:bg-gray-100 cursor-pointer"
    }`}
    disabled={currentPage === totalPages}
  >
    Siguiente
  </PaginationLink>
</PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
     {modalAbierto && turnoSeleccionado && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Editar Turno</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Paciente</label>
          <input
            type="text"
            value={turnoSeleccionado.patientName}
            onChange={(e) =>
              setTurnoSeleccionado({ ...turnoSeleccionado, patientName: e.target.value })
            }
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha</label>
          <input
  type="datetime-local"
  value={formatearFechaLocal(turnoSeleccionado.appointmentDate)}

  min={new Date().toISOString().slice(0, 16)} // 🛑 Bloquea fechas pasadas
  onChange={(e) =>
    setTurnoSeleccionado({ ...turnoSeleccionado, appointmentDate: e.target.value })
  }
  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
/>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Doctor</label>
          <input
            type="text"
            value={turnoSeleccionado.doctor}
            onChange={(e) =>
              setTurnoSeleccionado({ ...turnoSeleccionado, doctor: e.target.value })
            }
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => setModalAbierto(false)}
        >
          Cancelar
        </Button>
        <Button
  onClick={async () => {
    const fechaValida = esFechaValida(turnoSeleccionado.appointmentDate);

    if (!fechaValida) {
      return Swal.fire({
        icon: "warning",
        title: "Fecha inválida",
        text: "La fecha y hora del turno no puede ser anterior al momento actual.",
      });
    }

    try {
      const res = await fetch("http://localhost:4000/api/turnos/" + turnoSeleccionado.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paciente_nombre: turnoSeleccionado.patientName,
          fecha: turnoSeleccionado.appointmentDate,
          doctor_nombre: turnoSeleccionado.doctor,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar turno");

      Swal.fire("¡Actualizado!", "El turno fue modificado con éxito", "success");
      setModalAbierto(false);

      // Refrescar la lista
      setTurnos((prev) =>
        prev.map((t) =>
          t.id === turnoSeleccionado.id ? turnoSeleccionado : t
        )
      );
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

    </section>
    
  );
}
