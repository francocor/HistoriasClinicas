import React from "react";
import TurnosHeader from "./TurnosHeader";
import TurnosList from "./TurnosList";
import AsignarTurnoBox from "./AsignarTurnoBox";

export default function Turnos() {
  return (
    <div className="flex h-screen w-full">
      {/* Layout global maneja Sidebar y Header */}

      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-white p-4">
          <TurnosHeader />
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            <TurnosList />
            <AsignarTurnoBox />
          </div>
        </main>
      </div>
    </div>
  );
}