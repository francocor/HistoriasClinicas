import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Filter, Search } from "lucide-react";

export default function HistoriaClinicaHeader() {
  const navigate = useNavigate(); // ✅ Hook para navegar

  return (
    <div className="mb-6">
      {/* Título con botón de volver */}
      <div className="flex items-center mb-6">
        <button
          className="mr-4"
          onClick={() => navigate(-1)} // ✅ Funcionalidad de volver atrás
        >
          <ChevronLeft className="w-[60px] h-[60px] cursor-pointer hover:opacity-80 transition" />
        </button>
        <div className="space-y-1">
          <h1 className="text-4xl font-sans font-normal">Pacientes</h1>
          <h2 className="text-2xl font-sans font-normal">Historias clínicas</h2>
        </div>
      </div>
    </div>
  );
}