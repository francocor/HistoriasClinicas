import React, { useState } from "react";
import {
  Home,
  Activity,
  BookOpen,
  FileText,
  BarChart2,
  Settings,
  Menu,
} from "lucide-react";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Activity, label: "Pacientes", path: "/pacientes" },
    { icon: BookOpen, label: "Turnos", path: "/turnos" },
    { icon: FileText, label: "Recetas", path: "/recetas" },
    { icon: BarChart2, label: "Gráficos", path: "/graficos" },
  ];

  return (
    <aside
      className="h-screen bg-gradient-to-b from-white via-[#4fdfbe] to-[#33bebc] flex flex-col items-center py-4 transition-all duration-300"
      style={{ width: isOpen ? 200 : 80 }}
    >
      <button onClick={() => setIsOpen(!isOpen)} className="mb-6 text-black">
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
          />
        ))}
      </nav>

      <div className="mt-auto mb-4 w-full">
        <SidebarItem
          icon={Settings}
          label="Ajustes"
          path="/ajustes"
          isOpen={isOpen}
        />
      </div>
    </aside>
  );
}