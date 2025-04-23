import React from "react";

export default function NombreUsuario({ user }) {
  if (!user) return null;

  const displayName =
    user.role === "secretaria"
      ? `Secret. ${user.name}`
      : `Dr. ${user.name}`;

  return (
    <span className="bg-white text-black text-center px-6 py-2 rounded-full border border-[#d4d4d4] shadow-sm text-base font-medium">
      {displayName}
    </span>
  );
}
