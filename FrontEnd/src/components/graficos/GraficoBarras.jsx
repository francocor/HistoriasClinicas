import React from "react";
import { Card, CardContent } from "@/components/ui/card";

// Datos de ejemplo para la demo
const chartData = [
  { value: 70, label: "0" },
  { value: 50, label: "1" },
  { value: 55, label: "2" },
  { value: 70, label: "3" },
  { value: 40, label: "4" },
  { value: 45, label: "5" },
  { value: 45, label: "6" },
];

export default function GraficoBarras() {
  return (
    <Card className="w-full h-[400px] border border-black">
      <CardContent className="p-8">
        <div className="relative h-full">
          {/* Etiquetas del eje Y */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm">
            <span>80</span>
            <span>60</span>
            <span>40</span>
            <span>20</span>
            <span>0</span>
          </div>

          {/* Área del gráfico */}
          <div className="ml-10 h-full flex items-end justify-around">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-[50px] bg-[#FF5733] rounded-t"
                  style={{ height: `${item.value * 3}px` }}
                ></div>
                <span className="mt-2 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
