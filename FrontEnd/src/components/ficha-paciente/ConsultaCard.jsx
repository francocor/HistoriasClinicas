import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Upload } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ConsultaCard({
  date,
  reason,
  doctor,
  diagnostico,
  sintomas,
  parametros,
  tratamiento,
  medicamentos,
}) {
  const fileInputRef = useRef(null);
  const [archivo, setArchivo] = useState(null);
  const cardRef = useRef(null);

  const handleArchivoSeleccionado = (event) => {
    const file = event.target.files[0];
    if (file) setArchivo(file);
  };

  const handleDescargarArchivo = () => {
    if (archivo) {
      const url = URL.createObjectURL(archivo);
      const link = document.createElement("a");
      link.href = url;
      link.download = archivo.name;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDescargarConsulta = async () => {
    const element = cardRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`consulta-${date.replace(/\//g, "-")}.pdf`);
  };

  return (
    <Card
      ref={cardRef}
      className="rounded-[20px] border border-black bg-white w-full"
    >
      <CardContent className="p-4 space-y-4">
        {/* Fecha y botón Ver */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span className="text-xl sm:text-2xl font-sans">{date}</span>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full h-[39px] px-6 bg-white text-black shadow hover:bg-gray-100">
                Ver
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[90vw] sm:w-[600px] max-h-[85vh] overflow-y-auto bg-white z-[9999] rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Detalle de la Consulta</DialogTitle>
              </DialogHeader>

              <div className="space-y-2 text-base sm:text-lg">
                <p><strong>Fecha:</strong> {date}</p>
                <p><strong>Médico:</strong> {doctor}</p>
                <p><strong>Motivo:</strong> {reason}</p>
                {sintomas && <p><strong>Síntomas:</strong> {sintomas}</p>}
                {parametros && <p><strong>Parámetros:</strong> {parametros}</p>}
                {diagnostico && <p><strong>Diagnóstico:</strong> {diagnostico}</p>}
                {tratamiento && <p><strong>Tratamiento:</strong> {tratamiento}</p>}
                {medicamentos && <p><strong>Medicamentos:</strong> {medicamentos}</p>}
              </div>

              <DialogClose asChild>
                <Button variant="ghost" className="mt-4 w-full text-gray-600">
                  Cerrar
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>

        {/* Motivo breve y documentos */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="text-lg sm:text-2xl font-sans">{reason}</p>
            <p className="text-lg sm:text-2xl font-sans mt-1">{doctor}</p>
          </div>

          <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
            {/* Modal de documentos */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-full px-4 bg-white text-black shadow hover:bg-gray-100 w-full sm:w-auto">
                  📁 Documentos
                </Button>
              </DialogTrigger>

              <DialogContent className="w-[90vw] sm:w-[480px] max-h-[85vh] overflow-y-auto bg-white rounded-lg shadow-lg z-[9999]">
                <DialogHeader>
                  <DialogTitle>Gestión de Documentos</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {archivo ? (
                    <div className="text-sm text-gray-700">
                      <p className="font-medium">Documento actual:</p>
                      <p className="truncate">{archivo.name}</p>
                      <Button
                        onClick={handleDescargarArchivo}
                        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white w-full"
                      >
                        <Download className="mr-2 w-4 h-4" /> Descargar
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No hay documento cargado.
                    </p>
                  )}

                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleArchivoSeleccionado}
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full flex items-center gap-2 justify-center"
                  >
                    <Upload className="w-4 h-4" />
                    Cargar nuevo documento
                  </Button>
                </div>

                <DialogClose asChild>
                  <Button variant="ghost" className="mt-4 w-full text-gray-600">
                    Cerrar
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>

            {/* Descargar consulta */}
            <Button
              onClick={handleDescargarConsulta}
              className="rounded-full px-4 text-sm bg-green-500 text-white shadow hover:bg-green-600 w-full sm:w-auto"
            >
              Descargar consulta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
