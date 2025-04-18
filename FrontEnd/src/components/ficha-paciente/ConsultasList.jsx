import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConsultaCard from "./ConsultaCard";

export default function ConsultasList() {
  // Mock de consultas (ordenado desde la más reciente)
  const consultations = [
    {
      date: "01/04/2024",
      reason: "Dolor abdominal",
      doctor: "Dra. Paula López",
      highlighted: true,
    },
    {
      date: "15/03/2024",
      reason: "Control mensual",
      doctor: "Dr. Juan Torres",
      highlighted: false,
    },
    {
      date: "28/02/2024",
      reason: "Chequeo general",
      doctor: "Dr. Juan Torres",
      highlighted: false,
    },
    {
      date: "10/02/2024",
      reason: "Primera consulta",
      doctor: "Dra. Paula López",
      highlighted: false,
    },
  ];

  return (
    <ScrollArea className="h-[400px] pr-2">
      <div className="space-y-4">
        {consultations.map((item, index) => (
          <ConsultaCard key={index} {...item} />
        ))}
      </div>

      {/* Paginación simple (opcional agregar lógica real luego) */}
      <div className="flex justify-center mt-6 text-lg text-gray-700">
        Página anterior&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;Página siguiente
      </div>
    </ScrollArea>
  );
}