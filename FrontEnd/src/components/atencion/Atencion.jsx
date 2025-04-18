import React from "react";
import AtencionHeader from "./AtencionHeader";
import AtencionCard from "./AtencionCard";

export default function Atencion() {
  return (
    <div className="flex h-screen w-full">
      {/* Layout global ya maneja Sidebar y Header */}

      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-white p-4">
          <AtencionHeader />
          <AtencionCard />
        </main>
      </div>
    </div>
  );
}