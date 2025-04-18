import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EyeOff, Lock, User } from "lucide-react";
import React from "react";

export default function Login() {
  const loginData = {
    appName: "Harmonia",
    fields: [
      {
        id: "username",
        label: "Usuario",
        type: "text",
        icon: <User className="h-5 w-5 text-gray-500" />,
      },
      {
        id: "password",
        label: "Contraseña",
        type: "password",
        icon: <Lock className="h-5 w-5 text-gray-500" />,
        endIcon: <EyeOff className="h-5 w-5 text-gray-500 cursor-pointer" />,
      },
    ],
    buttonText: "Ingresar",
    recoveryText: "Recuperar contraseña",
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
            <div className="mb-8">
              <h1 className="text-4xl font-normal font-sans bg-gradient-to-r from-[#152630] to-[#152630] bg-clip-text text-transparent">
                {loginData.appName}
              </h1>
            </div>

            {/* Formulario */}
            <div className="w-full space-y-6 px-4 sm:px-8">
              {loginData.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label
                    htmlFor={field.id}
                    className="block text-center text-2xl font-normal font-sans text-black"
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute left-2 top-1/2 -translate-y-1/2">
                      {field.icon}
                    </div>
                    <Input
                      id={field.id}
                      type={field.type}
                      className="pl-10 pr-10 h-10 bg-[#fcfefe] rounded-lg w-full"
                    />
                    {field.endIcon && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {field.endIcon}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Botón Login */}
              <div className="flex justify-center mt-6">
                <Button className="rounded-[40px] bg-white text-black hover:bg-gray-100 shadow-[8px_8px_1.9px_#00000040] w-[125px] h-[35px] font-sans text-2xl">
                  {loginData.buttonText}
                </Button>
              </div>

              {/* Link Recuperar Contraseña */}
              <div className="flex justify-center mt-10">
                <a
                  href="#"
                  className="text-xl font-normal font-sans text-black underline underline-offset-4 decoration-1"
                >
                  {loginData.recoveryText}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}