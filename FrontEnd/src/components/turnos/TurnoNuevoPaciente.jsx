import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown, X } from "lucide-react";
import React from "react";

export default function TurnoNuevoPaciente({ onClose }) {
  const formFields = [
    { id: "nombre", label: "Nombre", type: "text" },
    { id: "apellido", label: "Apellido", type: "text" },
    { id: "dni", label: "D.N.I", type: "text" },
    { id: "fecha", label: "Fecha", type: "text" },
    { id: "hora", label: "Hora", type: "text" },
    { id: "osocial", label: "O. social", type: "text" },
    { id: "cobro", label: "Cobro", type: "text" },
  ];

  return (
    <div className="flex justify-center w-full">
      <Card className="w-[377px] rounded-[20px] overflow-hidden relative">
        <CardContent className="p-4 space-y-3">
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-black hover:text-red-600 transition-colors"
            title="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Campos del formulario */}
          {formFields.map((field) => (
            <div key={field.id} className="flex items-center">
              <label
                htmlFor={field.id}
                className="w-24 font-normal text-black text-base"
              >
                {field.label}
              </label>
              <Input
                id={field.id}
                type={field.type}
                className="h-[17px] border border-solid border-black bg-white rounded-none"
              />
            </div>
          ))}

          {/* Campo de profesional */}
          <div className="flex items-center">
            <label
              htmlFor="professional"
              className="w-24 font-normal text-black text-base"
            >
              Profesional
            </label>
            <div className="flex items-center">
              <Input
                id="professional"
                className="w-[107px] h-[17px] border border-solid border-black bg-white rounded-none"
                readOnly
              />
              <ChevronDown className="w-[15px] h-[19px] ml-2" />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-center space-x-10 mt-6">
            <Button
              variant="outline"
              className="rounded-[40px] px-4 py-1.5 border border-black bg-gradient-to-b from-cyan-300 to-cyan-500 text-black"
            >
              Grabar
            </Button>
            <Button
              variant="outline"
              className="rounded-[40px] px-4 py-1.5 border border-black bg-gradient-to-b from-cyan-300 to-cyan-500 text-black"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
