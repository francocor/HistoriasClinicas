import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

// Simulación de función que traería datos desde el backend según filtros
const fetchDatosFiltrados = async (filtros) => {
  // Reemplazar por fetch/axios al backend
  return [
    { label: "PAMI", value: 20 },
    { label: "OSDE", value: 10 },
    { label: "Swiss", value: 15 },
  ];
};

export default function GraficoBarras({ filtros, tipoGrafico }) {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      const datosFiltrados = await fetchDatosFiltrados(filtros);
      setDatos(datosFiltrados);
    };
    obtenerDatos();
  }, [filtros]);

  return (
    <Card className="w-full border border-black">
      <CardContent className="p-8">
        {tipoGrafico === "bar" && (
          <div className="flex justify-around items-end h-[300px]">
            {datos.map((d, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-10 bg-[#4fdfbe] rounded-t"
                  style={{ height: `${d.value * 5}px` }}
                ></div>
                <span className="mt-2 text-sm">{d.label}</span>
              </div>
            ))}
          </div>
        )}

        {tipoGrafico === "pie" && (
          <div className="w-[200px] h-[200px] rounded-full mx-auto bg-gray-200 flex items-center justify-center">
            <span className="text-center text-black">🍕 Pie chart - próximamente</span>
          </div>
        )}

        {tipoGrafico === "line" && (
          <div className="text-center text-gray-500">📈 Gráfico de líneas - próximamente</div>
        )}
      </CardContent>
    </Card>
  );
}
