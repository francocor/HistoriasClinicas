import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TurnosList from "@/components/turnos/TurnosList";

// Datos de pacientes mock (pueden venir de props o de un estado en el futuro)
const recentlyViewedPatients = [
  {
    name: "Nombre y apellido",
    age: "Edad",
    birthDate: "F. nacimiento",
    socialSecurity: "O. social",
  },
  {
    name: "Nombre y apellido",
    age: "Edad",
    birthDate: "F. nacimiento",
    socialSecurity: "O. social",
  },
  {
    name: "Nombre y apellido",
    age: "Edad",
    birthDate: "F. nacimiento",
    socialSecurity: "O. social",
  },
];

export default function HomeProfesionales() {
  return (
    <main className="flex-1 flex p-8 gap-8">
      {/* Vistos recientemente */}
      <section className="flex-1 bg-gradient-to-b from-white via-[#4fdfbe] to-[#33bebc] rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[32px] font-normal text-black">VISTOS RECIENTEMENTE</h2>
          <Calendar className="w-[40px] h-[40px] text-black" />
        </div>

        <div className="space-y-3">
          {recentlyViewedPatients.map((patient, index) => (
            <Card
              key={index}
              className="border border-black rounded-[20px] bg-white"
            >
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[20px] font-semibold text-black">{patient.name}</p>
                    <p className="text-[18px] text-black">{patient.age}</p>
                  </div>
                  <div>
                    <p className="text-[18px] text-black">{patient.socialSecurity}</p>
                    <p className="text-[18px] text-black">{patient.birthDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Próximos turnos */}
      <section className="w-full max-w-[387px]">
        <TurnosList />
      </section>
    </main>
  );
}