import React, { useState, useEffect } from "react";
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
import Swal from "sweetalert2";

export default function TurnoNuevoPaciente({ modo = "profesional", doctores = [] }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    fecha_nacimiento: "",
    fecha: "",
    hora: "",
    sexo: "",
    osocial: "",
    cobro: "",
    profesional_id: "",
  });

  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?.id;

    if (modo === "profesional" && doctores.length > 0 && userId) {
      const miDoctor = doctores.find((doc) => doc.user_id === userId);
      if (miDoctor) {
        setFormData((prev) => ({
          ...prev,
          profesional_id: miDoctor.profesional_id.toString(),
        }));
        setEspecialidadSeleccionada(miDoctor.especialidad);
      }
    }
  }, [modo, doctores]);

  const especialidadesUnicas = Array.from(new Set(doctores.map((d) => d.especialidad)));
  const doctoresFiltrados = doctores.filter((d) => d.especialidad === especialidadSeleccionada);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleGrabar = async () => {
    const camposObligatorios = ["nombre", "apellido", "dni", "telefono", "fecha", "hora", "osocial"];
    const faltanCampos = camposObligatorios.some((campo) => !formData[campo]);
    const necesitaMedico = modo === "secretaria" && !formData.profesional_id;

    if (faltanCampos || necesitaMedico || !especialidadSeleccionada) {
      Swal.fire("Faltan datos", "Por favor complete todos los campos obligatorios.", "warning");
      return;
    }

    const nombreCompleto = `${formData.nombre} ${formData.apellido}`;
    const doctorId = parseInt(formData.profesional_id);

    try {
      const pacienteRes = await fetch("http://localhost:4000/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreCompleto,
          dni: formData.dni,
          telefono: formData.telefono,
          email: formData.email,
          fecha_nacimiento: formData.fecha_nacimiento,
          sexo: formData.sexo,
          obra_social: formData.osocial,
        }),
      });

      if (!pacienteRes.ok) throw new Error("Error al crear paciente");
      const pacienteData = await pacienteRes.json();
      const pacienteId = pacienteData.pacienteId;

      const fechaCompleta = `${formData.fecha}T${formData.hora}`;
      const turnoRes = await fetch("http://localhost:4000/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paciente_id: pacienteId,
          fecha: fechaCompleta,
          doctor_id: doctorId,
          especialidad: especialidadSeleccionada,
          creado_por: modo,
        }),
      });

      if (!turnoRes.ok) throw new Error("Error al crear turno");

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Turno y paciente registrados",
      }).then(() => window.location.reload());
    } catch (err) {
      console.error("Error al grabar turno o paciente:", err);
      Swal.fire("Error", "No se pudo completar la operación", "error");
    }
  };

  return (
    <div className="flex justify-center w-full">
      <Card className="w-[377px] rounded-[20px] overflow-hidden">
        <CardContent className="p-4 space-y-3">
          {["nombre", "apellido", "dni", "telefono", "email", "osocial", "cobro"].map((campo) => (
            <div key={campo} className="flex items-center">
              <label htmlFor={campo} className="w-24 text-black text-sm capitalize">
                {campo === "osocial" ? "Obra Social" : campo}
              </label>
              <Input
                id={campo}
                type="text"
                value={formData[campo]}
                onChange={handleChange}
                className="h-[28px] border border-black bg-white rounded-md flex-1"
              />
            </div>
          ))}

          <div className="flex items-center">
            <label htmlFor="sexo" className="w-24 text-black text-sm">Sexo</label>
            <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, sexo: value }))}>
              <SelectTrigger className="h-[28px] border border-black bg-white rounded-md w-full">
                <SelectValue placeholder="Seleccione sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Femenino">Femenino</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <label htmlFor="fecha_nacimiento" className="w-24 text-black text-sm">F. Nac.</label>
            <Input
              id="fecha_nacimiento"
              type="date"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className="h-[28px] border border-black bg-white rounded-md flex-1"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="fecha" className="w-24 text-black text-sm">Fecha</label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange}
              className="h-[28px] border border-black bg-white rounded-md flex-1"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

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

          {modo === "secretaria" ? (
            <>
              <div className="flex items-center">
                <label className="w-24 text-black text-sm">Especialidad</label>
                <Select onValueChange={(value) => {
                  setEspecialidadSeleccionada(value);
                  setFormData((prev) => ({ ...prev, profesional_id: "" }));
                }}>
                  <SelectTrigger className="h-[28px] border border-black bg-white rounded-md w-full">
                    <SelectValue placeholder="Seleccione especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidadesUnicas.map((esp) => (
                      <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <label className="w-24 text-black text-sm">Profesional</label>
                {especialidadSeleccionada ? (
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, profesional_id: value }))}>
                    <SelectTrigger className="h-[28px] border border-black bg-white rounded-md w-full">
                      <SelectValue placeholder="Seleccione médico" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctoresFiltrados.map((doc) => (
                        <SelectItem key={doc.profesional_id} value={doc.profesional_id.toString()}>
                          {doc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    disabled
                    placeholder="Seleccione especialidad"
                    className="h-[28px] border border-black bg-white rounded-md w-full text-gray-500"
                  />
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center">
                <label className="w-24 text-black text-sm">Especialidad</label>
                <Input
                  readOnly
                  value={especialidadSeleccionada}
                  className="h-[28px] border border-black bg-white rounded-md flex-1"
                />
              </div>
              <div className="flex items-center">
                <label className="w-24 text-black text-sm">Profesional</label>
                <Input
                  readOnly
                  value={doctores.find((d) => d.profesional_id.toString() === formData.profesional_id)?.name || ""}
                  className="h-[28px] border border-black bg-white rounded-md flex-1"
                />
              </div>
            </>
          )}

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
              onClick={() => {
                setFormData({
                  nombre: "",
                  apellido: "",
                  dni: "",
                  telefono: "",
                  email: "",
                  fecha_nacimiento: "",
                  fecha: "",
                  hora: "",
                  sexo: "",
                  osocial: "",
                  cobro: "",
                  profesional_id: "",
                });
                setEspecialidadSeleccionada("");
              }}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
