
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function MedicoCard({ medico }) {
  // Prefijo Dr./Dra. según género si está disponible, si no, solo Dr.
  let prefijo = "Dr.";
  if (medico.genero) {
    if (medico.genero.toLowerCase() === "femenino" || medico.genero.toLowerCase() === "f" || medico.genero.toLowerCase() === "mujer") {
      prefijo = "Dra.";
    }
  }
  // Mostrar rol si está disponible
  const rol = medico.role ? medico.role.charAt(0).toUpperCase() + medico.role.slice(1) : "Profesional";

  return (
    <Card className="w-full max-w-xs shadow-md border border-gray-300 rounded-2xl">
      <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
        {/* Avatar */}
        <Avatar className="w-[120px] h-[120px] border border-black">
          <AvatarImage
            src={medico.avatar || ""}
            alt={medico.name || medico.nombre || ""}
            className="object-cover"
          />
          <AvatarFallback>Dr./Dra.</AvatarFallback>
        </Avatar>

        {/* Nombre */}
        <h3 className="font-bold text-lg">
          {prefijo} {medico.name || medico.nombre || "Sin nombre"}
        </h3>
        <span className="text-xs text-gray-500">{rol}</span>

        {/* Info */}
        <div className="text-sm text-left w-full space-y-1">
         <p><strong>F. Nacimiento:</strong> {medico.nacimiento ? new Date(medico.nacimiento).toLocaleDateString("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
}) : "Sin datos"}</p>
          <p><strong>Teléfono:</strong> {medico.telefono}</p>
          <Separator />
          <p><strong>Horarios:</strong> {medico.horarios}</p>
          <p><strong>Obras Sociales:</strong> {Array.isArray(medico.obrasSociales) ? medico.obrasSociales.join(", ") : medico.obrasSociales || "Sin datos"}</p>
          <p><strong>Plus:</strong> {medico.plus}</p>
          <p><strong>Particular:</strong> {medico.particular}</p>
          <p><strong>M.P:</strong> {medico.matricula}</p>
        </div>
      </CardContent>
    </Card>
  );
}