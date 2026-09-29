import "server-only";

import {
  formatearDiaMes,
  horaLocalAUtc,
  nombreDiaLargo,
  sumarDias,
} from "@/lib/fechas";
import type { Peluqueria } from "@/lib/peluquerias/obtener-por-slug";

import {
  listarTurnosEnRango,
  type TurnoListado,
} from "./listar-en-rango";

export type { TurnoListado };

export interface TurnoAgenda {
  id: string;
  fecha: string;
  hora: string;
  cliente: string;
  servicio: string;
}

export interface DiaAgenda {
  fecha: string;
  nombre: string;
  etiquetaCorta: string;
  turnos: TurnoAgenda[];
}

function aAgenda(turno: TurnoListado): TurnoAgenda {
  return {
    id: turno.id,
    fecha: turno.fecha,
    hora: turno.hora,
    cliente: turno.cliente,
    servicio: turno.servicio,
  };
}

/** Turnos no cancelados de lunes a domingo. */
export async function listarAgendaSemanal(
  peluqueria: Peluqueria,
  lunes: string,
): Promise<DiaAgenda[]> {
  const dias: DiaAgenda[] = Array.from({ length: 7 }, (_, indice) => {
    const fecha = sumarDias(lunes, indice);
    return {
      fecha,
      nombre: nombreDiaLargo(fecha),
      etiquetaCorta: formatearDiaMes(fecha),
      turnos: [] as TurnoAgenda[],
    };
  });
  const porFecha = new Map(dias.map((dia) => [dia.fecha, dia]));

  const turnos = await listarTurnosEnRango(
    peluqueria,
    horaLocalAUtc(lunes, "00:00", peluqueria.zonaHoraria),
    horaLocalAUtc(sumarDias(lunes, 7), "00:00", peluqueria.zonaHoraria),
  );

  for (const turno of turnos) {
    porFecha.get(turno.fecha)?.turnos.push(aAgenda(turno));
  }

  return dias;
}

export function semanaTieneTurnos(dias: DiaAgenda[]) {
  return dias.some((dia) => dia.turnos.length > 0);
}
