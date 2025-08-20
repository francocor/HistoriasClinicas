import React, { useRef, useState } from "react";
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
  const formRef = useRef(null);

  // Revalida coincidencia (usamos trim para evitar falsos negativos por espacios pegados)
  const validateMatch = () => {
    const form = formRef.current;
    const confirmEl = form?.elements?.namedItem("confirmPassword");
    if (confirmEl) {
      const a = String(newPassword ?? "").trim();
      const b = String(confirmEl.value ?? "").trim();
      if (a && b && a !== b) {
        confirmEl.setCustomValidity("Las contraseñas no coinciden.");
      } else {
        confirmEl.setCustomValidity("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sincronizamos validaciones antes de checkValidity()
    validateMatch();

    const form = formRef.current;
    if (!form.checkValidity()) {
      form.reportValidity();
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

      if (!res.ok) {
        const text = await res.text();
        console.error("No se pudo cambiar la contraseña:", text);
        return; // sin Swal de error: las validaciones quedan en el form
      }

      Swal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        timer: 1400,
        showConfirmButton: false,
      });

      // Limpio y cierro
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOpen(false);
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
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

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              {/* Contraseña actual: SOLO requerida (puede ser provisoria) */}
              <div>
                <label className="text-sm font-medium text-gray-700">Contraseña actual</label>
                <Input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingrese contraseña actual"
                />
              </div>

              {/* Nueva contraseña: reglas de fuerza + ayuda visible */}
              <div>
                <label className="text-sm font-medium text-gray-700">Nueva contraseña</label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  pattern="^(?=.*[A-Z])(?=.*\d).{8,}$"
                  title="Debe tener mínimo 8 caracteres, al menos 1 mayúscula y 1 número."
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    // Cada vez que cambia, revalidamos el match para limpiar warnings
                    validateMatch();
                  }}
                  placeholder="Ingrese nueva contraseña"
                  aria-describedby="pwd-help"
                />
                <p id="pwd-help" className="text-xs text-gray-600 mt-1">
                  Requisitos: mínimo 8 caracteres, al menos 1 mayúscula y 1 número.
                </p>
              </div>

              {/* Confirmación: required + setCustomValidity para mismatch */}
              <div>
                <label className="text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
                <Input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validateMatch();
                  }}
                  placeholder="Confirme nueva contraseña"
                />
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-cyan-600 text-white rounded-full hover:bg-cyan-700"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>

              <DialogClose asChild>
                <Button type="button" variant="ghost" className="w-full text-gray-600 hover:bg-gray-100 mt-2">
                  Cancelar
                </Button>
              </DialogClose>
            </form>
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
