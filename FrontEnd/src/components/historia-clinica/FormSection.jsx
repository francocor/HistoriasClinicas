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

      {/* Responsive grid: 1 columna en mobile, 2 en md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="space-y-4">
            {col.map((label, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <label className="text-base font-sans text-black w-full sm:min-w-[150px]">{label}</label>
                <Input className="h-[38px] flex-1 w-full sm:w-auto border border-black" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}