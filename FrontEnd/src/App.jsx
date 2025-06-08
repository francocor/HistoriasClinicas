import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import LayoutSecretaria from "@/components/secretaria/LayoutSecretaria";

// CONTEXTO & LOGIN
import Login from "@/components/login/Login";
import { useUser } from "@/context/UserContext";

// PROFESIONAL
import HomeProfesionales from "@/components/home/HomeProfesionales";
import Pacientes from "@/components/pacientes/Pacientes";
import HistoriaClinica from "@/components/historia-clinica/HistoriaClinica";
import FichaPaciente from "@/components/ficha-paciente/FichaPaciente";
import Atencion from "@/components/atencion/Atencion";
import Turnos from "@/components/turnos/Turnos";
import Recetas from "@/components/recetas/Recetas";
import Balance from "@/components/graficos/Balances";

// SECRETARIA
import HomeSecretaria from "@/components/secretaria/HomeSecretaria";
import MedicosSecretaria from "@/components/secretaria/MedicosSecretaria";

export default function App() {
  const { user, setUser, isReady } = useUser();

  // Validación de sesión (nunca modificar estado en render)
  useEffect(() => {
    const expiry = parseInt(localStorage.getItem("sessionExpiry") || "0", 10);
    const isExpired = user && Date.now() > expiry;

    if (isExpired) {
      localStorage.clear();
      setUser(null);
    }
  }, [user, setUser]);

  const isSessionValid = () => {
    const expiry = parseInt(localStorage.getItem("sessionExpiry") || "0", 10);
    return Date.now() < expiry;
  };

  const isLoggedIn = user && isSessionValid();

  // ⏳ Esperar a que cargue el contexto
  if (!isReady) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center animate-pulse">
          <img src="/src/assets/Logo.png" alt="logo" className="w-20 h-20 mx-auto mb-4" />
          <p className="text-gray-500">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* REDIRECCIÓN */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              user.role === "secretaria" ? (
                <Navigate to="/secretaria" replace />
              ) : (
                <Navigate to="/pacientes" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/*ADMINISTRADOR */}
        {user?.role === "admin" && (
          <Route path="/" element={<Layout />}>
            <Route index element={<HomeProfesionales />} />
            <Route path="pacientes" element={<Pacientes />} />
            <Route path="historia-clinica" element={<HistoriaClinica />} />
            <Route path="ficha-paciente" element={<FichaPaciente />} />
            <Route path="atencion" element={<Atencion />} />
            <Route path="turnos" element={<Turnos role="admin" />} />
            <Route path="graficos" element={<Balance />} />
            <Route path="admin" element={<AdminPanel />} /> {/* NUEVO */}
          </Route>
        )}

        {/* PROFESIONALES */}
        {user?.role === "profesional" && (
          <Route path="/" element={<Layout />}>
            <Route index element={<HomeProfesionales />} />
            <Route path="pacientes" element={<Pacientes />} />
            <Route path="historia-clinica" element={<HistoriaClinica />} />
            <Route path="ficha-paciente" element={<FichaPaciente />} />
            <Route path="atencion" element={<Atencion />} />
            <Route path="turnos" element={<Turnos role="profesional" />} />
            <Route path="recetas" element={<Recetas />} />
            <Route path="graficos" element={<Balance />} />
          </Route>
        )}

        {/* SECRETARIA */}
        {user?.role === "secretaria" && (
          <Route path="/secretaria" element={<LayoutSecretaria />}>
            <Route index element={<HomeSecretaria />} />
            <Route path="medicos" element={<MedicosSecretaria />} />
            <Route path="turnos" element={<Turnos role="secretaria" />} />
            <Route path="graficos" element={<Balance />} />
          </Route>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}