import type { Metadata } from "next";

import { FlujoConfirmacion } from "@/components/confirmacion-turno/FlujoConfirmacion";
import { linkGoogleCalendar } from "@/lib/calendario/google";
import { obtenerTurnoPorToken } from "@/lib/turnos/obtener-por-token";

export const metadata: Metadata = {
  title: "Confirmación de turno",
};

export default async function ConfirmacionPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const turno = await obtenerTurnoPorToken(token);

  const calendarUrl = turno
    ? linkGoogleCalendar({
        titulo: `${turno.confirmado.servicioNombre} — ${turno.confirmado.nombrePeluqueria}`,
        inicio: turno.inicio,
        fin: turno.fin,
        descripcion: `Turno en ${turno.confirmado.nombrePeluqueria}`,
      })
    : null;

  return (
    <FlujoConfirmacion
      token={token}
      turno={turno?.confirmado ?? null}
      calendarUrl={calendarUrl}
      metodoPagoInicial={turno?.metodoPago ?? null}
      yaConfirmado={turno?.estado === "CONFIRMADO"}
    />
  );
}
