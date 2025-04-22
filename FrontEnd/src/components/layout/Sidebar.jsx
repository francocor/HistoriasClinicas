import React, { useState } from "react";
import {
  Home,
  Activity,
  BookOpen,
  FileText,
  BarChart2,
  Menu,
  Settings,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import SettingsMenu from "@/components/common/SettingsMenu";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Activity, label: "Pacientes", path: "/pacientes" },
    { icon: BookOpen, label: "Turnos", path: "/turnos" },
    { icon: FileText, label: "Recetas", path: "/recetas" },
    { icon: BarChart2, label: "Gráficos", path: "/graficos" },
  ];

  return (
    <aside
      className={`relative bg-gradient-to-b from-white via-[#4fdfbe] to-[#33bebc]
        flex flex-col items-center transition-all duration-300
        ${isOpen ? "w-[200px]" : "w-[80px]"} h-screen`}
    >
      {/* Botón de menú */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-black mt-4 mb-6"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Navegación */}
      <nav className="flex flex-col gap-4 w-full">
        {items.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isOpen={isOpen}
            isActive={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      {/* Ajustes botón */}
      <div className="mt-auto mb-6 w-full flex justify-center">
        <button onClick={() => setShowSettings(!showSettings)}>
          <Settings className="w-7 h-7 text-black" />
        </button>
      </div>

      {/* Menú de ajustes */}
      <SettingsMenu visible={showSettings} />
    </aside>
  );
}