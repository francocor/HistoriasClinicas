import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export default function UserMenu({ visible }) {
  const { setUser } = useUser();
  const navigate = useNavigate();

  if (!visible) return null;

  const opciones = [
    { label: "Cambiar Usuario", action: () => navigate("/login") },
    { label: "Editar datos personales", action: () => alert("Próximamente...") },
    { label: "Editar Horarios", action: () => alert("Próximamente...") },
    {
      label: "Cerrar sesión",
      action: () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("sessionExpiry");
        setUser(null);
        navigate("/login");
      },
    },
  ];

  return (
    <div className="absolute top-[90px] right-6 w-[220px] bg-gradient-to-b from-white via-[#4fdfbe] to-[#33bebc] rounded-2xl shadow-lg p-4 z-50">
      <ul className="flex flex-col gap-2">
        {opciones.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full text-black bg-white/60 rounded-lg px-4 py-2 hover:bg-white shadow-sm text-sm font-medium"
          >
            {item.label}
          </button>
        ))}
      </ul>
    </div>
  );
}
