import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, User } from "lucide-react";
import React from "react";

export default function SeleccionUser() {
  const userRoles = [
    {
      id: "professional",
      label: "Profesional",
      icon: <Activity className="w-16 h-16" />,
    },
    {
      id: "secretary",
      label: "Secretaría",
      icon: <User className="w-16 h-16" />,
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
      <Card className="w-full max-w-3xl rounded-[40px] bg-gradient-to-b from-[#e0fffa] to-[#4ac0b0] shadow-lg">
        <CardContent className="flex flex-col items-center p-8 sm:p-16">
          <h1 className="text-4xl text-center text-black font-normal mb-12 drop-shadow-[6px_3px_2.8px_rgba(0,0,0,0.25)] font-sans">
            ¿Quién está ahí?
          </h1>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16 w-full mb-10">
            {userRoles.map((role) => (
              <div key={role.id} className="flex flex-col items-center">
                {role.icon}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16 w-full">
            {userRoles.map((role) => (
              <Button
                key={role.id}
                variant="outline"
                className="w-[194px] h-[46px] rounded-[40px] bg-white hover:bg-gray-100 shadow-[8px_8px_1.9px_rgba(0,0,0,0.25)] text-2xl font-normal font-sans"
              >
                {role.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
