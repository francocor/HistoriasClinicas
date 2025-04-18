import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Campos de la consulta
const patientFields = [
  "Fecha y Hora:",
  "Motivo de la consulta:",
  "Síntomas:",
  "Parámetros:",
  "Diagnóstico:",
  "Tratamiento:",
  "Medicamentos recetados:",
];

export default function AtencionCard() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Card de información */}
      <Card className="w-full border border-black">
        <CardContent className="p-6">
          {patientFields.map((label, index) => (
            <div key={index} className="mb-6">
              <label className="text-xl font-sans block mb-2">{label}</label>
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-center gap-6 mt-8">
        <Button
          variant="outline"
          className="rounded-[40px] shadow-[8px_8px_1.9px_rgba(0,0,0,0.25)] text-lg font-sans w-[100px] h-10"
        >
          Editar
        </Button>
        <Button
          variant="outline"
          className="rounded-[40px] shadow-[8px_8px_1.9px_rgba(0,0,0,0.25)] text-lg font-sans w-[100px] h-10"
        >
          Aceptar
        </Button>
        <Button
          variant="outline"
          className="rounded-[40px] shadow-[8px_8px_1.9px_rgba(0,0,0,0.25)] text-lg font-sans w-[100px] h-10"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}