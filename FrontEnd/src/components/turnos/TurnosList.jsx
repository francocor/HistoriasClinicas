import React from "react";
import TurnoCard from "./TurnoCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TurnosList({ turnos = [] }) {
  return (
    <div className="w-full lg:w-[382px]">
      {/* Título */}
      <h2 className="text-2xl font-sans font-semibold mb-4">Próximos Turnos</h2>

      <div className="space-y-4">
        {turnos.length > 0 ? (
          turnos.map((appointment) => (
            <TurnoCard key={appointment.id} {...appointment} />
          ))
        ) : (
          <p className="text-center text-gray-500">No hay turnos programados.</p>
        )}
      </div>

      {/* Paginación (opcional para más adelante) */}
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