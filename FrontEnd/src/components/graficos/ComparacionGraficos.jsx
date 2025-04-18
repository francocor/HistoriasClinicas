import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const pieData1 = [
  { value: 25, color: "#FF5733" },
  { value: 30, color: "#33FF57" },
  { value: 20, color: "#3357FF" },
  { value: 25, color: "#F3FF33" },
];

const pieData2 = [
  { value: 35, color: "#FF5733" },
  { value: 15, color: "#33FF57" },
  { value: 30, color: "#3357FF" },
  { value: 20, color: "#F3FF33" },
];

function PieChart({ data }) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let cumulative = 0;

  return (
    <div className="relative w-[200px] h-[200px] rounded-full overflow-hidden">
      {data.map((segment, index) => {
        const rotation = (cumulative / total) * 360;
        const slice = (segment.value / total) * 360;
        cumulative += segment.value;

        return (
          <div
            key={index}
            className="absolute w-full h-full rounded-full"
            style={{
              backgroundColor: segment.color,
              clipPath: "polygon(50% 50%, 100% 0, 100% 100%)",
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "center",
            }}
          ></div>
        );
      })}
    </div>
  );
}

export default function ComparacionGraficos() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <Card className="w-full lg:w-1/2 border border-black">
        <CardContent className="p-6">
          <h3 className="text-2xl font-montserrat mb-4">Comparación 1</h3>
          <div className="flex items-center justify-center">
            <PieChart data={pieData1} />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full lg:w-1/2 border border-black">
        <CardContent className="p-6">
          <h3 className="text-2xl font-montserrat mb-4">Comparación 2</h3>
          <div className="flex items-center justify-center">
            <PieChart data={pieData2} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
