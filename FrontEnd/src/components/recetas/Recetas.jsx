import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BotonHarmonia from "@/components/ui/BotonHarmonia";
import mrx from "@/assets/mrx.jpg";
import pami from "@/assets/pami.jpg";

export default function Recetas() {
  const platforms = [
    {
      id: 1,
      name: "PAMI",
      image: pami,
      obraSocial: "PAMI",
      webUrl: "https://cup.pami.org.ar/controllers/loginController.php",
    },
    {
      id: 2,
      name: "MisRx",
      image: mrx,
      obraSocial: "Obras Sociales en general",
      webUrl: "https://www.mrdigital.com.ar/",
      androidUrl: "https://play.google.com/store/apps/details?id=com.preserfar.misrx",
      iosUrl: "https://apps.apple.com/app/idXXXXXXXX", // reemplazar por el real si existe
    },
  ];

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleGenerar = (platform) => {
    if (platform.name === "MisRx" && isMobile) {
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isAndroid && platform.androidUrl) {
        window.open(platform.androidUrl, "_blank");
      } else if (isIOS && platform.iosUrl) {
        window.open(platform.iosUrl, "_blank");
      } else {
        window.open(platform.webUrl, "_blank");
      }
    } else {
      window.open(platform.webUrl, "_blank");
    }
  };

  return (
    <main className="w-full flex justify-center bg-white px-4 py-8">
      <div className="w-full max-w-screen-xl flex flex-col items-center gap-8">
        <h1 className="text-4xl text-center font-semibold font-inter">Recetas</h1>
        <h2 className="text-2xl text-center font-montserrat mb-2">
          Plataformas para las recetas digitales
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {platforms.map((platform) => (
            <Card
              key={platform.id}
              className="w-[260px] rounded-[40px] border border-black shadow-md"
            >
              <CardContent className="flex flex-col items-center justify-between p-4 gap-4">
                <img
                  src={platform.image}
                  alt={platform.name}
                  className="object-contain max-h-[130px]"
                />

                <BotonHarmonia onClick={() => handleGenerar(platform)}>
                  Generar
                </BotonHarmonia>

                <div className="w-full">
                  <span className="block text-sm font-medium mb-1 text-center">
                    Obra social:
                  </span>
                  <Input
                    readOnly
                    value={platform.obraSocial}
                    className="w-full h-[38px] border border-black bg-white text-center text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

