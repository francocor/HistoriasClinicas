import React from "react";
import { cn } from "@/lib/utils"; // si usás esta utilidad

export default function SidebarItem({ icon: Icon, label, isOpen, onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full px-4 py-2 transition-colors",
        isOpen ? "justify-start gap-4" : "justify-center",
        isActive
          ? "bg-white/30 text-black font-semibold shadow-md"
          : "hover:bg-white/20 text-black"
      )}
    >
      <Icon className="h-6 w-6" />
      {isOpen && <span className="text-sm">{label}</span>}
    </button>
  );
}