import "server-only";

import { horaLocalAUtc, sumarDias } from "@/lib/fechas";
import type { Peluqueria } from "@/lib/peluquerias/obtener-por-slug";

import { listarTurnosEnRango, type TurnoListado } from "./listar-en-rango";

export type { TurnoListado };

export async function listarTurnosPorDia(
  peluqueria: Peluqueria,
  fecha: string,
): Promise<TurnoListado[]> {
  return listarTurnosEnRango(
    peluqueria,
    horaLocalAUtc(fecha, "00:00", peluqueria.zonaHoraria),
    horaLocalAUtc(sumarDias(fecha, 1), "00:00", peluqueria.zonaHoraria),
  );
}
