import React, { createContext, useContext, useEffect, useState } from "react";

// 1️⃣ Creamos el contexto
const NotificationContext = createContext();

// 2️⃣ Proveedor del contexto
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [role, setRole] = useState("profesional"); // Se actualiza automáticamente desde el contexto de usuario más adelante

  // 🔁 Simulación de notificaciones iniciales
  useEffect(() => {
    const notifsProfesional = [
      "📅 Próximo turno: 09:00 - Juan Pérez",
      "🕐 Turno 09:30 - Laura Gómez",
    ];

    const notifsSecretaria = [
      "📋 Revisá la agenda del Dr. Fernández",
      "🔔 2 pacientes sin asignar para mañana",
    ];

    setNotifications(role === "secretaria" ? notifsSecretaria : notifsProfesional);
  }, [role]);

  // Función para agregar notificación
  const addNotification = (msg) => {
    setNotifications((prev) => [...prev, msg]);
  };

  // Función para limpiar
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, clearNotifications, setRole }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// 3️⃣ Hook personalizado
export const useNotifications = () => useContext(NotificationContext);
