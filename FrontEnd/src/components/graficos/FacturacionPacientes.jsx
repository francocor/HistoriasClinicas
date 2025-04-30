import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function FacturacionPacientes({ role = "profesional", selectedDoctor = "pepito" }) {
  const [obraSocial, setObraSocial] = useState("");
  const [estado, setEstado] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [datos, setDatos] = useState([
    {
      fecha: "2024-05-15",
      paciente: "Juan Pérez",
      dni: "30123456",
      obraSocial: "OSDE",
      afiliado: "123456",
      practica: "Consulta clínica - Nomenclador 101010",
      copago: 1500,
      estado: "pendiente",
      profesional: "pepito",
    },
    {
      fecha: "2024-05-14",
      paciente: "Laura Gómez",
      dni: "30999888",
      obraSocial: "PAMI",
      afiliado: "445566",
      practica: "Consulta clínica - Nomenclador 101010",
      copago: 0,
      estado: "facturado",
      profesional: "pepito",
    },
    {
      fecha: "2024-05-10",
      paciente: "Carlos López",
      dni: "33112233",
      obraSocial: "Swiss Medical",
      afiliado: "998877",
      practica: "Control general - Nomenclador 202020",
      copago: 1200,
      estado: "pendiente",
      profesional: "juarez",
    },
  ]);

  const datosFiltrados = useMemo(() => {
    return datos.filter((item) => {
      const fechaOk =
        (!desde || item.fecha >= desde) &&
        (!hasta || item.fecha <= hasta);
      const obraOk = !obraSocial || item.obraSocial === obraSocial;
      const estadoOk = !estado || item.estado === estado;
      const profesionalOk =
        role === "secretaria" ? selectedDoctor === item.profesional : item.profesional === "pepito";

      return fechaOk && obraOk && estadoOk && profesionalOk;
    });
  }, [obraSocial, estado, desde, hasta, role, selectedDoctor, datos]);

  const actualizarEstado = (indexGlobal, nuevoEstado) => {
    setDatos((prev) => {
      const copia = [...prev];
      copia[indexGlobal].estado = nuevoEstado;
      return copia;
    });
  };

  const obtenerNombreArchivo = (ext) => {
    const fecha = new Date().toISOString().slice(0, 10);
    const nombreProfesional = role === "secretaria" ? selectedDoctor : "pepito";
    return `facturacion_${nombreProfesional}_${fecha}.${ext}`;
  };

  const exportarExcel = () => {
    const datosExport = datosFiltrados.map((item) => ({
      Fecha: item.fecha,
      Paciente: item.paciente,
      DNI: item.dni,
      "Obra Social": item.obraSocial,
      "N° Afiliado": item.afiliado,
      Práctica: item.practica,
      Copago: item.copago,
      Estado: item.estado,
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
      head: [[
        "Fecha", "Paciente", "DNI", "Obra Social", "Afiliado", "Práctica", "Copago", "Estado"
      ]],
      body: datosFiltrados.map((item) => [
        item.fecha,
        item.paciente,
        item.dni,
        item.obraSocial,
        item.afiliado,
        item.practica,
        `$${item.copago}`,
        item.estado,
      ]),
    });

    doc.save(obtenerNombreArchivo("pdf"));
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Tabla de Facturación Pacientes</h2>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Select onValueChange={setObraSocial}>
          <SelectTrigger className="border border-black h-[40px]">
            <SelectValue placeholder="Obra Social" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="OSDE">OSDE</SelectItem>
            <SelectItem value="PAMI">PAMI</SelectItem>
            <SelectItem value="Swiss Medical">Swiss Medical</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setEstado}>
          <SelectTrigger className="border border-black h-[40px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="facturado">Facturado</SelectItem>
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
              <th className="px-4 py-2">Paciente</th>
              <th className="px-4 py-2">DNI</th>
              <th className="px-4 py-2">Obra Social</th>
              <th className="px-4 py-2">Afiliado</th>
              <th className="px-4 py-2">Práctica</th>
              <th className="px-4 py-2">Copago</th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((item, idx) => {
              const indexGlobal = datos.findIndex(
                (d) => d.dni === item.dni && d.fecha === item.fecha
              );
              return (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{item.fecha}</td>
                  <td className="px-4 py-2">{item.paciente}</td>
                  <td className="px-4 py-2">{item.dni}</td>
                  <td className="px-4 py-2">{item.obraSocial}</td>
                  <td className="px-4 py-2">{item.afiliado}</td>
                  <td className="px-4 py-2">{item.practica}</td>
                  <td className="px-4 py-2">${item.copago}</td>
                  <td className="px-4 py-2">
                    <Select
                      value={item.estado}
                      onValueChange={(value) => actualizarEstado(indexGlobal, value)}
                    >
                      <SelectTrigger className="h-[28px] border border-black text-xs bg-white rounded-md w-full max-w-[140px]">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="facturado">Facturado</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="flex justify-between mt-4 font-medium text-black">
        <p>Total pacientes: {datosFiltrados.length}</p>
        <p>
          Total copagos: $
          {datosFiltrados.reduce((acc, item) => acc + item.copago, 0)}
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
    </div>
  );
}