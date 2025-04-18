import React from "react";
import TurnoCard from "./TurnoCard";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Turnos mock
const appointmentData = [
  {
    id: 1,
    patientName: "Juan Pérez",
    appointmentDate: "12/05/2024 - 10:30hs",
    doctor: "Dr. Fernández",
  },
  {
    id: 2,
    patientName: "Laura Gómez",
    appointmentDate: "12/05/2024 - 11:00hs",
    doctor: "Dr. Fernández",
  },
  {
    id: 3,
    patientName: "Carlos Ramírez",
    appointmentDate: "12/05/2024 - 11:30hs",
    doctor: "Dr. Fernández",
  },
];

export default function TurnosList() {
  return (
    <div className="w-full lg:w-[382px]">
      {/* Título */}
      <h2 className="text-2xl font-sans font-semibold mb-4">Próximos Turnos</h2>

      <div className="space-y-4">
        {appointmentData.map((appointment) => (
          <TurnoCard key={appointment.id} {...appointment} />
        ))}
      </div>

      {/* Paginación */}
      <Pagination className="mt-6">
        <PaginationContent className="flex justify-center items-center gap-6">
          <PaginationItem>
            <ChevronLeft className="w-6 h-6" />
          </PaginationItem>
          <span className="text-sm text-black">Página anterior | Página siguiente</span>
          <PaginationItem>
            <ChevronRight className="w-6 h-6" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}