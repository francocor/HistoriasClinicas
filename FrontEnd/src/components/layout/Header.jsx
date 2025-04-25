import React, { useState } from "react";
import { Bell, User } from "lucide-react";
import UserMenu from "@/components/common/UserMenu";
import { useUser } from "@/context/UserContext";
import { useNotifications } from "@/context/NotificationContext";
import logo from "@/assets/Logo.png";

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useUser();
  const { notifications, clearNotifications } = useNotifications();

  const displayName =
    user?.role === "secretaria"
      ? `Secret. ${user.name}`
      : `Dr. ${user?.name ?? "Usuario"}`;

  return (
    <header className="w-full h-[85px] bg-gradient-to-r from-white via-[#4fdfbe] to-[#33bebc] flex items-center justify-between px-4 sm:px-6 relative">
      
      {/* Logo en el centro (usa position absolute y translate) */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center shadow-md">
          <img src={logo} alt="Logo TORDO" className="w-8 h-8 object-contain" />
        </div>
      </div>

      {/* Grupo derecha: notificaciones, nombre, usuario */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Bell Icon con dropdown */}
        <div className="relative">
          <Bell
            className="w-6 h-6 text-black cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[280px] bg-white rounded-lg shadow-lg border border-gray-300 z-50">
              <div className="p-4 space-y-2">
                {notifications.map((nota, i) => (
                  <p key={i} className="text-sm text-black">{nota}</p>
                ))}
                <button
                  onClick={clearNotifications}
                  className="text-sm text-gray-500 hover:text-black mt-2"
                >
                  Limpiar notificaciones
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nombre */}
        <span className="bg-white text-black text-center px-4 py-1 rounded-full border border-[#d4d4d4] shadow-sm text-sm font-medium whitespace-nowrap max-w-[180px] truncate">
          {displayName}
        </span>

        {/* Ícono usuario */}
        <div
          className="w-[42px] h-[42px] bg-white rounded-full flex items-center justify-center cursor-pointer"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <User className="w-5 h-5 text-black" />
        </div>
      </div>

      {/* Menú desplegable */}
      <UserMenu visible={showUserMenu} />
    </header>
  );
}
