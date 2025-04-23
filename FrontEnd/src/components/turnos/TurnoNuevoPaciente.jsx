import React from "react";
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

export default function TurnoNuevoPaciente({ modo = "profesional", doctores = [] }) {
  const campos = [
    { id: "nombre", label: "Nombre" },
    { id: "apellido", label: "Apellido" },
    { id: "dni", label: "DNI" },
    { id: "fecha", label: "Fecha" },
    { id: "hora", label: "Hora" },
    { id: "osocial", label: "Obra Social" },
    { id: "cobro", label: "Cobro" },
  ];

  return (
    <div className="flex justify-center w-full">
      <Card className="w-[377px] rounded-[20px] overflow-hidden">
        <CardContent className="p-4 space-y-3">
          {campos.map((campo) => (
            <div key={campo.id} className="flex items-center">
              <label htmlFor={campo.id} className="w-24 text-black text-sm">
                {campo.label}
              </label>
              <Input
                id={campo.id}
                className="h-[28px] border border-black bg-white rounded-md flex-1"
              />
            </div>
          ))}

          {/* Profesional */}
          <div className="flex items-center">
            <label className="w-24 text-black text-sm">Profesional</label>
            {modo === "secretaria" && doctores.length > 0 ? (
              <Select>
                <SelectTrigger className="h-[28px] border border-black bg-white rounded-md w-full">
                  <SelectValue placeholder="Seleccione médico" />
                </SelectTrigger>
                <SelectContent>
                  {doctores.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id.toString()}>
                      {doc.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                readOnly
                value="Dr. Pepito Fernández"
                className="h-[28px] border border-black bg-white rounded-md flex-1"
              />
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-4">
            <Button className="rounded-[40px] px-4 bg-gradient-to-b from-cyan-300 to-cyan-500 text-black">
              Grabar
            </Button>
            <Button
              variant="outline"
              className="rounded-[40px] px-4 border-black text-black"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
