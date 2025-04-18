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
import { Search } from "lucide-react";

// Datos del formulario
const formFields = [
  { id: "nombre", label: "Nombre:", type: "text" },
  { id: "apellido", label: "Apellido:", type: "text" },
  { id: "dni", label: "D.N.I:", type: "text" },
  { id: "osocial", label: "O. social:", type: "text" },
];

export default function TurnoPaciente({ onCancel }) {
  return (
    <div className="bg-transparent flex flex-row justify-center w-full">
      <Card className="rounded-[20px] w-[254px] h-[310px] relative overflow-hidden">
        <CardContent className="p-0">
          {/* Barra de búsqueda */}
          <div className="relative mt-[11px] mx-[22px]">
            <div className="relative">
              <Input
                className="h-[17px] pl-6 py-0 text-base border-black bg-white font-['Inter-Regular',Helvetica]"
                placeholder="Buscar Paciente..."
              />
              <Search className="absolute w-[15px] h-[15px] top-[1px] left-0.5 text-[#969191]" />
            </div>
          </div>

          {/* Información del paciente */}
          <div className="mx-[22px] mt-3">
            <Card className="border border-solid border-black">
              <CardContent className="p-0">
                <div className="p-[9px] relative">
                  <div className="absolute top-0 left-[72px] font-['Inter-Regular',Helvetica] text-black text-base">
                    Paciente
                  </div>

                  {formFields.map((field) => (
                    <div key={field.id} className="mt-[19px] first:mt-[30px]">
                      <div className="flex">
                        <label
                          htmlFor={field.id}
                          className="font-['Inter-Regular',Helvetica] text-black text-base"
                        >
                          {field.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profesional */}
          <div className="mt-[10px] mx-[22px] flex items-center">
            <label className="font-['Inter-Regular',Helvetica] text-black text-base">
              Profesional:
            </label>
            <div className="ml-2 flex-1">
              <Select>
                <SelectTrigger className="h-[17px] py-0 border-black bg-white">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prof1">Profesional 1</SelectItem>
                  <SelectItem value="prof2">Profesional 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cobro */}
          <div className="mt-[10px] mx-[22px]">
            <label className="font-['Inter-Regular',Helvetica] text-black text-base">
              Cobro:
            </label>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between mt-[10px] mx-[22px]">
            <Button className="rounded-[40px] font-['Inter-Regular',Helvetica] text-black text-base bg-gradient-to-b from-[#87CEEB] to-[#5F9EA0]">
              Grabar
            </Button>

            <Button
              variant="outline"
              onClick={onCancel}
              className="rounded-[40px] font-['Inter-Regular',Helvetica] text-black text-base bg-gradient-to-b from-[#87CEEB] to-[#5F9EA0]"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
