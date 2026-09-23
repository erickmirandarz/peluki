"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { MetodoPago, TurnoConfirmado } from "@/types";

import {
  ConfirmacionTurno,
  type EstadoConfirmacion,
} from "./ConfirmacionTurno";

interface Props {
  token: string;
  turno: TurnoConfirmado | null;
  calendarUrl: string | null;
  metodoPagoInicial: MetodoPago | null;
  yaConfirmado: boolean;
}

export function FlujoConfirmacion({
  token,
  turno,
  calendarUrl,
  metodoPagoInicial,
  yaConfirmado,
}: Props) {
  const router = useRouter();
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(
    metodoPagoInicial,
  );
  const [pagoConfirmado, setPagoConfirmado] = useState(yaConfirmado);
  const [estado, setEstado] = useState<EstadoConfirmacion>(() => {
    if (!turno) return "sin_turno";
    if (yaConfirmado) return "exito";
    return "datos";
  });
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const elegirMetodo = async (metodo: MetodoPago) => {
    setMensajeError(null);

    if (metodo === "MERCADO_PAGO") {
      setMetodoPago(metodo);
      return;
    }

    setMetodoPago(metodo);
    setEstado("cargando");

    try {
      const respuesta = await fetch(
        `/api/mi-turno/${encodeURIComponent(token)}/pago`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ metodo }),
        },
      );
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      setPagoConfirmado(true);
      setEstado("exito");
    } catch {
      setMensajeError("No pudimos guardar el medio de pago. Probá de nuevo.");
      setEstado("datos");
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
      <ConfirmacionTurno
        turno={turno}
        estado={estado}
        pagoConfirmado={pagoConfirmado}
        metodoPagoSeleccionado={metodoPago}
        onElegirMetodoPago={elegirMetodo}
        onAgregarGoogleCalendar={() => {
          if (calendarUrl)
            window.open(calendarUrl, "_blank", "noopener,noreferrer");
        }}
        onReintentarPago={() => {
          setEstado("datos");
          setMetodoPago("MERCADO_PAGO");
        }}
        onIrAReservar={() => router.push("/reservar")}
        onListo={() => {
          if (estado === "exito") {
            router.push("/reservar");
            return;
          }
          if (pagoConfirmado) setEstado("exito");
        }}
      />
    </div>
  );
}
