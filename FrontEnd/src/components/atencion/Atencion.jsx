import React from "react";
import AtencionHeader from "./AtencionHeader";
import AtencionCard from "./AtencionCard";
import { useLocation } from "react-router-dom";


export default function Atencion() {
   const { state } = useLocation();
  const id = state?.id;
  return (
    <div className="flex h-screen w-full">
      {/* Layout global ya maneja Sidebar y Header */}

      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-white p-4">
          <AtencionHeader id={id}/>
          <AtencionCard id={id}/>
        </main>
      </div>
    </div>
  );
}