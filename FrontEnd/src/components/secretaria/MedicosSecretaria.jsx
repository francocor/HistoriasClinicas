import React from "react";
import MedicosList from "@/components/secretaria/MedicosList";

export default function MedicosSecretaria() {
  return (
    <main className="flex-1 px-6 py-8 overflow-y-auto">
      <MedicosList />
    </main>
  );
}