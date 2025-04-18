import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function SidebarItem({ icon: Icon, label, path, isOpen }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className={cn(
        "flex items-center w-full px-4 py-2 hover:bg-white/20 transition-colors",
        isOpen ? "justify-start gap-4" : "justify-center"
      )}
    >
      <Icon className="h-6 w-6 text-black" />
      {isOpen && <span className="text-black font-semibold">{label}</span>}
    </button>
  );
}