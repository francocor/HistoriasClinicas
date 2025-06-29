import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UserMenu({ visible }) {
  const { setUser, user } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [horarios, setHorarios] = useState(user?.horarios || "");

  if (!visible) return null;

  return (
    <>
      {/* Menú flotante */}
      <div className="absolute top-[90px] right-6 w-[220px] bg-gradient-to-b from-white via-[#4fdfbe] to-[#33bebc] rounded-2xl shadow-lg p-4 z-50">
        <ul className="flex flex-col gap-2">
          <button
            onClick={() => setOpen(true)}
            className="w-full text-black bg-white/60 rounded-lg px-4 py-2 hover:bg-white shadow-sm text-sm font-medium"
          >
            Editar Horarios
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              localStorage.removeItem("sessionExpiry");
              setUser(null);
              navigate("/login");
            }}
            className="w-full text-black bg-white/60 rounded-lg px-4 py-2 hover:bg-white shadow-sm text-sm font-medium"
          >
            Cerrar sesión
          </button>
        </ul>
      </div>

      {/* Modal 100% visible */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-5">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-semibold">
                Editar Horarios
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700 block">
                Horarios de atención (ej: Lunes a Viernes de 9:00 a 13:00)
              </label>
              <Input
                value={horarios}
                onChange={(e) => setHorarios(e.target.value)}
                placeholder="Ej: Lunes a Viernes de 9:00 a 13:00"
              />
              <Button
                onClick={() => {
                  console.log("Nuevo horario:", horarios);
                  setOpen(false);
                }}
                className="w-full bg-cyan-600 text-white rounded-full hover:bg-cyan-700"
              >
                Guardar cambios
              </Button>

              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="w-full text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
