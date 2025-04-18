import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
          <Button
            onClick={() => navigate("/atencion")}
            className="w-[95px] h-8 rounded-[40px] shadow-md text-sm text-black bg-white hover:bg-gray-100"
          >
            Presente
          </Button>
        </div>

        {/* Fecha del turno */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-sans text-black">{appointmentDate}</span>
          <Button
            onClick={() => navigate("/atencion")}
            className="w-[95px] h-8 rounded-[40px] shadow-md text-sm text-black bg-white hover:bg-gray-100"
          >
            Ausente
          </Button>
        </div>

        {/* Médico tratante */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-sans text-black">{doctor}</span>
          <Button
            onClick={() => navigate("/atencion")}
            className="w-[95px] h-8 rounded-[40px] shadow-md text-sm text-black bg-white hover:bg-gray-100"
          >
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}