import React, { useState } from "react";
import { Bell, User } from "lucide-react";
import UserMenu from "@/components/common/UserMenu";
import { useUser } from "@/context/UserContext";

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useUser();

  const displayName =
    user?.role === "secretaria"
      ? `Secret. ${user.name}`
      : `Dr. ${user?.name ?? "Usuario"}`;

  const notificaciones = user?.role === "secretaria"
    ? [
        "📅 Recordá revisar la agenda de Dr. Fernández.",
        "🔔 2 pacientes sin asignar para mañana.",
      ]
    : [
        "👨‍⚕️ Próximo turno: 10:30 - Juan Pérez.",
        "🕒 Turno 11:00 - Laura Gómez.",
      ];

  return (
    <header className="w-full h-[85px] bg-gradient-to-r from-white via-[#4fdfbe] to-[#33bebc] flex items-center justify-end px-6 relative">
      {/* Notificación */}
      <div className="relative mr-4">
        <Bell
          className="w-[52px] h-[52px] text-black cursor-pointer"
          onClick={() => setShowNotifications(!showNotifications)}
        />
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-[300px] bg-white rounded-lg shadow-lg border border-gray-300 z-50">
            <div className="p-4 space-y-2">
              {notificaciones.map((nota, i) => (
                <p key={i} className="text-sm text-black">
                  {nota}
                </p>
              ))}
              <button
                className="text-sm text-gray-500 hover:text-black mt-2"
                onClick={() => setShowNotifications(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>

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