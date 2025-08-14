import React, { useEffect, useState } from "react";
import { Bell, User } from "lucide-react";
import UserMenu from "@/components/common/UserMenu";
import { useUser } from "@/context/UserContext";
import logo from "@/assets/Logo.png";

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);

  const displayName =
    user?.role === "secretaria"
      ? `Secret. ${user.name}`
      : `Dr. ${user?.name ?? "Usuario"}`;

  // 🧠 Cargar turnos del día para el profesional
  useEffect(() => {
    const cargarNotificacionesDelDia = async () => {
      try {
        if (!user || !user.id || user.role === "secretaria") return;

        const res = await fetch(`http://localhost:4000/api/turnos/hoy/${user.id}`);
        const data = await res.json();

        const mensajes = data.map((turno) => {
          const hora = new Date(turno.fecha).toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          });
          return `Turno con ${turno.paciente} a las ${hora}`;
        });

        setNotifications(mensajes);
      } catch (error) {
        console.error("Error al cargar notificaciones de turnos:", error);
      }
    };

    cargarNotificacionesDelDia();

    // Opcional: refresco automático cada X segundos
    const interval = setInterval(cargarNotificacionesDelDia, 30000); // cada 30s
    return () => clearInterval(interval);
  }, [user]);

  return (
    <header className="w-full bg-gradient-to-r from-white via-[#4fdfbe] to-[#33bebc] px-4 sm:px-6 py-2">
      <div className="flex flex-col sm:flex-row items-center justify-between relative gap-2 sm:gap-0">
        
        {/* Logo centrado arriba en mobile, al centro en desktop */}
        <div className="order-1 sm:order-2">
          <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center shadow-md">
            <img src={logo} alt="Logo TORDO" className="w-8 h-8 object-contain" />
          </div>
        </div>

        {/* Grupo derecha */}
        <div className="order-2 sm:order-3 flex items-center gap-2 sm:gap-4 ml-auto">
          {/* Notificaciones */}
          <div className="relative">
            <Bell
              className="w-6 h-6 text-black cursor-pointer"
              onClick={() => setShowNotifications(!showNotifications)}
            />

            {/* 🔴 Badge */}
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                {notifications.length}
              </span>
            )}

            {/* Menú de notificaciones */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[280px] bg-white rounded-lg shadow-lg border border-gray-300 z-50">
                <div className="p-4 space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay notificaciones</p>
                  ) : (
                    notifications.map((nota, i) => (
                      <p key={i} className="text-sm text-black">{nota}</p>
                    ))
                  )}
                  <button
                    onClick={() => setNotifications([])}
                    className="text-sm text-gray-500 hover:text-black mt-2"
                  >
                    Limpiar notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Nombre */}
          <span className="bg-white text-black px-4 py-1 rounded-full border border-[#d4d4d4] shadow-sm text-sm font-medium whitespace-nowrap max-w-[160px] truncate">
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

        {/* Menú desplegable usuario */}
        <UserMenu visible={showUserMenu} />
      </div>
    </header>
  );
}
