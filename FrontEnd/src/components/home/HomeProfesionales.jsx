import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function HomeProfesionales() {
  return (
    <div className="flex h-screen w-full">
      
      <div className="flex-1 flex flex-col">
        
        <main className="flex-1 bg-white p-4">
          {/* Acá va el contenido principal (vistos recientemente, turnos, etc) */}
        </main>
      </div>
    </div>
  );
}