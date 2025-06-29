import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsMenu({ visible }) {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleGuardar = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    console.log("Contraseña actual:", currentPassword);
    console.log("Nueva contraseña:", newPassword);
    setOpen(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="absolute bottom-[80px] left-6 w-[250px] bg-gradient-to-b from-white via-[#4fdfbe] to-[#33bebc] rounded-2xl shadow-lg p-4 z-50">
        <ul className="flex flex-col gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="w-full text-black bg-white/60 rounded-lg px-4 py-2 hover:bg-white shadow-sm text-sm font-medium">
                Cambio de contraseña
              </button>
            </DialogTrigger>

            <DialogContent
              className="bg-white w-[90vw] max-w-md rounded-xl p-6 shadow-xl z-[999]"
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-center mb-4">
                  Cambiar Contraseña
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Contraseña actual
                  </label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Ingrese contraseña actual"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Nueva contraseña
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ingrese nueva contraseña"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Confirmar nueva contraseña
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme nueva contraseña"
                  />
                </div>

                <Button
                  onClick={handleGuardar}
                  className="w-full bg-cyan-600 text-white rounded-full hover:bg-cyan-700"
                >
                  Guardar cambios
                </Button>

                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full text-gray-600 hover:bg-gray-100 mt-2"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>

          {/* Otros botones */}
          <button className="w-full text-black bg-white/60 rounded-lg px-4 py-2 hover:bg-white shadow-sm text-sm font-medium">
            Permisos
          </button>
          <button className="w-full text-black bg-white/60 rounded-lg px-4 py-2 hover:bg-white shadow-sm text-sm font-medium">
            Acerca de
          </button>
        </ul>
      </div>
    </>
  );
}


