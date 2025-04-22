import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BotonHarmonia from "@/components/ui/BotonHarmonia";

export default function TurnoCard({ patientName, appointmentDate, doctor }) {
  const navigate = useNavigate();
  return (
    <Card className="w-full rounded-[20px] border border-black">
      <CardContent className="p-4 relative space-y-4">
        {/* Nombre del paciente */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-sans font-medium text-black">
            {patientName}
          </span>
          <BotonHarmonia
            onClick={() => navigate("/atencion")}
          >
            Presente
          </BotonHarmonia>
        </div>

        {/* Fecha del turno */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-sans text-black">{appointmentDate}</span>
          <BotonHarmonia
            onClick={() => navigate("/atencion")}
            
          >
            Ausente
          </BotonHarmonia>
        </div>

        {/* Médico tratante */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-sans text-black">{doctor}</span>
          <BotonHarmonia
            onClick={() => navigate("/atencion")}
            
          >
            Editar
          </BotonHarmonia>
        </div>
      </CardContent>
    </Card>
  );
}