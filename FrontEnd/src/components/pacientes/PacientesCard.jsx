import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import BotonHarmonia from "@/components/ui/botonHarmonia";
import { useNavigate } from "react-router-dom";

export default function PacientesCard({ patient }) {
  const navigate = useNavigate();

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
            <BotonHarmonia onClick={() => navigate("/ficha-paciente")}>
              Ficha
            </BotonHarmonia>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}