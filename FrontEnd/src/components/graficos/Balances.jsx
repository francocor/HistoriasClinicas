import React, { useState } from "react";
import FiltrosGraficos from "@/components/graficos/FiltrosGraficos";
import GraficoBarras from "@/components/graficos/GraficoBarras";
import FacturacionPacientes from "@/components/graficos/FacturacionPacientes";
import BotonHarmonia from "@/components/ui/BotonHarmonia";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// 👉 Simulación de rol, en el futuro esto se saca del auth/contexto
const role = "secretaria"; // o "profesional"

export default function Balance() {
  const [tipoGrafico, setTipoGrafico] = useState("bar");
  const [comparar, setComparar] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  return (
    <main className="flex-1 px-6 py-8 overflow-y-auto">
      <h1 className="text-center text-4xl font-montserrat mb-6">Gráficos</h1>

      {/* Solo visible para secretaria */}
      {role === "secretaria" && (
        <div className="mb-6 max-w-md">
          <label className="text-lg font-semibold text-black block mb-2">
            Seleccionar médico:
          </label>
          <Select onValueChange={setSelectedDoctor}>
            <SelectTrigger className="w-full border border-black rounded-md">
              <SelectValue placeholder="Elegir médico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pepito">Dr. Pepito Fernández</SelectItem>
              <SelectItem value="juarez">Dra. Juárez</SelectItem>
              <SelectItem value="otro">Otro Médico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Filtros principales */}
      <FiltrosGraficos
        tipoGrafico={tipoGrafico}
        setTipoGrafico={setTipoGrafico}
        comparar={comparar}
        setComparar={setComparar}
      />

      {/* Gráfico principal */}
      {tipoGrafico === "bar" && (
        <section className="mt-10">
          <GraficoBarras />
        </section>
      )}


      {/* Facturación Pacientes (siempre visible debajo) */}
      <section className="mt-10">
        <FacturacionPacientes role={role} selectedDoctor={selectedDoctor} />
      </section>

    
    </main>
  );
}