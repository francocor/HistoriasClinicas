import React, { useState } from "react";
import FiltrosGraficos from "@/components/graficos/FiltrosGraficos";
import FiltrosComparacionGraficos from "@/components/graficos/FiltrosComparacionGraficos";
import GraficoBarras from "@/components/graficos/GraficoBarras";
import ComparacionGraficos from "@/components/graficos/ComparacionGraficos";
import BotonHarmonia from "@/components/ui/BotonHarmonia";

export default function Balance() {
  const [tipoGrafico, setTipoGrafico] = useState("bar");
  const [comparar, setComparar] = useState(false);

  return (
    <main className="flex-1 px-6 py-8 overflow-y-auto">
      <h1 className="text-center text-4xl font-montserrat mb-6">Gráficos</h1>

      <FiltrosGraficos
        tipoGrafico={tipoGrafico}
        setTipoGrafico={setTipoGrafico}
        comparar={comparar}
        setComparar={setComparar}
      />

      <section className="mt-10">
        {tipoGrafico === "bar" && <GraficoBarras />}
      </section>

      {comparar && (
        <section className="mt-10 space-y-6">
          <h2 className="text-2xl font-montserrat">Filtros para comparar</h2>
          <FiltrosComparacionGraficos
            tipoGrafico={tipoGrafico}
            setTipoGrafico={setTipoGrafico}
          />
          <ComparacionGraficos />
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-2xl font-montserrat mb-2">Notas:</h2>
        <textarea
          className="w-full h-[100px] border border-black p-2 rounded-[20px] shadow-sm"
          placeholder="Escriba sus notas o comentarios sobre los resultados..."
        />

        <div className="flex justify-end mt-4 space-x-4">
          <BotonHarmonia>Guardar Nota</BotonHarmonia>

          <BotonHarmonia>Limpiar</BotonHarmonia>

          <BotonHarmonia onClick={() => setComparar(!comparar)}>
            {comparar ? "Quitar comparación" : "Activar comparación"}
          </BotonHarmonia>
        </div>
      </section>
    </main>
  );
}