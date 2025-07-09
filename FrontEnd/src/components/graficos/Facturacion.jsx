import React, { useState } from "react";
import FacturacionPacientes from "@/components/graficos/FacturacionPacientes";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useUser } from "@/context/UserContext";

export default function Facturacion() {
  const { user } = useUser();
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const esSecretaria = user?.role === "secretaria";

  return (
    <main className="flex-1 px-4 py-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Facturación</h1>

      {/* Filtro visible solo para secretarias */}
      {esSecretaria && (
        <div className="mb-6 max-w-sm mx-auto">
          <label className="text-base font-medium block mb-2">
            Seleccionar médico:
          </label>
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

      <section className="mt-10">
        <FacturacionPacientes
          role={user?.role}
          selectedDoctor={selectedDoctor}
        />
      </section>
    </main>
  );
}