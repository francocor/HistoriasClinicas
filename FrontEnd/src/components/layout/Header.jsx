import React, { useState } from "react";
import { Bell, User } from "lucide-react";
import UserMenu from "@/components/common/UserMenu";

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="w-full h-[85px] bg-gradient-to-r from-white via-[#4fdfbe] to-[#33bebc] flex items-center justify-end px-6 relative">
      <Bell className="w-[52px] h-[52px] text-black mr-4" />

      {/* Nombre del usuario (placeholder) */}
      <div className="bg-[#179cba] rounded-[50px] h-[70px] px-4 flex items-center mr-4">
        <span className="text-2xl font-montserrat text-black">
          Dr. Pepito Fernández
        </span>
      </div>

      {/* Ícono de usuario */}
      <div
        className="w-[70px] h-[70px] bg-white rounded-full flex items-center justify-center cursor-pointer"
        onClick={() => setShowUserMenu(!showUserMenu)}
      >
        <User className="w-8 h-8 text-black" />
      </div>

      <UserMenu visible={showUserMenu} />
    </header>
  );
}