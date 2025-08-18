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
import Swal from "sweetalert2";

const API = "http://localhost:4000";

export default function SettingsMenu({ visible }) {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleGuardar = async () => {
    // Validaciones rápidas en el cliente
    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire("Campos incompletos", "Todos los campos son obligatorios.", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire("Atención", "Las contraseñas nuevas no coinciden.", "warning");
      return;
    }
    if (newPassword.length < 8) {
      Swal.fire("Atención", "La nueva contraseña debe tener al menos 8 caracteres.", "warning");
      return;
    }
    if (newPassword === currentPassword) {
      Swal.fire("Atención", "La nueva contraseña no puede ser igual a la actual.", "warning");
      return;
    }

    try {
      setSaving(true);
      const token = sessionStorage.getItem("token");

      const res = await fetch(`${API}/api/auth/me/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          userId: JSON.parse(sessionStorage.getItem("user") || "{}")?.id,
        }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { error: text }; }

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo cambiar la contraseña");
      }

      Swal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        timer: 1400,
        showConfirmButton: false,
      });

      // Limpio campos y cierro modal
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOpen(false);
    } catch (err) {
      Swal.fire("Error", String(err.message || err), "error");
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

  return (
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
            style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-center mb-4">
                Cambiar Contraseña
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Contraseña actual</label>
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingrese contraseña actual"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Nueva contraseña</label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingrese nueva contraseña"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme nueva contraseña"
                />
              </div>

              <Button
                onClick={handleGuardar}
                disabled={saving}
                className="w-full bg-cyan-600 text-white rounded-full hover:bg-cyan-700"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>

              <DialogClose asChild>
                <Button variant="ghost" className="w-full text-gray-600 hover:bg-gray-100 mt-2">
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
  );
}
