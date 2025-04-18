import React from "react";
import HistoriaClinicaHeader from "./HistoriaClinicaHeader";
import HistoriaClinicaForm from "./HistoriaClinicaForm";

export default function HistoriaClinica() {
  return (
    <div className="flex h-screen w-full">
      {/* Layout global ya maneja Sidebar y Header */}

      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-white p-4">
          <HistoriaClinicaHeader />
          <HistoriaClinicaForm />
        </main>
      </div>
    </div>
  );
}