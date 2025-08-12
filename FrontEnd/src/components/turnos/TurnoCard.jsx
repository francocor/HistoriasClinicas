import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BotonHarmonia from "@/components/ui/BotonHarmonia";
import Swal from "sweetalert2";

export default function TurnoCard({id,patientId, patientName, appointmentDate, doctor }) {
  const navigate = useNavigate();
   const user = JSON.parse(sessionStorageStorage.getItem("user"));
  const role = user?.role;

  // Formatear fecha (ej: 14/06/2025 - 10 hs)
  const formatearFechaHora = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    const hora = String(fecha.getHours()).padStart(2, "0");
    return `${dia}/${mes}/${anio} - ${hora} hs`;
  };
   const marcarAsistencia = async (turnoId, estado) => {
      try {
        const res = await fetch(`http://localhost:4000/api/asistencias/${turnoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado }),
        });
  
        if (!res.ok) throw new Error("Error al registrar asistencia");
  
        Swal.fire({
           icon: "success",
  title: "Inasistencia registrada",
  text: `Turno marcado como ${estado}`,
  confirmButtonText: "OK",
}).then(() => {
  window.location.reload();
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
  return (
    <Card className="w-full rounded-[20px] border border-black">
      <CardContent className="p-4 relative space-y-4">
        {/* Nombre del paciente */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-sans font-medium text-black">
            {patientName}
          </span>
          
           {role !== "secretaria" && (
            <BotonHarmonia onClick={() => navigate("/atencion", { state: { id, patientId } })}>
              Atender
            </BotonHarmonia>
          )}
          <BotonHarmonia onClick={() => marcarAsistencia(id, "ausente")}>
              Ausente
            </BotonHarmonia>
        </div>

        {/* Fecha del turno */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-sans text-black">{formatearFechaHora(appointmentDate)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-sans text-black">{doctor}</span>
        </div>
        {/* <div className="flex justify-between items-center">
          <span className="text-xl font-sans text-black">{appointmentDate}</span>
          <BotonHarmonia
            onClick={() => navigate("/atencion")}
            
          >
            Ausente
          </BotonHarmonia>
        </div> */}

        {/* Médico tratante */}
        {/* <div className="flex justify-between items-center">
          <span className="text-xl font-sans text-black">{doctor}</span>
          <BotonHarmonia
            onClick={() => navigate("/atencion")}
            
          >
            Editar
          </BotonHarmonia>
        </div> */}
      </CardContent>
    </Card>
  );
}