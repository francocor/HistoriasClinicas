import React, { useState } from "react";
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

export default function TurnoNuevoPaciente({ modo = "profesional", doctores = [], onAgregarTurno }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    fecha: "",
    hora: "",
    osocial: "",
    cobro: "",
    profesionalId: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleGrabar = () => {
    const camposObligatorios = ["nombre", "apellido", "dni", "telefono", "fecha", "hora", "osocial"];
    const faltanCampos = camposObligatorios.some((campo) => !formData[campo]);

    const necesitaMedico = modo === "secretaria" && !formData.profesionalId;

    if (faltanCampos || necesitaMedico) {
      alert("Por favor complete todos los campos obligatorios.");
      return;
    }

    const doctorNombre =
      modo === "secretaria"
        ? doctores.find((d) => d.id.toString() === formData.profesionalId)?.nombre || "Profesional"
        : "Dr. Pepito Fernández";

    const nuevoTurno = {
      id: Date.now(),
      patientName: `${formData.nombre} ${formData.apellido}`,
      appointmentDate: `${formData.fecha} - ${formData.hora}hs`,
      doctor: doctorNombre,
      telefono: formData.telefono,
    };

    onAgregarTurno(nuevoTurno);
  };

  return (
    <div className="flex justify-center w-full">
      <Card className="w-[377px] rounded-[20px] overflow-hidden">
        <CardContent className="p-4 space-y-3">
          {["nombre", "apellido", "dni", "telefono", "osocial", "cobro"].map((campo) => (
            <div key={campo} className="flex items-center">
              <label htmlFor={campo} className="w-24 text-black text-sm capitalize">
                {campo === "osocial" ? "Obra Social" : campo}
              </label>
              <Input
                id={campo}
                value={formData[campo]}
                onChange={handleChange}
                className="h-[28px] border border-black bg-white rounded-md flex-1"
              />
            </div>
          ))}

          {/* Fecha */}
          <div className="flex items-center">
            <label htmlFor="fecha" className="w-24 text-black text-sm">Fecha</label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange}
              className="h-[28px] border border-black bg-white rounded-md flex-1"
            />
          </div>

          {/* Hora */}
          <div className="flex items-center">
            <label htmlFor="hora" className="w-24 text-black text-sm">Hora</label>
            <Input
              id="hora"
              type="time"
              value={formData.hora}
              onChange={handleChange}
              className="h-[28px] border border-black bg-white rounded-md flex-1"
            />
          </div>

          {/* Profesional */}
          <div className="flex items-center">
            <label className="w-24 text-black text-sm">Profesional</label>
            {modo === "secretaria" && doctores.length > 0 ? (
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, profesionalId: value }))}>
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
            <Button
              onClick={handleGrabar}
              className="rounded-[40px] px-4 bg-gradient-to-b from-cyan-300 to-cyan-500 text-black"
            >
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