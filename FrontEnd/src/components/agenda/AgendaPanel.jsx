import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AgendaPanel({ visible, onClose, turnos, doctor }) {
  if (!visible) return null;

  return (
    <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 border-l border-gray-300">
      <div className="p-6 flex flex-col h-full">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Agenda de {doctor}</h2>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-black"
          >
            Cerrar
          </button>
        </div>

        {/* Contenido */}
        {turnos.length === 0 ? (
          <p className="text-gray-500">No hay turnos programados.</p>
        ) : (
          <div className="space-y-4 overflow-y-auto flex-1">
            {turnos.map((t) => (
              <Card key={t.id} className="border border-black rounded-xl">
                <CardContent className="p-3 space-y-1">
                  <p><strong>Paciente:</strong> {t.patientName}</p>
                  <p><strong>Fecha:</strong> {t.appointmentDate}</p>
                  <p><strong>Profesional:</strong> {t.doctor}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}