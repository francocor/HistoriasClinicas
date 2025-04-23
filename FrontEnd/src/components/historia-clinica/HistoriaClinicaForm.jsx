import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import FormSection from "./FormSection";
import BotonHarmonia from "@/components/ui/botonHarmonia";

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
  return (
    <ScrollArea className="w-full max-w-5xl bg-white border border-black rounded-md p-4">
      <CardContent>
        {sections.map((section, index) => (
          <FormSection key={index} title={section.title} columns={section.fields} />
        ))}

        {/* Botones de acción */}
        <div className="flex justify-center mt-6 gap-6">
          <BotonHarmonia>
            Aceptar
          </BotonHarmonia>
          <BotonHarmonia>
            Cancelar
          </BotonHarmonia>
        </div>
      </CardContent>
    </ScrollArea>
  );
}