import React, { useState } from "react";
import {
  Activity,
  BookOpen,
  FileText,
  CreditCard,
  Menu,
  Settings,
  Users2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import SettingsMenu from "@/components/common/SettingsMenu";
import { useUser } from "@/context/UserContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const items = [
    { icon: BookOpen, label: "Turnos", path: "/turnos" }, // ✅ primero como pantalla principal
    { icon: Activity, label: "Pacientes", path: "/pacientes" },
    { icon: FileText, label: "Recetas", path: "/recetas" },
    { icon: CreditCard, label: "Facturación", path: "/facturacion" },
  ];

  // ✅ Mostrar "Usuarios" solo para admin y master
  if (["admin", "master"].includes(user?.role)) {
    items.push({ icon: Users2, label: "Usuarios", path: "/admin" });
  }

  return (
    <aside
      className={`relative bg-gradient-to-b from-white via-[#4fdfbe] to-[#33bebc]
        flex flex-col items-center transition-all duration-300
        ${isOpen ? "w-[200px]" : "w-[80px]"} h-screen`}
    >
      <button onClick={() => setIsOpen(!isOpen)} className="text-black mt-4 mb-6">
        <Menu className="h-6 w-6" />
      </button>

      <nav className="flex flex-col gap-4 w-full">
        {items.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isOpen={isOpen}
            isActive={
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path)
            }
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      <div className="mt-auto mb-6 w-full flex justify-center">
        <button onClick={() => setShowSettings(!showSettings)}>
          <Settings className="w-7 h-7 text-black" />
        </button>
      </div>

      <SettingsMenu visible={showSettings} />
    </aside>
  );
}