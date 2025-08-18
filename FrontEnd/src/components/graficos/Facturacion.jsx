import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Facturacion() {
  const { user } = useUser();
  const role = user?.role;

  // --- doctores ---
  const [doctores, setDoctores] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [loadingDoctores, setLoadingDoctores] = useState(false);
  const [errorDoctores, setErrorDoctores] = useState("");

  // Visibilidad del selector: los profesionales NO pueden elegir otros doctores
  const mostrarSelect =
    role === "secretaria" || role === "admin" || role === "master";

  // --- filtros tabla ---
  const [obraSocial, setObraSocial] = useState("");

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  // Obras sociales dinámicas
  const [obras, setObras] = useState([]);
const ALL = "__ALL__"; // cualquier string NO vacío
const [estado, setEstado] = useState(ALL);
  // --- datos facturación ---
  const [datos, setDatos] = useState([]);
  const [loadingDatos, setLoadingDatos] = useState(false);
  const [errorDatos, setErrorDatos] = useState("");

  // id del profesional actual (si corresponde). Intentamos varias fuentes por compatibilidad
  const myProfesionalId = useMemo(() => {
    if (role !== "profesional") return null;
    const explicitProfesionalId =
      user?.profesional_id ?? user?.profesionalId ?? null;
    return explicitProfesionalId ? String(explicitProfesionalId) : null;
  }, [role, user]);

  // Si el rol cambia a profesional, limpiamos cualquier doctor seleccionado por si acaso
  useEffect(() => {
    if (role === "profesional" && selectedDoctor) setSelectedDoctor("");
  }, [role, selectedDoctor]);

  // Cargar doctores (no se usa para profesionales, pero lo dejamos para otros roles)
  useEffect(() => {
    if (!mostrarSelect) return; // no cargar si no se mostrará

    const ac = new AbortController();
    (async () => {
      try {
        setLoadingDoctores(true);
        setErrorDoctores("");
        const res = await fetch("http://localhost:4000/api/profesionales", {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setDoctores(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err?.name !== "AbortError") {
          console.error("Error al obtener los profesionales:", err);
          setErrorDoctores("No se pudieron cargar los médicos.");
        }
      } finally {
        setLoadingDoctores(false);
      }
    })();
    return () => ac.abort();
  }, [mostrarSelect]);

  // Carga de listado maestro de Obras Sociales
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/api/turnos/obras-sociales"
        );
        if (res.ok) {
          const list = await res.json();
          if (!aborted)
            setObras(Array.isArray(list) ? list.filter(Boolean) : []);
        }
      } catch (_) {}
    })();
    return () => {
      aborted = true;
    };
  }, []);

  // Carga de datos de facturación
  useEffect(() => {
    const ac = new AbortController();

    async function fetchData() {
      try {
        setLoadingDatos(true);
        setErrorDatos("");

        const params = new URLSearchParams();
        if (role) params.set("role", role);

        if (role === "profesional") {
          // Para profesionales, forzamos sus propios datos. No permitimos sobreescritura por selectedDoctor
          const sessionUserId =
            user?.id ??
            sessionStorage.getItem("user_id") ??
            JSON.parse(sessionStorage.getItem("user") || "{}")?.id ??
            "";
          if (sessionUserId) params.set("user_id", String(sessionUserId));
        } else if (selectedDoctor) {
          // Para otros roles, se puede filtrar por doctor
          params.set("profesional_id", selectedDoctor);
        }

        if (desde) params.set("desde", desde);
        if (hasta) params.set("hasta", hasta);

        const url = `http://localhost:4000/api/facturacion${
          params.toString() ? `?${params.toString()}` : ""
        }`;

        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setDatos(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e?.name !== "AbortError") {
          console.error(e);
          setErrorDatos("No se pudieron obtener los datos de facturación.");
        }
      } finally {
        setLoadingDatos(false);
      }
    }

    fetchData();
    return () => ac.abort();
  }, [role, selectedDoctor, desde, hasta, user]);

  // fallback obras sociales
  useEffect(() => {
    if (obras.length === 0 && datos?.length) {
      const uniq = Array.from(
        new Set(
          datos
            .map((d) => d?.obraSocial)
            .filter(
              (v) => v !== null && v !== undefined && String(v).trim() !== ""
            )
        )
      );
      if (uniq.length) setObras(uniq);
    }
  }, [datos, obras.length]);

  // Filtro adicional en frontend
  const datosFiltrados = useMemo(() => {
    return datos.filter((item) => {
      const itemDate = item.fecha ? String(item.fecha).slice(0, 10) : "";
      const fechaOk =
        (!desde || itemDate >= desde) && (!hasta || itemDate <= hasta);
      const obraOk = !obraSocial || (item.obraSocial ?? "") === obraSocial;
      const estadoOk = estado === ALL || item.estado === estado;

      const itemProfesionalId = String(
        item.doctor_id ??
          item.profesional_id ??
          item.profesionalId ??
          item.profesional?.id ??
          ""
      );

      const doctorOk =
        role === "profesional"
          ? true // el backend ya te trae SOLO los turnos del profesional; no hace falta refiltrar
          : !selectedDoctor || itemProfesionalId === String(selectedDoctor);

      return fechaOk && obraOk && estadoOk && doctorOk;
    });
  }, [
    datos,
    desde,
    hasta,
    obraSocial,
    estado,
    selectedDoctor,
    role,
    myProfesionalId,
  ]);

  const obtenerNombreArchivo = (ext) => {
    const fechaStr = new Date().toISOString().slice(0, 10);
    const etiquetaProfesional = mostrarSelect
      ? selectedDoctor || "todos"
      : "mios";
    return `facturacion_${etiquetaProfesional}_${fechaStr}.${ext}`;
  };

  const exportarExcel = () => {
    const datosExport = datosFiltrados.map((item) => ({
      Fecha: item.fecha,
      Paciente: item.paciente,
      DNI: item.dni,
      "Obra Social": item.obraSocial ?? "",
      Práctica: item.practica ?? "",
      Cobro: Number(item.cobro ?? 0),
      Estado: item.estado,
      Profesional: item.profesional,
    }));

    const hoja = XLSX.utils.json_to_sheet(datosExport);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Facturación");
    const buffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const archivo = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(archivo, obtenerNombreArchivo("xlsx"));
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Tabla de Facturación Pacientes", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Fecha",
          "Profesional",
          "Paciente",
          "DNI",
          "Obra Social",
          "Práctica",
          "Cobro",
          "Estado",
        ],
      ],
      body: datosFiltrados.map((item) => [
        item.fecha,
        item.profesional,
        item.paciente,
        item.dni,
        item.obraSocial ?? "",
        item.practica ?? "",
        `$${Number(item.cobro ?? 0).toFixed(2)}`,
        item.estado,
      ]),
    });

    doc.save(obtenerNombreArchivo("pdf"));
  };

  return (
    <main className="flex-1 px-4 py-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Facturación</h1>

      {mostrarSelect && (
        <div className="mb-6 max-w-sm mx-auto">
          <label className="text-base font-medium block mb-2">
            Seleccionar médico:
          </label>
          <Select
            onValueChange={setSelectedDoctor}
            disabled={
              loadingDoctores || !!errorDoctores || doctores.length === 0
            }
            value={selectedDoctor || undefined}
          >
            <SelectTrigger className="w-full border border-black rounded-md h-[40px] bg-white">
              <SelectValue
                placeholder={
                  loadingDoctores
                    ? "Cargando médicos..."
                    : errorDoctores
                    ? "Error al cargar"
                    : "Elegir médico"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {doctores.map((p) => (
                <SelectItem
                  key={p.profesional_id}
                  value={String(p.profesional_id)}
                >
                  {p.name} {" - "} {p.especialidad}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errorDoctores && (
            <p className="text-sm text-red-600 mt-2">{errorDoctores}</p>
          )}
        </div>
      )}

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-10">
        <Select onValueChange={setObraSocial} value={obraSocial}>
          <SelectTrigger className="border border-black h-[40px]">
            <SelectValue placeholder="Obra Social" />
          </SelectTrigger>
          <SelectContent>
            {obras.length === 0 ? (
              <div className="px-3 py-2 text-sm opacity-70">
                Sin obras sociales
              </div>
            ) : (
              obras.map((os) => (
                <SelectItem key={String(os)} value={String(os)}>
                  {String(os)}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Select onValueChange={setEstado} value={estado}>
          <SelectTrigger className="border border-black h-[40px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="proximo">Próximo</SelectItem>
            <SelectItem value="facturado">Facturado</SelectItem>
            <SelectItem value="perdido">Perdido</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="border border-black h-[40px]"
          />
          <Input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="border border-black h-[40px]"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-auto border border-black rounded-lg">
        <table className="min-w-full text-sm text-left text-black">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Profesional</th>
              <th className="px-4 py-2">Paciente</th>
              <th className="px-4 py-2">DNI</th>
              <th className="px-4 py-2">Obra Social</th>
              <th className="px-4 py-2">Práctica</th>
              <th className="px-4 py-2">Cobro</th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {loadingDatos && (
              <tr>
                <td className="px-4 py-4" colSpan={8}>
                  Cargando...
                </td>
              </tr>
            )}
            {!loadingDatos && errorDatos && (
              <tr>
                <td className="px-4 py-4 text-red-600" colSpan={8}>
                  {errorDatos}
                </td>
              </tr>
            )}
            {!loadingDatos && !errorDatos && datosFiltrados.length === 0 && (
              <tr>
                <td className="px-4 py-4" colSpan={8}>
                  Sin resultados
                </td>
              </tr>
            )}
            {!loadingDatos &&
              !errorDatos &&
              datosFiltrados.map((item) => (
                <tr
                  key={
                    item.turno_id ??
                    `${item.fecha}-${item.dni}-${item.practica}`
                  }
                  className="border-t"
                >
                  <td className="px-4 py-2">{item.fecha}</td>
                  <td className="px-4 py-2">{item.profesional}</td>
                  <td className="px-4 py-2">{item.paciente}</td>
                  <td className="px-4 py-2">{item.dni}</td>
                  <td className="px-4 py-2">{item.obraSocial ?? ""}</td>
                  <td className="px-4 py-2">{item.practica ?? ""}</td>
                  <td className="px-4 py-2">
                    ${Number(item.cobro ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 capitalize">{item.estado}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="flex justify-between mt-4 font-medium text-black">
        <p>Total turnos: {datosFiltrados.length}</p>
        <p>
          Total Cobros: $
          {datosFiltrados
            .reduce((acc, item) => acc + Number(item.cobro ?? 0), 0)
            .toFixed(2)}
        </p>
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
        <button
          className="px-6 py-2 bg-gradient-to-b from-[#179cba] to-white text-black border border-black rounded-[40px] shadow hover:opacity-80 transition"
          onClick={exportarExcel}
        >
          Exportar a Excel
        </button>
        <button
          className="px-6 py-2 bg-gradient-to-b from-[#179cba] to-white text-black border border-black rounded-[40px] shadow hover:opacity-80 transition"
          onClick={exportarPDF}
        >
          Exportar a PDF
        </button>
      </div>
    </main>
  );
}
