import React from "react";

export default function SettingsMenu({ visible }) {
  if (!visible) return null;

  return (
    <div className="absolute bottom-[80px] left-6 w-[250px] bg-gradient-to-b from-white via-[#4fdfbe] to-[#33bebc] rounded-2xl shadow-lg p-4 z-50">
      <ul className="flex flex-col gap-2">
        {[
          "Configurar Recordatorios",
          "Copias de Seguridad",
          "Cambio de contraseña",
          "Permisos",
          "Acerca de",
        ].map((option, index) => (
          <button
            key={index}
            className="w-full text-black bg-white/60 rounded-lg px-4 py-2 hover:bg-white shadow-sm text-sm font-medium"
          >
            {option}
          </button>
        ))}
      </ul>
    </div>
  );
}
