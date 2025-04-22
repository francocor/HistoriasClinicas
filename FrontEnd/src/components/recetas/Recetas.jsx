import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Bell, Book, Heart, Home, Settings, User } from "lucide-react";
import React from "react";
import BotonHarmonia from "@/components/ui/BotonHarmonia"

export default function Recetas() {
  const platforms = [
    {
      id: 1,
      name: "PAMI",
      image: "/images-removebg-preview-1.png",
      hasDropdown: false,
    },
    {
      id: 2,
      name: "MR DIGITAL",
      image: "/1200x630wa-removebg-preview-1.png",
      hasDropdown: true,
    },
    {
      id: 3,
      name: "RPFÁCIL",
      image: "/c6ce51f9-3b44-46ac-b3d3-8d044710ac62-removebg-preview-1.png",
      hasDropdown: true,
    },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-[1366px] h-[768px] relative">

        {/* Main content */}
        <div className="absolute w-[999px] h-[666px] top-[93px] left-80">
          <h1 className="text-5xl font-inter text-center mb-16">Recetas</h1>

          <h2 className="text-[32px] font-montserrat text-center mb-12">
            Plataformas para las recetas digitales
          </h2>

          {/* Prescription platforms */}
          <div className="flex justify-center gap-10 mb-16">
            {platforms.map((platform) => (
              <Card
                key={platform.id}
                className="w-[248px] h-60 rounded-[40px] border border-black"
              >
                <CardContent className="flex flex-col items-center justify-between h-full p-4">
                  <div className="flex-1 flex items-center justify-center">
                    <img
                      src={platform.image}
                      alt={platform.name}
                      className="object-contain max-h-[160px]"
                    />
                  </div>
                  <BotonHarmonia
                  >
                    Generar
                  </BotonHarmonia>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Health insurance selectors */}
          <div className="flex justify-center gap-10">
            {platforms.map((platform, index) => (
              <div key={`insurance-${index}`} className="flex items-center">
                <span className="font-montserrat text-xl mr-2">Obra social:</span>
                {index === 0 ? (
                  <div className="relative w-[100px] border border-black">
                    <Input
                      defaultValue="Pami"
                      className="h-[19px] text-xl text-center p-0 border-none"
                    />
                  </div>
                ) : (
                  <Select>
                    <SelectTrigger className="w-[130px] h-[19px] border border-black rounded-none">
                      <span className="text-sm"></span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pami">Pami</SelectItem>
                      <SelectItem value="osde">OSDE</SelectItem>
                      <SelectItem value="swiss">Swiss Medical</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
