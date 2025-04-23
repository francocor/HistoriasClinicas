import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

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

export default function HomeSecretaria() {
  return (
    <section className="flex flex-col items-center py-10 px-4 w-full">
      <div className="w-full max-w-[420px] bg-gradient-to-b from-white via-[#4fdfbe] to-[#33bebc] rounded-[20px] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[28px] font-semibold text-black">Próximos Turnos</h2>
          <Calendar className="w-8 h-8 text-black" />
        </div>

        <div className="space-y-4">
          {appointmentData.map((appointment) => (
            <Card
              key={appointment.id}
              className="bg-white border border-black rounded-[20px]"
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium text-black">
                    {appointment.patientName}
                  </p>
                  <Button className="rounded-full bg-white text-black border border-black px-4 h-8 text-sm shadow">
                    Presente
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-base text-black">
                    {appointment.appointmentDate}
                  </p>
                  <Button className="rounded-full bg-white text-black border border-black px-4 h-8 text-sm shadow">
                    Ausente
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-base text-black">{appointment.doctor}</p>
                  <Button className="rounded-full bg-white text-black border border-black px-4 h-8 text-sm shadow">
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Pagination className="mt-6">
          <PaginationContent className="flex justify-center gap-4">
            <PaginationItem>
              <PaginationLink>
                <span className="flex items-center gap-1">Anterior</span>
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>
                <span className="flex items-center gap-1">Siguiente</span>
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}