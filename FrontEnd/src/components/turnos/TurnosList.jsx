import React, { useMemo, useState, useEffect } from "react";
import TurnoCard from "./TurnoCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 5;

export default function TurnosList({ turnos = [] }) {
  const [page, setPage] = useState(1);

  const total = turnos.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Si cambia la cantidad de turnos y la página queda fuera de rango, la ajustamos
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (totalPages === 1 && page !== 1) setPage(1);
  }, [totalPages, page]);

  const { visibleTurnos, start, end } = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, total);
    return { visibleTurnos: turnos.slice(start, end), start, end };
  }, [page, total, turnos]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="w-full lg:w-[382px]">
      {/* Título */}
      <h2 className="text-2xl font-sans font-semibold mb-4">Próximos Turnos</h2>

      <div className="space-y-4">
        {visibleTurnos.length > 0 ? (
          visibleTurnos.map((appointment) => (
            <TurnoCard key={appointment.id} {...appointment} />
          ))
        ) : (
          <p className="text-center text-gray-500">No hay turnos programados.</p>
        )}
      </div>

      {/* Paginación */}
      {total > PAGE_SIZE && (
        <Pagination className="mt-6">
          <PaginationContent className="flex justify-between items-center w-full">
            <div className="text-sm text-gray-700">
              Mostrando{" "}
              {total === 0 ? 0 : start + 1}–{end} de {total}
              {" · "}Página <b>{page}</b> de <b>{totalPages}</b>
            </div>

            <div className="flex items-center gap-3">
              <PaginationItem>
                <button
                  onClick={goPrev}
                  disabled={page === 1}
                  className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </PaginationItem>

              <PaginationItem>
                <button
                  onClick={goNext}
                  disabled={page === totalPages}
                  className="p-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </PaginationItem>
            </div>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
