import React, { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import BotonHarmonia from "@/components/ui/botonHarmonia";

// 🧠 Estructura del formulario
const secciones = [
  {
    nombre: "Datos Personales",
    campos: [
      "Nombre", "Apellido", "Edad", "Sexo", "F. Nacimiento", "Obra Social",
      "Estado Civil", "Nacionalidad", "Ocupación", "Dirección", "Teléfono"
    ],
  },
  {
    nombre: "Sobre el Paciente",
    campos: [
      "RH", "Alergias", "Diabetes", "Cirugías", "Medicamentos", "Otras enfermedades o patologías",
      "Enf. Cardiovasculares", "Enf. Pulmonares", "Enf. Digestivas", "Enf. Renales"
    ],
  },
  {
    nombre: "Antecedentes Personales",
    campos: [
      "Alcohol", "Tabaquismo", "Drogas",
      "Inmunizaciones", "Otros"
    ],
  },
  {
    nombre: "Antecedentes Familiares",
    campos: [
      "Padre", "Enfermedades que padece",
      "Madre", "Enfermedades que padece",
      "Hermanos", "Enfermedades que padecen"
    ],
  },
];

export default function HistoriaClinicaForm() {
  const [modoEdicion, setModoEdicion] = useState(false);

  // 🧾 Estado general del formulario
  const [formulario, setFormulario] = useState(() => {
    const inicial = {};
    secciones.forEach((sec) =>
      sec.campos.forEach((campo) => (inicial[campo] = ""))
    );
    return inicial;
  });

  // 🖊 Manejo de cambios
  const handleChange = (e, campo) => {
    setFormulario((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleGuardar = () => {
    console.log("Datos a guardar:", formulario);
    // Aquí conectar con backend usando fetch o axios
    setModoEdicion(false);
  };

  const handleCancelar = () => {
    setModoEdicion(false);
  };

  return (
    <ScrollArea className="w-full max-w-5xl bg-white border border-black rounded-md p-4">
      <CardContent className="space-y-6">

        {/* Botón editar */}
        {!modoEdicion && (
          <div className="flex justify-end mb-2">
            <BotonHarmonia onClick={() => setModoEdicion(true)}>
              Editar
            </BotonHarmonia>
          </div>
        )}

        {/* Secciones dinámicas */}
        {secciones.map((seccion, idx) => (
          <div key={idx} className="border border-black rounded-md p-4">
            <h3 className="text-xl font-semibold mb-4">{seccion.nombre}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {seccion.campos.map((campo, i) => (
                <div key={i} className="flex flex-col">
                  <label className="text-sm font-medium mb-1">{campo}</label>
                  {modoEdicion ? (
                    <input
                      type="text"
                      value={formulario[campo]}
                      onChange={(e) => handleChange(e, campo)}
                      className="border border-black rounded-md px-2 py-1"
                    />
                  ) : (
                    <p className="text-black bg-gray-100 px-2 py-1 rounded-md min-h-[38px]">
                      {formulario[campo] || "-"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <BotonHarmonia onClick={handleGuardar}>Guardar</BotonHarmonia>
          {modoEdicion && (
            <BotonHarmonia onClick={handleCancelar}>Cancelar</BotonHarmonia>
          )}
        </div>
      </CardContent>
    </ScrollArea>
  );
}