import type { Metadata } from "next";

import { FlujoMiTurno } from "@/components/mi-turno/FlujoMiTurno";
import { linkGoogleCalendar } from "@/lib/calendario/google";
import { obtenerTurnoPorToken } from "@/lib/turnos/obtener-por-token";
import { sePuedeCancelar } from "@/lib/turnos/reglas";

export const metadata: Metadata = {
  title: "Mi turno",
};

export default async function MiTurnoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const turno = await obtenerTurnoPorToken(token, { incluirCancelados: true });

  const calendarUrl = turno
    ? linkGoogleCalendar({
        titulo: `${turno.confirmado.servicioNombre} — ${turno.confirmado.nombrePeluqueria}`,
        inicio: turno.inicio,
        fin: turno.fin,
        descripcion: `Turno en ${turno.confirmado.nombrePeluqueria}`,
      })
    : null;

  return (
    <FlujoMiTurno
      token={token}
      turno={turno?.confirmado ?? null}
      estadoTurno={turno?.estado ?? null}
      metodoPago={turno?.metodoPago ?? null}
      calendarUrl={calendarUrl}
      puedeCancelar={
        turno ? sePuedeCancelar(turno.estado, turno.inicio) : false
      }
    />
  );
}
