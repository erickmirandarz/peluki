"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { EstadoTurno, MetodoPago, TurnoConfirmado } from "@/types";

import { DetalleTurno, type VistaMiTurno } from "./DetalleTurno";

interface Props {
  token: string;
  turno: TurnoConfirmado | null;
  estadoTurno: EstadoTurno | null;
  metodoPago: MetodoPago | null;
  calendarUrl: string | null;
  puedeCancelar: boolean;
}

export function FlujoMiTurno({
  token,
  turno,
  estadoTurno: estadoInicial,
  metodoPago,
  calendarUrl,
  puedeCancelar: puedeCancelarInicial,
}: Props) {
  const router = useRouter();
  const [estadoTurno, setEstadoTurno] = useState(estadoInicial);
  const [puedeCancelar, setPuedeCancelar] = useState(puedeCancelarInicial);
  const [pidiendoConfirmacion, setPidiendoConfirmacion] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [vista, setVista] = useState<VistaMiTurno>(() => {
    if (!turno || !estadoInicial) return "sin_turno";
    if (estadoInicial === "CANCELADO") return "cancelado";
    return "datos";
  });

  const cancelar = async () => {
    if (vista === "cargando") return;

    setMensajeError(null);
    setVista("cargando");

    try {
      const respuesta = await fetch(
        `/api/mi-turno/${encodeURIComponent(token)}/cancelar`,
        { method: "POST" },
      );
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      setEstadoTurno("CANCELADO");
      setPuedeCancelar(false);
      setPidiendoConfirmacion(false);
      setVista("cancelado");
    } catch {
      setMensajeError("No pudimos cancelar el turno. Probá de nuevo.");
      setVista("datos");
    }
  };

  return (
    <div className="space-y-4">
      {mensajeError && (
        <p
          role="alert"
          className="break-words text-[13px] font-medium text-[#c62828]"
        >
          {mensajeError}
        </p>
      )}
      <DetalleTurno
        turno={turno}
        estadoTurno={estadoTurno}
        metodoPago={metodoPago}
        vista={vista}
        puedeCancelar={puedeCancelar}
        pidiendoConfirmacion={pidiendoConfirmacion}
        onAgregarGoogleCalendar={() => {
          if (calendarUrl)
            window.open(calendarUrl, "_blank", "noopener,noreferrer");
        }}
        onIrAReservar={() => router.push("/reservar")}
        onIrAPagar={() =>
          router.push(`/confirmacion/${encodeURIComponent(token)}`)
        }
        onPedirConfirmacion={() => setPidiendoConfirmacion(true)}
        onConfirmarCancelacion={cancelar}
        onVolverCancelacion={() => setPidiendoConfirmacion(false)}
      />
    </div>
  );
}
