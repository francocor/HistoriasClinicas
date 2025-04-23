import React, { useState } from "react";
import { Bell, User } from "lucide-react";
import UserMenu from "@/components/common/UserMenu";

// ⚠️ Por ahora es un mock, luego lo vas a reemplazar por el usuario real desde auth o contexto
const mockUser = {
  name: "Pepito Fernández",
  role: "profesional", // o "secretaria"
};

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayName =
    mockUser.role === "secretaria"
      ? `Secret. ${mockUser.name}`
      : `Dr. ${mockUser.name}`;

  return (
    <header className="w-full h-[85px] bg-gradient-to-r from-white via-[#4fdfbe] to-[#33bebc] flex items-center justify-end px-6 relative">
      {/* Notificación */}
      <Bell className="w-[52px] h-[52px] text-black mr-4" />

      {/* Nombre del usuario */}
      <div className="mr-4">
        <span className="bg-white text-black text-center px-6 py-2 rounded-full border border-[#d4d4d4] shadow-sm text-base font-medium">
          {displayName}
        </span>
      </div>

      {/* Ícono de usuario */}
      <div
        className="w-[70px] h-[70px] bg-white rounded-full flex items-center justify-center cursor-pointer"
        onClick={() => setShowUserMenu(!showUserMenu)}
      >
        <User className="w-8 h-8 text-black" />
      </div>

      {/* Menú desplegable */}
      <UserMenu visible={showUserMenu} />
    </header>
  );
}