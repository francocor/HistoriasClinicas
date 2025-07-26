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

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/usuarios");
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
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
    } catch (err) {
      console.error("Error:", err);
      alert("No se pudo crear el usuario");
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
      const res = await fetch(`http://localhost:4000/api/auth/usuarios/${usuarioEditado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioEditado),
      });

      if (!res.ok) throw new Error("Error al actualizar usuario");

      const updated = await res.json();
      setUsuarios((prev) =>
        prev.map((u) => (u.id === updated.id ? updated : u))
      );

      cancelarEdicion();
    } catch (err) {
      console.error("Error al guardar edición:", err);
      alert("No se pudo actualizar el usuario");
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
              <Input name="username" placeholder="Nombre de usuario" value={nuevoUsuario.username} onChange={handleChange} />
              <Input name="nombre" placeholder="Nombre" value={nuevoUsuario.nombre} onChange={handleChange} />
              <Input name="apellido" placeholder="Apellido" value={nuevoUsuario.apellido} onChange={handleChange} />
              <Input name="dni" placeholder="DNI" value={nuevoUsuario.dni} onChange={handleChange} />
              <Input name="nacimiento" type="date" value={nuevoUsuario.nacimiento} onChange={handleChange} />
              <Input name="telefono" placeholder="Teléfono" value={nuevoUsuario.telefono} onChange={handleChange} />
              <Input name="direccion" placeholder="Dirección" value={nuevoUsuario.direccion} onChange={handleChange} />
              <Input name="password" type="password" placeholder="Contraseña" value={nuevoUsuario.password} onChange={handleChange} />

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
                        <Input name="name" value={usuarioEditado.name} onChange={handleEditChange} />
                      </td>
                      <td className="p-2">
                        <Input name="username" value={usuarioEditado.username} onChange={handleEditChange} />
                      </td>
                      <td className="p-2 capitalize">{usuarioEditado.role}</td>
                      <td className="p-2">
                        <Input name="especialidad" value={usuarioEditado.especialidad || ""} onChange={handleEditChange} />
                      </td>
                      <td className="p-2">
                        <Input name="matricula" value={usuarioEditado.matricula || ""} onChange={handleEditChange} />
                      </td>
                      <td className="p-2 flex gap-2">
                        <Button size="sm" onClick={guardarEdicion}>Guardar</Button>
                        <Button size="sm" variant="outline" onClick={cancelarEdicion}>Cancelar</Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.username}</td>
                      <td className="p-2 capitalize">{u.role}</td>
                      <td className="p-2">{u.especialidad || "-"}</td>
                      <td className="p-2">{u.matricula || "-"}</td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!puede}
                          onClick={() => comenzarEdicion(u)}
                        >
                          Editar
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
