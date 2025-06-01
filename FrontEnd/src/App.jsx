import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
  const { user } = useUser();

  const isSessionValid = () => {
    const expiry = parseInt(sessionStorage.getItem("sessionExpiry") || "0", 10);
    return Date.now() < expiry;
  };

  const isLoggedIn = user && isSessionValid();

  // Si la sesión expiró, limpiamos y redirigimos
  if (user && !isSessionValid()) {
    sessionStorage.clear();
    setUser(null);
    return <Navigate to="/login" replace />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN siempre disponible */}
        <Route path="/login" element={<Login />} />

        {/* RUTA INICIAL: redirige según tipo de usuario */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "secretaria" ? (
                <Navigate to="/secretaria" replace />
              ) : (
                <Layout />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* PROFESIONALES */}
          {user?.role === "profesional" && (
            <>
              <Route index element={<HomeProfesionales />} />
              <Route path="pacientes" element={<Pacientes />} />
              <Route path="historia-clinica" element={<HistoriaClinica />} />
              <Route path="ficha-paciente" element={<FichaPaciente />} />
              <Route path="atencion" element={<Atencion />} />
              <Route path="turnos" element={<Turnos role="profesional" />} />
              <Route path="recetas" element={<Recetas />} />
              <Route path="graficos" element={<Balance />} />
            </>
          )}
        </Route>

        {/* SECRETARIA */}
        {user?.role === "secretaria" && (
          <Route path="/secretaria" element={<LayoutSecretaria />}>
            <Route index element={<HomeSecretaria />} />
            <Route path="medicos" element={<MedicosSecretaria />} />
            <Route path="turnos" element={<Turnos role="secretaria" />} />
            <Route path="graficos" element={<Balance />} />
          </Route>
        )}

        {/* fallback para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}