import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";

export default function ConsultaCard({ date, reason, doctor, highlighted }) {
  return (
    <Card
      className={`rounded-[20px] border border-black ${
        highlighted ? "bg-[#179cba]" : "bg-white"
      }`}
    >
      <CardContent className="p-4 space-y-4">
        {/* Fecha y botón Ver */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-sans">{date}</span>
          <Button
            onClick={() => navigate("/atencion")}
            className="rounded-[40px] h-[39px] w-[84px] bg-white text-black shadow-md hover:bg-gray-100"
          >
            Ver
          </Button>
        </div>

        {/* Motivo y botón Estudios */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-sans">{reason}</span>
          <Button className="rounded-[40px] h-[33px] w-[100px] bg-white text-black shadow-[8px_8px_1.9px_rgba(0,0,0,0.25)] hover:bg-gray-100">
            Estudios
          </Button>
        </div>

        {/* Médico y acciones */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-sans">{doctor}</span>
          <div className="flex items-center gap-4">
            <Button className="rounded-[40px] h-[33px] w-[100px] bg-white text-black shadow-[8px_8px_1.9px_rgba(0,0,0,0.25)] hover:bg-gray-100">
              Análisis
            </Button>
            {!highlighted && <Download className="w-6 h-6 text-black" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}