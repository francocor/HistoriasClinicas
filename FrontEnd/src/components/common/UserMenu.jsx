import React from "react";

export default function UserMenu({ visible }) {
  if (!visible) return null;

  return (
    <div className="absolute top-[90px] right-6 w-[220px] bg-gradient-to-b from-white via-[#4fdfbe] to-[#33bebc] rounded-2xl shadow-lg p-4 z-50">
      <ul className="flex flex-col gap-2">
        {["Cambiar Usuario", "Editar datos personales", "Editar Horarios", "Cerrar sesión"].map(
          (option, index) => (
            <button
              key={index}
              className="w-full text-black bg-white/60 rounded-lg px-4 py-2 hover:bg-white shadow-sm text-sm font-medium"
            >
              {option}
            </button>
          )
        )}
      </ul>
    </div>
  );
}
