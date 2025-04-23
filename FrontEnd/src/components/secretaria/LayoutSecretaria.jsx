import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SidebarSecretaria from "@/components/layout/SidebarSecretaria";
import Header from "@/components/layout/Header";
import SettingsMenu from "@/components/common/SettingsMenu";

export default function LayoutSecretaria() {
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar Secretaria */}
      <SidebarSecretaria
        isOpen={true}
        location={location}
        navigate={navigate}
        showSettings={showSettings}
        toggleSettings={() => setShowSettings((prev) => !prev)}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-white p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Menú de ajustes */}
      <SettingsMenu visible={showSettings} />
    </div>
  );
}