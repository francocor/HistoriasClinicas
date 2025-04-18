import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PacientesCard({ patient }) {
  return (
    <Card className="border border-black rounded-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          
          {/* Datos del Paciente */}
          <div>
            <div className="font-normal text-2xl sm:text-[32px]">
              {patient.name}
            </div>
            <div className="flex gap-4 text-xl sm:text-[32px]">
              <span>{patient.age}</span>
              <span>{patient.birthDate}</span>
            </div>
          </div>

          {/* Obra social y botón */}
          <div className="flex flex-col items-end">
            <div className="font-normal text-xl sm:text-[32px] mb-2">
              {patient.insurance}
            </div>
            <Button className="w-[125px] h-9 rounded-[25px] shadow-[8px_8px_1.9px_#00000040] font-normal text-[20px] sm:text-[28px] py-0">
              Ficha
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}