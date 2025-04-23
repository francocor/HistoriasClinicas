import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BotonHarmonia from "@/components/ui/botonHarmonia";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AtencionCard() {
  const [formData, setFormData] = useState({
    fechaHora: "",
    motivo: "",
    sintomas: "",
    parametros: "",
    diagnostico: "",
    tratamiento: "",
    medicamentos: "",
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Card de información */}
      <Card className="w-full border border-black">
        <CardContent className="p-6 space-y-6">
          {/* Fecha y Hora */}
          <div>
            <label className="text-xl font-sans block mb-2">Fecha y Hora:</label>
            <Input
              type="datetime-local"
              value={formData.fechaHora}
              onChange={handleChange("fechaHora")}
              className="w-full border border-black"
            />
          </div>

          {/* Motivo de la consulta */}
          <div>
            <label className="text-xl font-sans block mb-2">Motivo de la consulta:</label>
            <Textarea
              value={formData.motivo}
              onChange={handleChange("motivo")}
              className="w-full border border-black"
              rows={2}
            />
          </div>

          {/* Síntomas */}
          <div>
            <label className="text-xl font-sans block mb-2">Síntomas:</label>
            <Textarea
              value={formData.sintomas}
              onChange={handleChange("sintomas")}
              className="w-full border border-black"
              rows={2}
            />
          </div>

          {/* Parámetros */}
          <div>
            <label className="text-xl font-sans block mb-2">Parámetros:</label>
            <Textarea
              value={formData.parametros}
              onChange={handleChange("parametros")}
              className="w-full border border-black"
              rows={2}
            />
          </div>

          {/* Diagnóstico */}
          <div>
            <label className="text-xl font-sans block mb-2">Diagnóstico:</label>
            <Textarea
              value={formData.diagnostico}
              onChange={handleChange("diagnostico")}
              className="w-full border border-black"
              rows={2}
            />
          </div>

          {/* Tratamiento */}
          <div>
            <label className="text-xl font-sans block mb-2">Tratamiento:</label>
            <Textarea
              value={formData.tratamiento}
              onChange={handleChange("tratamiento")}
              className="w-full border border-black"
              rows={2}
            />
          </div>

          {/* Medicamentos recetados */}
          <div>
            <label className="text-xl font-sans block mb-2">Medicamentos recetados:</label>
            <Textarea
              value={formData.medicamentos}
              onChange={handleChange("medicamentos")}
              className="w-full border border-black"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-center gap-6 mt-8">
        <BotonHarmonia>Editar</BotonHarmonia>
        <BotonHarmonia>Aceptar</BotonHarmonia>
        <BotonHarmonia>Cancelar</BotonHarmonia>
      </div>
    </div>
  );
}