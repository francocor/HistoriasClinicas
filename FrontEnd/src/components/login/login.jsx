import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import BotonHarmonia from "@/components/ui/BotonHarmonia";
import logo from "@/assets/Logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { setUser, setToken } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMsg("Por favor completá ambos campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();
      const { token, user } = data;

      // Validación de datos del backend
      if (!user || !token || !user.role) {
        throw new Error("Respuesta inválida del servidor");
      }

      const now = Date.now();
      const expiry = now + 60 * 60 * 1000; // 1 hora

      // Guardamos en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("sessionExpiry", expiry.toString());

      // Actualizamos contexto global
      setUser(user);
      setToken(token);
      setErrorMsg("");

      // Redirigir según rol
      if (user.role === "secretaria") {
        navigate("/secretaria");
      }else {
        navigate("/")
      } 

    } catch (error) {
      console.error("Login error:", error.message);
      localStorage.clear();
      setErrorMsg(error.message || "Error inesperado");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#fcfefe] px-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-none bg-gradient-to-b from-[#e0ffff] to-[#20b2aa] rounded-[40px] py-6">
          <CardContent className="flex flex-col items-center pt-6">

            {/* Logo */}
            <div className="w-40 h-40 mb-4 rounded-full bg-white p-4 shadow-md flex items-center justify-center">
              <img src={logo} alt="Logo TORDO" className="w-full h-full object-contain" />
            </div>

            {/* Formulario */}
            <div className="w-full space-y-6 px-4 sm:px-8">
              {/* Usuario */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-center text-2xl text-black">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 pr-10 h-10 bg-[#fcfefe] rounded-lg w-full"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-center text-2xl text-black">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-10 bg-[#fcfefe] rounded-lg w-full"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {showPassword ? (
                      <Eye className="h-5 w-5 text-gray-500 cursor-pointer" onClick={() => setShowPassword(false)} />
                    ) : (
                      <EyeOff className="h-5 w-5 text-gray-500 cursor-pointer" onClick={() => setShowPassword(true)} />
                    )}
                  </div>
                </div>
              </div>

              {/* Mensaje de error */}
              {errorMsg && (
                <p className="text-red-500 text-sm text-center">{errorMsg}</p>
              )}

              {/* Botón Ingresar */}
              <div className="flex justify-center mt-6">
                <BotonHarmonia onClick={handleLogin}>Ingresar</BotonHarmonia>
              </div>

              {/* Recuperar contraseña */}
              <div className="flex justify-center mt-10">
                <a href="#" className="text-xl text-black underline underline-offset-4">
                  Recuperar contraseña
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}