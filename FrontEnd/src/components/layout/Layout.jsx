import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

// Si usás React Router:
import { Outlet } from "react-router-dom"; 

export default function Layout() {
  return (
    <div className="flex h-screen w-full">
      {/* Menú lateral fijo */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Barra superior */}
        <Header />

        {/* Contenido dinámico */}
        <main className="flex-1 bg-white p-4">
          <Outlet />
          {/* Si no usás router, podés poner directamente {children} */}
        </main>
      </div>
    </div>
  );
}