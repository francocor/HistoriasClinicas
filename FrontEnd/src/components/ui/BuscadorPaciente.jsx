import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function BuscadorPaciente({ value, onChange, placeholder = "Buscar paciente..." }) {
  return (
    <div className="relative w-full max-w-sm">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-[54px] px-10 border border-black rounded-md"
      />
      <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-black w-5 h-5" />
    </div>
  );
}