import React, { useState } from "react";
import FiltrosGraficos from "@/components/graficos/FiltrosGraficos";
import GraficoBarras from "@/components/graficos/GraficoBarras";
import FacturacionPacientes from "@/components/graficos/FacturacionPacientes";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const role = "secretaria"; // Temporal: usar contexto luego

export default function Balance() {
  const [tipoGrafico, setTipoGrafico] = useState("bar");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  return (
    <main className="flex-1 px-4 py-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Gráficos</h1>

      {role === "secretaria" && (
        <div className="mb-6 max-w-sm">
          <label className="text-base font-medium block mb-2">Seleccionar médico:</label>
          <Select onValueChange={setSelectedDoctor}>
            <SelectTrigger className="w-full border border-black rounded-md h-[40px] bg-white">
              <SelectValue placeholder="Elegir médico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pepito">Dr. Pepito Fernández</SelectItem>
              <SelectItem value="juarez">Dra. Juárez</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <section className="mb-10">
        <FiltrosGraficos tipoGrafico={tipoGrafico} setTipoGrafico={setTipoGrafico} />
      </section>

      {tipoGrafico === "bar" && (
        <section className="mb-10">
          <GraficoBarras />
        </section>
      )}

      <section className="mt-10">
        <FacturacionPacientes role={role} selectedDoctor={selectedDoctor} />
      </section>
    </main>
  );
}