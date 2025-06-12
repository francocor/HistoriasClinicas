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

const usuariosSimulados = [
  {
    id: 1,
    nombre: "María",
    apellido: "López",
    dni: "30222444",
    nacimiento: "1990-01-01",
    telefono: "123456789",
    direccion: "Calle Falsa 123",
    rol: "secretaria",
    matricula: null,
  },
  {
    id: 2,
    nombre: "Juan",
    apellido: "Pérez",
    dni: "30111222",
    nacimiento: "1985-05-10",
    telefono: "987654321",
    direccion: "Av. Siempre Viva 742",
    rol: "profesional",
    matricula: "MP123456",
  },
];

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState(usuariosSimulados);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    nacimiento: "",
    telefono: "",
    direccion: "",
    rol: "secretaria",
    matricula: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
    const id = usuarios.length + 1;
    const nuevo = { id, ...nuevoUsuario };
    setUsuarios((prev) => [...prev, nuevo]);
    setNuevoUsuario({
      nombre: "",
      apellido: "",
      dni: "",
      nacimiento: "",
      telefono: "",
      direccion: "",
      rol: "secretaria",
      matricula: "",
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
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
              <Select value={nuevoUsuario.rol} onValueChange={(rol) => setNuevoUsuario((prev) => ({ ...prev, rol }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="secretaria">Secretaria</SelectItem>
                  <SelectItem value="profesional">Profesional</SelectItem>
                </SelectContent>
              </Select>
              {nuevoUsuario.rol === "profesional" && (
                <Input name="matricula" placeholder="Matrícula" value={nuevoUsuario.matricula} onChange={handleChange} />
              )}
              <DialogClose asChild>
                <Button type="button" onClick={handleAddUser}>Guardar</Button>
              </DialogClose>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full border text-left text-sm">
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
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.nombre}</td>
                <td className="p-2">{u.apellido}</td>
                <td className="p-2">{u.dni}</td>
                <td className="p-2">{u.nacimiento}</td>
                <td className="p-2">{u.telefono}</td>
                <td className="p-2">{u.direccion}</td>
                <td className="p-2 capitalize">{u.rol}</td>
                <td className="p-2">{u.rol === "profesional" ? u.matricula : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}