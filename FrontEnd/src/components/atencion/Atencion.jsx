import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import BotonHarmonia from "@/components/ui/botonHarmonia";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

export default function Atencion() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [archivo, setArchivo] = useState(null);
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

  const handleArchivoSeleccionado = (e) => {
    const file = e.target.files[0];
    if (file) setArchivo(file);
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Marcar turno como atendido
      const res = await fetch(`http://localhost:4000/api/atendido/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "atendido" }),
      });

      if (!res.ok) throw new Error("Error al marcar turno como atendido");

      // Crear historia clínica
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
    <div className="flex h-screen w-full">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-white p-4">

          {/* Encabezado */}
          <div className="mb-6">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                className="p-0 mr-4"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-[48px] h-[48px] sm:w-[60px] sm:h-[60px]" />
              </Button>
              <h1 className="text-3xl sm:text-4xl font-sans font-normal">Pacientes</h1>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-sans font-normal">Nombre Paciente</h2>

              <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                <span className="text-sm sm:text-lg font-sans">Estudios y/o análisis</span>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="px-6 py-1 bg-gradient-to-b from-[#179cba] to-white text-black border border-black rounded-[40px] shadow hover:opacity-80 transition w-full sm:w-[120px] text-sm font-medium"
                    >
                      Cargar
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cargar documento</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleArchivoSeleccionado}
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Seleccionar archivo
                      </Button>

                      {archivo && (
                        <div className="text-sm text-gray-700">
                          Archivo seleccionado: <span className="font-medium">{archivo.name}</span>
                        </div>
                      )}

                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                          console.log("Archivo a subir:", archivo);
                          alert("Archivo preparado para subir al servidor.");
                        }}
                      >
                        Subir documento
                      </Button>

                      <DialogClose asChild>
                        <Button
                          variant="ghost"
                          className="px-6 py-1 bg-gradient-to-b from-white to-[#cfdedb] text-black border border-black rounded-[40px] shadow hover:opacity-80 transition w-full sm:w-[120px] text-sm font-medium mt-2"
                        >
                          Cancelar
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Formulario de atención */}
          <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto">
            <Card className="w-full border border-black">
              <CardContent className="p-6 space-y-6">
                {[
                  { label: "Fecha y Hora", name: "fechaHora", type: "datetime-local" },
                  { label: "Motivo de la consulta", name: "motivo", type: "textarea" },
                  { label: "Síntomas", name: "sintomas", type: "textarea" },
                  { label: "Parámetros", name: "parametros", type: "textarea" },
                  { label: "Diagnóstico", name: "diagnostico", type: "textarea" },
                  { label: "Tratamiento", name: "tratamiento", type: "textarea" },
                  { label: "Medicamentos recetados", name: "medicamentos", type: "textarea" },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="text-xl font-sans block mb-2">{field.label}:</label>
                    {field.type === "textarea" ? (
                      <Textarea
                        value={formData[field.name]}
                        onChange={handleChange(field.name)}
                        className="w-full border border-black"
                        rows={2}
                        required
                      />
                    ) : (
                      <Input
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleChange(field.name)}
                        className="w-full border border-black"
                        required
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-center gap-6 mt-8">
              <BotonHarmonia type="submit">Aceptar</BotonHarmonia>
              <BotonHarmonia type="button" onClick={() => navigate("/turnos")}>Cancelar</BotonHarmonia>
            </div>
          </form>

        </main>
      </div>
    </div>
  );
}