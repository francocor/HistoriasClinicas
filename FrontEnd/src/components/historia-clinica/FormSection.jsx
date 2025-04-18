import React from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function FormSection({ title, columns }) {
  return (
    <div className="mb-8">
      {/* Título + línea separadora */}
      <div className="mb-4">
        <h3 className="text-2xl font-sans font-semibold">{title}</h3>
        <Separator className="mt-2 mb-4" />
      </div>

      {/* Contenido por columnas */}
      <div className={`grid ${columns.length === 2 ? "grid-cols-2 gap-6" : "grid-cols-1"} mb-4`}>
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="space-y-4">
            {col.map((label, index) => (
              <div key={index} className="flex items-start gap-2">
                <label className="text-lg min-w-[150px] font-sans">{label}</label>
                <Input className="h-8 flex-1" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}