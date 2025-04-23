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

export default function TurnoPaciente({ modo = "profesional", doctores = [] }) {
  return (
    <div className="flex justify-center w-full">
      <Card className="rounded-[20px] w-[254px] h-auto">
        <CardContent className="p-4">
          {/* Buscador */}
          <div className="relative mb-4">
            <Input placeholder="Buscar Paciente..." className="pl-8 border-black" />
            <Search className="absolute left-2 top-2 w-4 h-4 text-gray-500" />
          </div>

          {/* Datos del paciente */}
          <Card className="border border-black mb-4">
            <CardContent className="p-3 space-y-2">
              <h3 className="text-center font-semibold">Paciente</h3>
              <p>Nombre:</p>
              <p>Apellido:</p>
              <p>DNI:</p>
              <p>Obra Social:</p>
            </CardContent>
          </Card>

          {/* Profesional */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Profesional:</label>
            {modo === "secretaria" && doctores.length > 0 ? (
              <Select>
                <SelectTrigger className="w-full h-8 border-black">
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
                value="Dr. Pepito Fernández"
                readOnly
                className="w-full h-8 border-black"
              />
            )}
          </div>

          {/* Cobro */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Cobro:</label>
            <Input className="w-full h-8 border-black" />
          </div>

          {/* Botones */}
          <div className="flex justify-between">
            <Button className="rounded-[40px] bg-gradient-to-b from-cyan-300 to-cyan-500 text-black px-4">
              Grabar
            </Button>
            <Button
              variant="outline"
              className="rounded-[40px] border-black text-black px-4"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}