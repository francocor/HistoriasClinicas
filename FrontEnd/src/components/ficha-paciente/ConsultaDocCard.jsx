import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import jsPDF from "jspdf";

export default function ConsultaCard({
  date,
  reason,            // se usa como nombre del pdf
  doctor,
  tipo_archivo,      // "application/pdf" | "image/png" | "image/jpeg"
  archivo,           // Blob/File | {type:"Buffer", data:[...]} | Uint8Array | ArrayBuffer | dataURL | URL | base64
  nombre_archivo,    // opcional
}) {
  const cardRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewMime, setPreviewMime] = useState(null);
  const [sourceBlob, setSourceBlob] = useState(null); // si logramos construir un Blob, lo guardamos
  const [objectUrl, setObjectUrl] = useState(null);   // para revocar

  const sanitizeFileName = (s) =>
    String(s || "documento")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s.-]/g, "")
      .trim()
      .replace(/\s+/g, "_");

  const isDataUrl = (s) => typeof s === "string" && s.startsWith("data:");
  const isLikelyUrl = (s) => typeof s === "string" && (/^https?:\/\//i.test(s) || s.startsWith("/"));
  const isBase64Raw = (s) =>
    typeof s === "string" &&
    !isDataUrl(s) &&
    !isLikelyUrl(s) &&
    /^[A-Za-z0-9+/=\s]+$/.test(s);

  const extToMime = (name = "") => {
    const ext = name.toLowerCase().split(".").pop();
    switch (ext) {
      case "pdf": return "application/pdf";
      case "png": return "image/png";
      case "jpg":
      case "jpeg": return "image/jpeg";
      case "webp": return "image/webp";
      default: return null;
    }
  };

  const isPdfMime = (m, url) => {
    if (!m && url) return /\.pdf(\?|$)/i.test(url);
    return typeof m === "string" && m.toLowerCase().includes("pdf");
  };
  const isImageMime = (m, url) => {
    if (!m && url) return /\.(png|jpe?g|webp)(\?|$)/i.test(url);
    return typeof m === "string" && m.toLowerCase().startsWith("image/");
  };

  // Construir previewUrl + previewMime + sourceBlob en todos los casos
  useEffect(() => {
    // limpiar objectURL anterior
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
    setPreviewUrl(null);
    setPreviewMime(null);
    setSourceBlob(null);

    const fallbackMime = tipo_archivo || extToMime(nombre_archivo) || "application/octet-stream";

    // Sin archivo
    if (!archivo) {
      setPreviewUrl(null);
      setPreviewMime(fallbackMime);
      return;
    }

    // 1) Si ya es Blob/File
    if (archivo instanceof Blob) {
      const url = URL.createObjectURL(archivo);
      setObjectUrl(url);
      setPreviewUrl(url);
      setPreviewMime(archivo.type || fallbackMime);
      setSourceBlob(archivo);
      return;
    }

    // 2) ArrayBuffer
    if (archivo instanceof ArrayBuffer) {
      const blob = new Blob([archivo], { type: fallbackMime });
      const url = URL.createObjectURL(blob);
      setObjectUrl(url);
      setPreviewUrl(url);
      setPreviewMime(blob.type || fallbackMime);
      setSourceBlob(blob);
      return;
    }

    // 3) TypedArray (Uint8Array, etc.)
    if (ArrayBuffer.isView(archivo)) {
      const blob = new Blob([archivo], { type: fallbackMime });
      const url = URL.createObjectURL(blob);
      setObjectUrl(url);
      setPreviewUrl(url);
      setPreviewMime(blob.type || fallbackMime);
      setSourceBlob(blob);
      return;
    }

    // 4) Node Buffer serializado: { type: "Buffer", data: [...] }
    if (archivo && typeof archivo === "object" && archivo.type === "Buffer" && Array.isArray(archivo.data)) {
      const uint8 = Uint8Array.from(archivo.data);
      const blob = new Blob([uint8], { type: fallbackMime });
      const url = URL.createObjectURL(blob);
      setObjectUrl(url);
      setPreviewUrl(url);
      setPreviewMime(blob.type || fallbackMime);
      setSourceBlob(blob);
      return;
    }

    // 5) dataURL
    if (isDataUrl(archivo)) {
      const match = /^data:([^;]+);/i.exec(archivo);
      const mime = match?.[1] || fallbackMime;
      setPreviewUrl(archivo);
      setPreviewMime(mime);
      setSourceBlob(null); // podemos reconstruir desde dataURL si hace falta
      return;
    }

    // 6) URL
    if (isLikelyUrl(archivo)) {
      setPreviewUrl(archivo);
      setPreviewMime(tipo_archivo || extToMime(nombre_archivo));
      setSourceBlob(null); // lo podemos descargar si hace falta
      return;
    }

    // 7) Base64 crudo
    if (isBase64Raw(archivo)) {
      const mime = tipo_archivo || extToMime(nombre_archivo) || "application/pdf";
      setPreviewUrl(`data:${mime};base64,${archivo}`);
      setPreviewMime(mime);
      setSourceBlob(null);
      return;
    }

    // 8) Cualquier otro caso
    setPreviewUrl(null);
    setPreviewMime(fallbackMime);
  }, [archivo, tipo_archivo, nombre_archivo]); // eslint-disable-line react-hooks/exhaustive-deps

  const nombrePdf = `${sanitizeFileName(reason || nombre_archivo || "documento")}.pdf`;
  const mostrarPdf = isPdfMime(previewMime, previewUrl);
  const mostrarImagen = isImageMime(previewMime, previewUrl);

  const downloadBlob = (blob, filename) => {
    const dlUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = dlUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(dlUrl);
  };

  // Descargar siempre como PDF con el nombre del diagnóstico
  const handleDescargarComoPdf = async () => {
    try {
      // Si ya tenemos el PDF (o el preview es un PDF), descargamos directo
      if (mostrarPdf) {
        if (sourceBlob) {
          // tenemos el binario en memoria
          downloadBlob(sourceBlob, nombrePdf);
          return;
        }
        // convertir dataURL/URL en blob
        const res = await fetch(previewUrl, { credentials: "include" });
        const blob = await res.blob();
        downloadBlob(blob, nombrePdf);
        return;
      }

      // Si es imagen, la envolvemos en PDF con jsPDF
      if (mostrarImagen) {
        const loadImage = (src) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
          });

        const img = await loadImage(previewUrl);
        const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const margin = 24;
        const maxW = pageW - margin * 2;
        const maxH = pageH - margin * 2;
        const ratio = Math.min(maxW / img.width, maxH / img.height);
        const drawW = img.width * ratio;
        const drawH = img.height * ratio;
        const x = (pageW - drawW) / 2;
        const y = (pageH - drawH) / 2;
        pdf.addImage(img, undefined, x, y, drawW, drawH);
        pdf.save(nombrePdf);
        return;
      }

      alert("Este tipo de documento no se puede convertir a PDF en el navegador.");
    } catch (err) {
      console.error("Error al descargar PDF:", err);
      alert("No se pudo descargar el documento.");
    }
  };

  return (
    <Card ref={cardRef} className="rounded-[20px] border border-black bg-white w-full">
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

            <DialogContent className="w-[90vw] sm:w-[600px] max-h-[100vh] overflow-y-auto bg-white z-[9999] rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Detalle de la Consulta</DialogTitle>
              </DialogHeader>

              <div className="space-y-2 text-base sm:text-lg">
                <p><strong>Fecha:</strong> {date}</p>
                <p><strong>Médico:</strong> {doctor}</p>
                <p><strong>Motivo/Diagnóstico:</strong> {reason}</p>
                {nombre_archivo && <p className="truncate"><strong>Documento:</strong> {nombre_archivo}</p>}
                {previewMime && <p><strong>Tipo:</strong> {previewMime}</p>}
              </div>

              <DialogClose asChild>
                <Button variant="ghost" className="mt-4 w-full text-gray-600">
                  Cerrar
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>

        {/* Motivo + documentos */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="text-lg sm:text-2xl font-sans">{reason}</p>
            <p className="text-lg sm:text-2xl font-sans mt-1">{doctor}</p>
          </div>

          <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-full px-4 bg-white text-black shadow hover:bg-gray-100 w-full sm:w-auto">
                  📁 Documentos
                </Button>
              </DialogTrigger>

              <DialogContent className="w-[92vw] sm:w-[800px] max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg z-[9999]">
                <DialogHeader>
                  <DialogTitle>Documento del Paciente</DialogTitle>
                </DialogHeader>

                {/* Info */}
                <div className="text-sm text-gray-700 mb-2">
                  {nombre_archivo && <p className="truncate"><strong>Archivo:</strong> {nombre_archivo}</p>}
                  {previewMime && <p><strong>Tipo:</strong> {previewMime}</p>}
                </div>

                {/* Vista previa */}
                {previewUrl ? (
                  <div className="border rounded-lg overflow-hidden" style={{ height: "70vh" }}>
                    {isPdfMime(previewMime, previewUrl) ? (
                      <iframe src={previewUrl} title="Vista previa PDF" className="w-full h-full" />
                    ) : isImageMime(previewMime, previewUrl) ? (
                      <img src={previewUrl} alt={nombre_archivo || "Documento"} className="w-full h-full object-contain bg-gray-50" />
                    ) : (
                      <div className="p-4 text-center text-gray-600">
                        No se puede previsualizar este tipo de archivo en el navegador.
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No hay documento cargado.</p>
                )}

                {/* Acciones */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleDescargarComoPdf}
                    className="w-full sm:w-auto rounded-full bg-black text-white hover:bg-black/90"
                    disabled={!previewUrl}
                    title={!previewUrl ? "No hay documento para descargar" : undefined}
                  >
                    <Download className="mr-2 w-4 h-4" />
                    Descargar PDF ({sanitizeFileName(reason || "documento")}.pdf)
                  </Button>

                  <DialogClose asChild>
                    <Button variant="ghost" className="w-full sm:w-auto text-gray-700">
                      Cerrar
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
