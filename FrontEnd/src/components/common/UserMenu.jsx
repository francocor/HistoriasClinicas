import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";

const API = "http://localhost:4000";

const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export default function UserMenu({ visible, onClose }) {
  const { setUser, user } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // --- Estado para editor de horarios ---
  const [profesionales, setProfesionales] = useState([]); // para admin/sec/master
  const [selectedProfesionalId, setSelectedProfesionalId] = useState(null);
  const [rows, setRows] = useState([]); // [{id?, dia_semana, hora_entrada, hora_salida}]
  const [loading, setLoading] = useState(false);

  const puedeElegirProfesional =
    user?.role === "admin" || user?.role === "secretaria" || user?.role === "master";

  // ------- Cerrar menú por interacciones fuera -------
  useEffect(() => {
    function handleOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    function handleScroll() {
      onClose();
    }
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (visible) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
      document.addEventListener("scroll", handleScroll);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [visible, onClose]);

  // --- Cargar lista de profesionales (si aplica) y resolver el profesional_id del usuario profesional ---
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        if (puedeElegirProfesional) {
          const res = await fetch(`${API}/api/profesionales/profesionalFields`);
          const data = await res.json();
          setProfesionales(data || []);
          // por defecto selecciono el primero si hay
          if (data?.length && !selectedProfesionalId) {
            setSelectedProfesionalId(String(data[0].id));
          }
        } else if (user?.role === "profesional") {
          // si en el contexto ya tenés el profesional_id, usalo
          const user_id=user.id
            // sino, lo busco en backend
            const res = await fetch(`${API}/api/profesionales/me/${user_id}`);
            const data = await res.json();
            if (data?.id) setSelectedProfesionalId(String(data.id));
          
        }
      } catch (e) {
        console.error(e);
        Swal.fire("Error", "No se pudo obtener profesionales.", "error");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // --- Cargar horarios cuando ya sabemos qué profesional está seleccionado ---
  useEffect(() => {
    if (!open || !selectedProfesionalId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API}/api/horarios?profesionalId=${selectedProfesionalId}`
        );
        const data = await res.json();
        const normalizados = (data || []).map((h) => ({
          id: h.id,
          dia_semana: h.dia_semana,
          hora_entrada: h.hora_entrada?.slice(0, 5) ?? "",
          hora_salida: h.hora_salida?.slice(0, 5) ?? "",
        }));
        setRows(normalizados);
      } catch (e) {
        console.error(e);
        Swal.fire("Error", "No se pudieron obtener los horarios.", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, selectedProfesionalId]);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { dia_semana: "Lunes", hora_entrada: "09:00", hora_salida: "13:00" },
    ]);
  };

  const removeRow = (idx) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateRow = (idx, patch) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  const saveRows = async () => {
    if (!selectedProfesionalId) return;

    // Validaciones simples
    for (const r of rows) {
      if (!r.dia_semana || !r.hora_entrada || !r.hora_salida) {
        Swal.fire("Atención", "Completá día, entrada y salida en todas las filas.", "warning");
        return;
      }
      if (r.hora_salida <= r.hora_entrada) {
        Swal.fire("Atención", "La hora de salida debe ser mayor a la de entrada.", "warning");
        return;
      }
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/horarios/bulk`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profesionalId: Number(selectedProfesionalId),
          horarios: rows.map((r) => ({
            // id opcional (backend reemplaza en bloque)
            dia_semana: r.dia_semana,
            hora_entrada: r.hora_entrada + ":00",
            hora_salida: r.hora_salida + ":00",
          })),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "No se pudo guardar");
      }

      Swal.fire({
        icon: "success",
        title: "Horarios guardados",
        timer: 1300,
        showConfirmButton: false,
      });
      setOpen(false);
    } catch (e) {
      console.error(e);
      Swal.fire("Error", e.message || "No se pudo guardar.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Menú flotante */}
      <div
        ref={menuRef}
        className="absolute right-4 w-[220px] bg-gradient-to-b from-white via-[#4fdfbe] to-[#33bebc] rounded-2xl shadow-lg p-4 z-50
           top-[110px] sm:top-[85px] transition-all duration-300 ease-in-out"
      >
        <ul className="flex flex-col gap-2">
          <button
            onClick={() => setOpen(true)}
            className="w-full text-black bg-white/60 rounded-lg px-4 py-2 hover:bg-white shadow-sm text-sm font-medium"
          >
            Editar Horarios
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("user");
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("sessionExpiry");
              setUser(null);
              navigate("/login");
            }}
            className="w-full text-black bg-white/60 rounded-lg px-4 py-2 hover:bg-white shadow-sm text-sm font-medium"
          >
            Cerrar sesión
          </button>
        </ul>
      </div>

      {/* Modal para editar horarios */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="z-[999]">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 space-y-5">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-semibold">
                Editar Horarios
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              {puedeElegirProfesional ? (
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Profesional
                  </label>
                  <Select
                    value={selectedProfesionalId ?? undefined}
                    onValueChange={(v) => setSelectedProfesionalId(v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccioná un profesional" />
                    </SelectTrigger>
                    <SelectContent>
                      {profesionales.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name} (#{p.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  Editando horarios del profesional asignado a tu usuario.
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Franja horaria</span>
                <Button size="sm" variant="outline" onClick={addRow}>
                  + Agregar fila
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">Día</th>
                      <th className="p-2">Entrada</th>
                      <th className="p-2">Salida</th>
                      <th className="p-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td className="p-3 text-gray-500" colSpan={4}>
                          No hay horarios cargados.
                        </td>
                      </tr>
                    ) : (
                      rows.map((r, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2">
                            <Select
                              value={r.dia_semana}
                              onValueChange={(v) => updateRow(idx, { dia_semana: v })}
                            >
                              <SelectTrigger className="w-[160px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {DIAS.map((d) => (
                                  <SelectItem key={d} value={d}>
                                    {d}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-2">
                            <Input
                              type="time"
                              value={r.hora_entrada}
                              onChange={(e) =>
                                updateRow(idx, { hora_entrada: e.target.value })
                              }
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="time"
                              value={r.hora_salida}
                              onChange={(e) =>
                                updateRow(idx, { hora_salida: e.target.value })
                              }
                            />
                          </td>
                          <td className="p-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="bg-red-600 text-white"
                              onClick={() => removeRow(idx)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={saveRows}
                  disabled={loading || !selectedProfesionalId}
                  className="w-full bg-cyan-600 text-white rounded-full hover:bg-cyan-700"
                >
                  {loading ? "Guardando..." : "Guardar cambios"}
                </Button>

                <DialogClose asChild>
                  <Button variant="ghost" className="w-full text-gray-600 hover:bg-gray-100">
                    Cancelar
                  </Button>
                </DialogClose>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
