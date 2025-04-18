import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  return (
    <ScrollArea className="w-full max-w-5xl bg-white border border-black rounded-md p-4">
      <CardContent>
        {sections.map((section, index) => (
          <FormSection key={index} title={section.title} columns={section.fields} />
        ))}

        {/* Botones de acción */}
        <div className="flex justify-center mt-6 gap-6">
          <Button className="w-[158px] h-[50px] rounded-[40px] shadow-[8px_8px_1.9px_rgba(0,0,0,0.25)] text-[22px] font-sans">
            Aceptar
          </Button>
          <Button className="w-[158px] h-[50px] rounded-[40px] shadow-[8px_8px_1.9px_rgba(0,0,0,0.25)] text-[22px] font-sans">
            Cancelar
          </Button>
        </div>
      </CardContent>
    </ScrollArea>
  );
}