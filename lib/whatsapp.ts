import "server-only";

import type { TurnoPorToken } from "@/lib/turnos/obtener-por-token";

/** Link para abrir un chat de WhatsApp, o null si no hay teléfono cargado. */
export function linkWhatsapp(telefono: string | null) {
  const digitos = telefono?.replace(/\D/g, "");
  return digitos ? `https://wa.me/${digitos}` : null;
}

export interface AvisoTurnoConfirmado {
  evento: "turno_confirmado";
  telefono: string;
  nombre: string;
  servicio: string;
  fecha: string;
  hora: string;
  peluqueria: string;
  link: string;
}

export function armarAvisoTurnoConfirmado(
  token: string,
  turno: TurnoPorToken,
): AvisoTurnoConfirmado | null {
  if (!turno.telefono) return null;

  const base = (
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");

  return {
    evento: "turno_confirmado",
    telefono: turno.telefono,
    nombre: turno.nombreCliente,
    servicio: turno.confirmado.servicioNombre,
    fecha: turno.confirmado.fecha,
    hora: turno.confirmado.hora,
    peluqueria: turno.confirmado.nombrePeluqueria,
    link: `${base}/mi-turno/${encodeURIComponent(token)}`,
  };
}

/** Avisa a Make para que mande el WhatsApp. Si no hay webhook o falla, no revierte el turno. */
export async function notificarTurnoConfirmado(aviso: AvisoTurnoConfirmado) {
  const url = process.env.MAKE_WEBHOOK_URL?.trim();
  if (!url) {
    console.warn("Make: falta MAKE_WEBHOOK_URL, no se mandó el aviso.");
    return;
  }

  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(aviso),
  });

  if (!respuesta.ok) {
    throw new Error(`Make respondió ${respuesta.status}`);
  }
}
