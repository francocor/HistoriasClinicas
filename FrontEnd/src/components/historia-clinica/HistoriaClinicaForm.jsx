import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import BotonHarmonia from "@/components/ui/botonHarmonia";
import Swal from "sweetalert2";

// 🧠 Estructura del formulario
const secciones = [
  {
    nombre: "Datos Personales",
    campos: [
      "Nombre", "Apellido","DNI" ,"Sexo", "F. Nacimiento", "Obra Social",
         "Teléfono", "Email"
    ],
  },
  {
    nombre: "Sobre el Paciente",
    campos: [
      "Ocupación","Nacionalidad","Dirección","Edad","Estado Civil","RH", "Alergias", "Diabetes", "Cirugías", "Medicamentos", "Otras enfermedades o patologías",
      "Enf. Cardiovasculares", "Enf. Pulmonares", "Enf. Digestivas", "Enf. Renales"
    ],
  },
  {
    nombre: "Antecedentes Personales",
    campos: ["Alcohol", "Tabaquismo", "Drogas", "Inmunizaciones", "Otros"],
  },
  {
    nombre: "Antecedentes Familiares",
    campos: [
        { label: "Padre", name: "padre" },
      { label: "Enfermedades que padece", name: "padre_enfermedades" },
      { label: "Madre", name: "madre" },
      { label: "Enfermedades que padece", name: "madre_enfermedades" },
      { label: "Hermanos", name: "hermanos" },
      { label: "Enfermedades que padecen", name: "hermanos_enfermedades" },
    ],
  },
];

export default function HistoriaClinicaForm({ paciente: pacienteProp }) {
  const location = useLocation();
  const paciente = pacienteProp ?? location.state?.paciente ?? null;
  const isPacienteExistente = Boolean(paciente?.id);

   const [modoEdicion, setModoEdicion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado del formulario: inicializo TODOS los campos (no molesta si se ocultan)
 const [formulario, setFormulario] = useState(() => {
  const inicial = {};
  secciones.forEach((sec) =>
    sec.campos.forEach((campo) => {
      const key = typeof campo === "string" ? campo : campo.name;
      inicial[key] = "";
    })
  );
  return inicial;
});

  // 🔎 Ocultar la sección "Datos Personales" si es paciente existente
  const seccionesVisibles = useMemo(() => {
    if (!isPacienteExistente) return secciones; // paciente nuevo: mostrar todo
    return secciones.filter((sec) => sec.nombre !== "Datos Personales");
  }, [isPacienteExistente]);

  const handleChange = (e, campo) => {
    setFormulario((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  // Helpers
  const normalizarFecha = (str) => {
    if (!str) return null;
    const iso = /^\d{4}-\d{2}-\d{2}$/;
    const latam = /^\d{2}\/\d{2}\/\d{4}$/;
    if (iso.test(str)) return str;
    if (latam.test(str)) {
      const [dd, mm, yyyy] = str.split("/");
      return `${yyyy}-${mm}-${dd}`;
    }
    return null;
  };

  const safeInt = (v) => {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? null : n;
  };

  // Payloads
  const buildPacientePayload = () => {
    const nombreFull = [formulario["Nombre"], formulario["Apellido"]]
      .filter(Boolean).join(" ").trim();
    return {
      // Tabla `pacientes`
      nombre: nombreFull || formulario["Nombre"] || "",
      telefono: formulario["Teléfono"] || null,
      email: formulario["Email"] || null,
      fecha_nacimiento: normalizarFecha(formulario["F. Nacimiento"]),
      sexo: formulario["Sexo"] || null,
      obra_social: formulario["Obra Social"] || null,
      // dni no está en el form actual; si lo agregás, incluilo acá.
    };
  };

  const buildPacienteInfoPayload = (paciente_id) => ({
    paciente_id,
    // Info extendida (tabla pacienteInfo)
    direccion: formulario["Dirección"] || null,
    edad: safeInt(formulario["Edad"]),
    rh: formulario["RH"] || null,
    alergias: formulario["Alergias"] || null,
    diabetes: formulario["Diabetes"] || null,
    cirugias: formulario["Cirugías"] || null,
    medicamentos: formulario["Medicamentos"] || null,
    otras_enfermedades: formulario["Otras enfermedades o patologías"] || null,
    enf_cardiovasculares: formulario["Enf. Cardiovasculares"] || null,
    enf_pulmonares: formulario["Enf. Pulmonares"] || null,
    enf_digestivas: formulario["Enf. Digestivas"] || null,
    enf_renales: formulario["Enf. Renales"] || null,
    alcohol: formulario["Alcohol"] || null,
    tabaquismo: formulario["Tabaquismo"] || null,
    drogas: formulario["Drogas"] || null,
    inmunizaciones: formulario["Inmunizaciones"] || null,
    otros_personales: formulario["Otros"] || null,
   padre: formulario["padre"],
padre_enfermedades: formulario["padre_enfermedades"],
madre: formulario["madre"],
madre_enfermedades: formulario["madre_enfermedades"],
hermanos: formulario["hermanos"],
hermanos_enfermedades: formulario["hermanos_enfermedades"],
    estado_civil: formulario["Estado Civil"] || null,
    nacionalidad: formulario["Nacionalidad"] || null,
    ocupacion: formulario["Ocupación"] || null,
  });

  // Guardar
  const handleGuardar = async () => {
  try {
    setIsSubmitting(true);

    if (isPacienteExistente) {
      // POST /api/paciente-info/existente (requiere paciente_id)
      const payload = buildPacienteInfoPayload(paciente.id);

      const res = await fetch("http://localhost:4000/api/paciente-info/existente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(`Error guardando info: ${res.status} ${txt}`);

      await Swal.fire({
        icon: "success",
        title: "¡Guardado!",
        text: "Información actualizada correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });
    } else {
      // POST /api/paciente-info/nuevo (crea paciente + info)
      const payloadPaciente = buildPacientePayload();
      if (!payloadPaciente.nombre) {
        Swal.fire({
          icon: "warning",
          title: "Falta el nombre",
          text: "Completá al menos el nombre del paciente.",
        });
        return;
      }

      const payloadInfo = buildPacienteInfoPayload(null);
      const res = await fetch("http://localhost:4000/api/paciente-info/nuevo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payloadPaciente, ...payloadInfo }),
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(`Error creando paciente e info: ${res.status} ${txt}`);

      await Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: "Paciente creado y ficha extendida guardada.",
        timer: 1800,
        showConfirmButton: false,
      });
    }

    setModoEdicion(false);
  } catch (e) {
    console.error(e);
    Swal.fire({
      icon: "error",
      title: "Ocurrió un error",
      text: e.message || "No se pudo guardar la información.",
    });
  } finally {
    setIsSubmitting(false);
  }
};


  const handleCancelar = () => setModoEdicion(false);

  return (
    <ScrollArea className="w-full max-w-5xl bg-white border border-black rounded-md p-4">
      <CardContent className="space-y-6">

        {/* Banner con datos del paciente si existe */}
        {isPacienteExistente && (
          <div className="border border-black rounded-md p-4 bg-gray-50">
            <h3 className="text-xl font-semibold mb-2">Paciente</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <p><span className="font-medium">Nombre:</span> {paciente.nombre ?? "-"}</p>
              <p><span className="font-medium">DNI:</span> {paciente.dni ?? "-"}</p>
              <p><span className="font-medium">Sexo:</span> {paciente.sexo ?? "-"}</p>
              <p><span className="font-medium">F. Nacimiento:</span> {paciente.fecha_nacimiento ?? "-"}</p>
              <p><span className="font-medium">Obra Social:</span> {paciente.obra_social ?? "-"}</p>
              <p><span className="font-medium">Teléfono:</span> {paciente.telefono ?? "-"}</p>
              <p><span className="font-medium">Email:</span> {paciente.email ?? "-"}</p>
            </div>
          </div>
        )}

        {/* Botón editar */}
        {!modoEdicion && (
          <div className="flex justify-end mb-2">
            <BotonHarmonia onClick={() => setModoEdicion(true)}>
              Editar
            </BotonHarmonia>
          </div>
        )}

        {/* Secciones dinámicas (con "Datos Personales" oculto si corresponde) */}
        {seccionesVisibles.map((seccion, idx) => (
          <div key={idx} className="border border-black rounded-md p-4">
            <h3 className="text-xl font-semibold mb-4">{seccion.nombre}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {seccion.campos.map((campo, i) => {
  const key = typeof campo === "string" ? campo : campo.name;
  const label = typeof campo === "string" ? campo : campo.label;

  return (
    <div key={i} className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      {modoEdicion ? (
        <input
          type="text"
          value={formulario[key]}
          onChange={(e) =>
            setFormulario((prev) => ({ ...prev, [key]: e.target.value }))
          }
          className="border border-black rounded-md px-2 py-1"
        />
      ) : (
        <p className="text-black bg-gray-100 px-2 py-1 rounded-md min-h-[38px]">
          {formulario[key] || "-"}
        </p>
      )}
    </div>
  );
})}
            </div>
          </div>
        ))}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <BotonHarmonia onClick={handleGuardar} disabled={!modoEdicion}>
            Guardar
          </BotonHarmonia>
          {modoEdicion && (
            <BotonHarmonia onClick={handleCancelar}>Cancelar</BotonHarmonia>
          )}
        </div>
      </CardContent>
    </ScrollArea>
  );
}
