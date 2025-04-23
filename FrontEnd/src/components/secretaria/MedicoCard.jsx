import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function MedicoCard({ medico }) {
  return (
    <Card className="w-full max-w-xs shadow-md border border-gray-300 rounded-2xl">
      <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
        {/* Avatar */}
        <Avatar className="w-[120px] h-[120px] border border-black">
          <AvatarImage
            src={medico.avatar || ""}
            alt={medico.nombre}
            className="object-cover"
          />
          <AvatarFallback>DR</AvatarFallback>
        </Avatar>

        {/* Nombre */}
        <h3 className="font-bold text-lg">{medico.nombre}</h3>

        {/* Info */}
        <div className="text-sm text-left w-full space-y-1">
          <p><strong>F. Nacimiento:</strong> {medico.nacimiento}</p>
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