import React, { useState } from "react";
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
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    nacimiento: "",
    telefono: "",
    direccion: "",
    rol: "secretaria",
    matricula: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
    const id = usuarios.length + 1;
    const nuevo = { id, ...nuevoUsuario };
    setUsuarios((prev) => [...prev, nuevo]);

    // Limpiar formulario
    setNuevoUsuario({
      nombre: "",
      apellido: "",
      dni: "",
      nacimiento: "",
      telefono: "",
      direccion: "",
      rol: "secretaria",
      matricula: "",
      username: "",
      password: "",
    });
  };

  const handleEditChange = (id, field, value) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  const handleDelete = (id) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const cancelarEdicion = () => setEditandoId(null);

  const rolesDisponibles = ["secretaria", "profesional"];
  if (user?.role === "master") rolesDisponibles.push("admin");

  const puedeModificar = (targetRole) => {
    if (user?.role === "master") return targetRole !== "master";
    if (user?.role === "admin") return !["admin", "master"].includes(targetRole);
    return false;
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
              <Input name="nombre" placeholder="Nombre" value={nuevoUsuario.nombre} onChange={handleChange} />
              <Input name="apellido" placeholder="Apellido" value={nuevoUsuario.apellido} onChange={handleChange} />
              <Input name="dni" placeholder="DNI" value={nuevoUsuario.dni} onChange={handleChange} />
              <Input name="nacimiento" type="date" value={nuevoUsuario.nacimiento} onChange={handleChange} />
              <Input name="telefono" placeholder="Teléfono" value={nuevoUsuario.telefono} onChange={handleChange} />
              <Input name="direccion" placeholder="Dirección" value={nuevoUsuario.direccion} onChange={handleChange} />
              <Input name="username" placeholder="Nombre de usuario" value={nuevoUsuario.username} onChange={handleChange} />
              <Input name="password" type="password" placeholder="Contraseña" value={nuevoUsuario.password} onChange={handleChange} />

              <Select value={nuevoUsuario.rol} onValueChange={(rol) => setNuevoUsuario((prev) => ({ ...prev, rol }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  {rolesDisponibles.map((rol) => (
                    <SelectItem key={rol} value={rol}>
                      {rol.charAt(0).toUpperCase() + rol.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Mostrar campo Matrícula para profesional y admin */}
              {["profesional", "admin"].includes(nuevoUsuario.rol) && (
                <Input
                  name="matricula"
                  placeholder="Matrícula (opcional para Admin)"
                  value={nuevoUsuario.matricula}
                  onChange={handleChange}
                />
              )}

              <DialogClose asChild>
                <Button type="button" onClick={handleAddUser}>Guardar</Button>
              </DialogClose>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Apellido</th>
              <th className="p-2">DNI</th>
              <th className="p-2">Nacimiento</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2">Dirección</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Matrícula</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const puede = puedeModificar(u.rol);
              return (
                <tr key={u.id} className="border-t">
                  {editandoId === u.id ? (
                    <>
                      <td className="p-2"><Input value={u.nombre} onChange={(e) => handleEditChange(u.id, "nombre", e.target.value)} /></td>
                      <td className="p-2"><Input value={u.apellido} onChange={(e) => handleEditChange(u.id, "apellido", e.target.value)} /></td>
                      <td className="p-2"><Input value={u.dni} onChange={(e) => handleEditChange(u.id, "dni", e.target.value)} /></td>
                      <td className="p-2"><Input type="date" value={u.nacimiento} onChange={(e) => handleEditChange(u.id, "nacimiento", e.target.value)} /></td>
                      <td className="p-2"><Input value={u.telefono} onChange={(e) => handleEditChange(u.id, "telefono", e.target.value)} /></td>
                      <td className="p-2"><Input value={u.direccion} onChange={(e) => handleEditChange(u.id, "direccion", e.target.value)} /></td>
                      <td className="p-2 capitalize">{u.rol}</td>
                      <td className="p-2">
                        {["profesional", "admin"].includes(u.rol) ? (
                          <Input value={u.matricula || ""} onChange={(e) => handleEditChange(u.id, "matricula", e.target.value)} />
                        ) : "-"}
                      </td>
                      <td className="p-2 flex gap-2">
                        <Button onClick={cancelarEdicion} variant="outline" size="sm">Cancelar</Button>
                        <Button onClick={() => setEditandoId(null)} size="sm" disabled={!puede}>Guardar</Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2">{u.nombre}</td>
                      <td className="p-2">{u.apellido}</td>
                      <td className="p-2">{u.dni}</td>
                      <td className="p-2">{u.nacimiento}</td>
                      <td className="p-2">{u.telefono}</td>
                      <td className="p-2">{u.direccion}</td>
                      <td className="p-2 capitalize">{u.rol}</td>
                      <td className="p-2">
                        {["profesional", "admin"].includes(u.rol) ? u.matricula || "-" : "-"}
                      </td>
                      <td className="p-2 flex gap-2">
                        <Button onClick={() => setEditandoId(u.id)} variant="outline" size="sm" disabled={!puede}>Editar</Button>
                        <Button onClick={() => handleDelete(u.id)} variant="destructive" size="sm" disabled={!puede}>Eliminar</Button>
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
