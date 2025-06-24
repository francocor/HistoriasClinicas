import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BotonHarmonia from "@/components/ui/botonHarmonia";
import { useLocation } from "react-router-dom";


export default function AtencionCard( ) {
  const [formData, setFormData] = useState({
    fechaHora: "",
    motivo: "",
    sintomas: "",
    parametros: "",
    diagnostico: "",
    tratamiento: "",
    medicamentos: "",
  });
const doctor = JSON.parse(localStorage.getItem("user"));
const doctorId = doctor?.id;
const { state } = useLocation();
 const { id, patientId } = state || {};


  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // 1. Marcar turno como atendido
    const res = await fetch(`http://localhost:4000/api/atendido/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "atendido" }),
    });

    if (!res.ok) throw new Error("Error al marcar turno como atendido");
console.log({
  turno_id: id,
  paciente_id: patientId,
  doctor_id: doctorId,
  fecha: formData.fechaHora,
  motivo: formData.motivo,
  sintomas: formData.sintomas,
  parametros: formData.parametros,
  diagnostico: formData.diagnostico,
  tratamiento: formData.tratamiento,
  medicamentos: formData.medicamentos,
});
    // 2. Crear historia clínica
    const historiaRes = await fetch("http://localhost:4000/api/historias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turno_id: id,
        paciente_id: patientId,
        doctor_id: doctorId,
        fecha: formData.fechaHora,
        motivo: formData.motivo,
        sintomas: formData.sintomas,
        parametros: formData.parametros,
        diagnostico: formData.diagnostico,
        tratamiento: formData.tratamiento,
        medicamentos: formData.medicamentos,
      }),
      
    });

    if (!historiaRes.ok) throw new Error("Error al guardar historia clínica");

    navigate("/turnos");

  } catch (err) {
    console.error("Error:", err);
    alert("No se pudo completar la atención del paciente.");
  }
};




  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl mx-auto"
    >
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
              required
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
              required
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
              required
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
              required
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
              required
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
              required
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
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Botones */}
      <div className="flex justify-center gap-6 mt-8">
        <BotonHarmonia type="submit">Aceptar</BotonHarmonia>
        <BotonHarmonia type="button" onClick={() => navigate("/turnos")}>Cancelar</BotonHarmonia>
      </div>
    </form>
  );
}
