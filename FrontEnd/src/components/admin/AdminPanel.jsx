import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { useUser } from "@/context/UserContext";
import Swal from "sweetalert2";

export default function AdminPanel() {
  const { user } = useUser();

  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [usuarioEditado, setUsuarioEditado] = useState(null);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    nacimiento: "",
    telefono: "",
    direccion: "",
    role: "secretaria",
    matricula: "",
    especialidad: "",
    username: "",
    password: "",
  });

  const rolesDisponibles = ["secretaria", "profesional"];
  if (user?.role === "master") rolesDisponibles.push("admin");

  const puedeModificar = (targetRole) => {
    if (user?.role === "master") return targetRole !== "master";
    if (user?.role === "admin") return !["admin", "master"].includes(targetRole);
    return false;
  };

  // --- Reglas para eliminar ---
  const esMismoUsuario = (targetUser) => {
    if (!user) return false;
    // fallback por si el contexto no trae id
    return targetUser.id === user.id || targetUser.username === user.username;
  };

  const puedeEliminar = (targetUser) => {
    if (!user) return false;
    if (esMismoUsuario(targetUser)) return false; // nadie puede borrarse a sí mismo

    if (user.role === "master") {
      // master puede borrar admin y demás, NO masters
      return targetUser.role !== "master";
    }
    if (user.role === "admin") {
      // admin NO puede borrar admin ni master
      return !["admin", "master"].includes(targetUser.role);
    }
    return false;
  };
  // ----------------------------

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/usuarios");
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        Swal.fire({
          icon: "error",
          title: "Error al cargar usuarios",
          text: "No se pudieron obtener los usuarios.",
        });
      }
    };
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      if (!res.ok) throw new Error("Error al registrar usuario");

      const created = await res.json();
      setUsuarios((prev) => [...prev, created]);

      setNuevoUsuario({
        nombre: "",
        apellido: "",
        dni: "",
        nacimiento: "",
        telefono: "",
        direccion: "",
        role: "secretaria",
        matricula: "",
        especialidad: "",
        username: "",
        password: "",
      });

      Swal.fire({
        icon: "success",
        title: "Usuario creado",
        text: "El usuario se creó correctamente.",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        icon: "error",
        title: "No se pudo crear el usuario",
        text: err.message || "Intentá nuevamente.",
      });
    }
  };

  const comenzarEdicion = (usuario) => {
    setEditandoId(usuario.id);
    setUsuarioEditado({ ...usuario });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setUsuarioEditado(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUsuarioEditado((prev) => ({ ...prev, [name]: value }));
  };

  const guardarEdicion = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/auth/usuarios/${usuarioEditado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuarioEditado),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar usuario");

      const updated = await res.json();
      setUsuarios((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

      cancelarEdicion();

      Swal.fire({
        icon: "success",
        title: "Cambios guardados",
        text: "El usuario se actualizó correctamente.",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error al guardar edición:", err);
      Swal.fire({
        icon: "error",
        title: "No se pudo actualizar",
        text: err.message || "Intentá nuevamente.",
      });
    }
  };

  const handleDeleteUser = async (id, nombreParaMostrar) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      html: `Se eliminará <b>${nombreParaMostrar}</b>. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:4000/api/auth/usuarios/${id}`, {
        method: "DELETE",
         headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) throw new Error("Error al eliminar usuario");

      setUsuarios((prev) => prev.filter((u) => u.id !== id));

      Swal.fire({
        icon: "success",
        title: "Usuario eliminado",
        text: "El usuario fue eliminado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      Swal.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: err.message || "Intentá nuevamente.",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-semibold">Gestor de Usuarios</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>+ Nuevo Usuario</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Usuario</DialogTitle>
            </DialogHeader>

            <form className="grid gap-4 mt-4">
              <Input
                name="username"
                placeholder="Nombre de usuario"
                value={nuevoUsuario.username}
                onChange={handleChange}
              />
              <Input
                name="nombre"
                placeholder="Nombre"
                value={nuevoUsuario.nombre}
                onChange={handleChange}
              />
              <Input
                name="apellido"
                placeholder="Apellido"
                value={nuevoUsuario.apellido}
                onChange={handleChange}
              />
              <Input
                name="dni"
                placeholder="DNI"
                value={nuevoUsuario.dni}
                onChange={handleChange}
              />
              <Input
                name="nacimiento"
                type="date"
                value={nuevoUsuario.nacimiento}
                onChange={handleChange}
              />
              <Input
                name="telefono"
                placeholder="Teléfono"
                value={nuevoUsuario.telefono}
                onChange={handleChange}
              />
              <Input
                name="direccion"
                placeholder="Dirección"
                value={nuevoUsuario.direccion}
                onChange={handleChange}
              />
              <Input
                name="password"
                type="password"
                placeholder="Contraseña"
                value={nuevoUsuario.password}
                onChange={handleChange}
              />

              <Select
                value={nuevoUsuario.role}
                onValueChange={(role) =>
                  setNuevoUsuario((prev) => ({
                    ...prev,
                    role,
                    matricula: "",
                    especialidad: "",
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  {rolesDisponibles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {nuevoUsuario.role === "profesional" && (
                <>
                  <Input
                    name="matricula"
                    placeholder="Matrícula"
                    value={nuevoUsuario.matricula}
                    onChange={handleChange}
                  />
                  <Input
                    name="especialidad"
                    placeholder="Especialidad"
                    value={nuevoUsuario.especialidad}
                    onChange={handleChange}
                  />
                </>
              )}
            </form>

            <DialogClose asChild>
              <Button type="button" onClick={handleAddUser}>
                Guardar
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Usuario</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Especialidad</th>
              <th className="p-2">Matrícula</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const puede = puedeModificar(u.role);
              const enEdicion = editandoId === u.id;

              return (
                <tr key={u.id} className="border-t">
                  {enEdicion ? (
                    <>
                      <td className="p-2">
                        <Input
                          name="name"
                          value={usuarioEditado.name || ""}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          name="username"
                          value={usuarioEditado.username || ""}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="p-2 capitalize">{usuarioEditado.role}</td>
                      <td className="p-2">
                        <Input
                          name="especialidad"
                          value={usuarioEditado.especialidad || ""}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          name="matricula"
                          value={usuarioEditado.matricula || ""}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="p-2 flex gap-2">
                        <Button size="sm" onClick={guardarEdicion}>
                          Guardar
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelarEdicion}>
                          Cancelar
                        </Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.username}</td>
                      <td className="p-2 capitalize">{u.role}</td>
                      <td className="p-2">{u.especialidad || "-"}</td>
                      <td className="p-2">{u.matricula || "-"}</td>
                      <td className="p-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!puede}
                          onClick={() => comenzarEdicion(u)}
                        >
                          Editar
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-600 text-white"
                          disabled={!puedeEliminar(u)}
                          onClick={() => handleDeleteUser(u.id, u.name || u.username)}
                          title={
                            !puedeEliminar(u)
                              ? "No tenés permisos para eliminar este usuario"
                              : undefined
                          }
                        >
                          Eliminar
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
