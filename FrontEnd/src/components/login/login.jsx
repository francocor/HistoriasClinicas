import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EyeOff, Lock, User } from "lucide-react";
import BotonHarmonia from "@/components/ui/BotonHarmonia";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = () => {
    // Mock login para profesional
    if (username === "pepito" && password === "1234") {
      const user = { name: "Pepito Fernández", role: "profesional" };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    }

    // Mock login para secretaria
    else if (username === "maria" && password === "1234") {
      const user = { name: "Maria Lopez", role: "secretaria" };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/secretaria");
    }

    // Si las credenciales no coinciden
    else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#fcfefe] px-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-none bg-gradient-to-b from-[#e0ffff] to-[#20b2aa] rounded-[40px] py-6">
          <CardContent className="flex flex-col items-center pt-6">
            {/* Logo */}
            <div className="w-40 h-40 mb-4">
              <img
                src="/logo.png"
                alt="Harmonia Logo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* App Name */}
            <h1 className="text-4xl font-normal font-sans bg-gradient-to-r from-[#152630] to-[#152630] bg-clip-text text-transparent mb-8">
              Harmonia
            </h1>

            {/* Formulario */}
            <div className="w-full space-y-6 px-4 sm:px-8">
              {/* Usuario */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-center text-2xl font-normal font-sans text-black"
                >
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
                <label
                  htmlFor="password"
                  className="block text-center text-2xl font-normal font-sans text-black"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-10 bg-[#fcfefe] rounded-lg w-full"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <EyeOff className="h-5 w-5 text-gray-500 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Botón Ingresar */}
              <div className="flex justify-center mt-6">
                <BotonHarmonia
                  onClick={handleLogin}
                  
                >
                  Ingresar
                </BotonHarmonia>
              </div>

              {/* Link recuperar contraseña */}
              <div className="flex justify-center mt-10">
                <a
                  href="#"
                  className="text-xl font-normal font-sans text-black underline underline-offset-4"
                >
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
