import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

export default function AtencionHeader() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [archivo, setArchivo] = useState(null);

  const handleArchivoSeleccionado = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
      // 👉 Podés mostrar vista previa o nombre si querés
    }
  };

  return (
    <div className="mb-6">
      {/* Volver + Título */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="p-0 mr-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-[48px] h-[48px] sm:w-[60px] sm:h-[60px]" />
        </Button>
        <h1 className="text-3xl sm:text-4xl font-sans font-normal">Pacientes</h1>
      </div>

      {/* Nombre + Botón cargar estudios */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-sans font-normal">Nombre Paciente</h2>

        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
          <span className="text-sm sm:text-lg font-sans">Estudios y/o análisis</span>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="px-6 py-1 bg-gradient-to-b from-[#179cba] to-white text-black border border-black rounded-[40px] shadow hover:opacity-80 transition w-full sm:w-[120px] text-sm font-medium"
              >
                Cargar
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cargar documento</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleArchivoSeleccionado}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Seleccionar archivo
                </Button>

                {archivo && (
                  <div className="text-sm text-gray-700">
                    Archivo seleccionado: <span className="font-medium">{archivo.name}</span>
                  </div>
                )}

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    // 🔗 Tu compañero puede conectar acá el envío al backend
                    console.log("Archivo a subir:", archivo);
                    alert("Archivo preparado para subir al servidor.");
                  }}
                >
                  Subir documento
                </Button>

                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    className="px-6 py-1 bg-gradient-to-b from-white to-[#cfdedb] text-black border border-black rounded-[40px] shadow hover:opacity-80 transition w-full sm:w-[120px] text-sm font-medium mt-2"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

