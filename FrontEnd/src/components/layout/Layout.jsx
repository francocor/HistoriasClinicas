import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Menú lateral fijo */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header fijo */}
        <Header />

        {/* Área de contenido con scroll interno */}
        <main className="flex-1 overflow-y-auto bg-white p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}