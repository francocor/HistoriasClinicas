import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, X } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

export default function PacientesHeader({ onApplyFilters }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => ({ ...prev, [type]: value }));
  };

  const removeFilter = (key) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const applyFilters = () => {
    onApplyFilters?.(selectedFilters);
    setOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      {/* Título (sin botón) */}
      <div className="flex flex-col gap-2">
        <h1 className="font-normal text-4xl">Pacientes</h1>
      </div>

      {/* Buscador y filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative">
          <Input
            className="w-[250px] sm:w-[310px] h-[54px] border-2 border-black"
            placeholder="Buscar paciente..."
          />
          <Search className="absolute w-6 h-6 top-3 right-3" />
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-[53px] w-[163px] rounded-[15px] border border-black flex items-center justify-between px-6"
            >
              <span className="font-normal text-xl">Filtros</span>
              <Filter className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent sideOffset={8} onInteractOutside={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-3">
              {/* Obra social */}
              <div>
                <label className="block mb-1 text-sm font-medium">Obra social</label>
                <select onChange={(e) => handleFilterChange("obra_social", e.target.value)} className="w-full border rounded p-2">
                  <option value="">Todas</option>
                  <option value="OSDE">OSDE</option>
                  <option value="PAMI">PAMI</option>
                  <option value="Swiss Medical">Swiss Medical</option>
                </select>
              </div>

              {/* Edad */}
              <div>
                <label className="block mb-1 text-sm font-medium">Edad</label>
                <select onChange={(e) => handleFilterChange("edad", e.target.value)} className="w-full border rounded p-2">
                  <option value="">Todas</option>
                  <option value="asc">Menor a mayor</option>
                  <option value="desc">Mayor a menor</option>
                </select>
              </div>

              {/* Sexo */}
              <div>
                <label className="block mb-1 text-sm font-medium">Sexo</label>
                <select onChange={(e) => handleFilterChange("sexo", e.target.value)} className="w-full border rounded p-2">
                  <option value="">Todos</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>

              <Button onClick={applyFilters} className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded">
                Aplicar filtros
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Filtros activos */}
      {Object.keys(selectedFilters).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(selectedFilters).map(([key, val]) => (
            val && (
              <div key={key} className="bg-gray-200 text-black px-3 py-1 rounded-full flex items-center">
                <span className="mr-2 text-sm">{`${key}: ${val}`}</span>
                <button onClick={() => removeFilter(key)} aria-label="Eliminar filtro">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
