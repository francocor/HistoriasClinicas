import React, { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import BotonHarmonia from "@/components/ui/botonHarmonia";
import FormSection from "./FormSection";

// Estructura de datos de prueba
const sections = [
  {
    title: "Datos Personales",
    fields: [
      ["Nombre:", "Apellido:", "Edad:", "Sexo", "F. Nacimiento:", "Obra Social:"],
      ["Estado Civil:", "Nacionalidad:", "Ocupación:", "Dirección:", "Teléfono:"],
    ],
  },
  {
    title: "Sobre el Paciente",
    fields: [
      ["RH:", "Alergias:", "Diabetes:", "Cirugías:", "Medicamentos:", "Otras enfermedades o patologías:"],
      ["Enf. Cardiovasculares:", "Enf. Pulmonares:", "Enf. Digestivas:", "Enf. Renales:"],
    ],
  },
  {
    title: "Antecedentes Personales",
    fields: [
      ["Alcohol:", "Tabaquismo:", "Drogas:"],
      ["Inmunizaciones:", "Otros:"],
    ],
  },
  {
    title: "Antecedentes Familiares",
    fields: [
      [
        "Padre:",
        "Enfermedades que padece:",
        "Madre:",
        "Enfermedades que padece:",
        "Hermanos:",
        "Enfermedades que padecen:",
      ],
    ],
  },
];

export default function HistoriaClinicaForm() {
  const [modoEdicion, setModoEdicion] = useState(false);

  // Simulamos si hay datos existentes (en producción, esto sería con props o API)
  const hayDatos = true;

  return (
    <ScrollArea className="w-full max-w-5xl bg-white border border-black rounded-md p-4">
      <CardContent className="space-y-6">
        {/* Botón editar si hay datos */}
        {hayDatos && !modoEdicion && (
          <div className="flex justify-end mb-2">
            <BotonHarmonia onClick={() => setModoEdicion(true)}>Editar</BotonHarmonia>
          </div>
        )}

        {/* Secciones del formulario */}
        {sections.map((section, index) => (
          <FormSection
            key={index}
            title={section.title}
            columns={section.fields}
            editable={modoEdicion}
          />
        ))}

        {/* Botones inferiores */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          {modoEdicion ? (
            <>
              <BotonHarmonia onClick={() => setModoEdicion(false)}>Guardar</BotonHarmonia>
              <BotonHarmonia onClick={() => setModoEdicion(false)}>Cancelar</BotonHarmonia>
            </>
          ) : (
            <BotonHarmonia>Volver</BotonHarmonia>
          )}
        </div>
      </CardContent>
    </ScrollArea>
  );
}