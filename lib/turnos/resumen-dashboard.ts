import "server-only";

import {
  fechaLocalHoy,
  horaLocalAUtc,
  inicioMes,
  inicioMesSiguiente,
  inicioSemanaLunes,
  sumarDias,
} from "@/lib/fechas";
import type { Peluqueria } from "@/lib/peluquerias/obtener-por-slug";

import { listarTurnosEnRango, type TurnoListado } from "./listar-en-rango";

export type PeriodoDashboard = "hoy" | "semana" | "mes";

export interface SegmentoServicio {
  nombre: string;
  cantidad: number;
  porcentaje: number;
}

export interface ResumenDashboard {
  cobrada: number;
  pendiente: number;
  cantidadAtendidos: number;
  cantidadConfirmados: number;
  servicios: SegmentoServicio[];
}

export function rangoDelPeriodo(
  periodo: PeriodoDashboard,
  hoy: string,
  zona: string,
): { desde: Date; hasta: Date } {
  if (periodo === "hoy") {
    return {
      desde: horaLocalAUtc(hoy, "00:00", zona),
      hasta: horaLocalAUtc(sumarDias(hoy, 1), "00:00", zona),
    };
  }
  if (periodo === "mes") {
    const inicio = inicioMes(hoy);
    return {
      desde: horaLocalAUtc(inicio, "00:00", zona),
      hasta: horaLocalAUtc(inicioMesSiguiente(hoy), "00:00", zona),
    };
  }
  const lunes = inicioSemanaLunes(hoy);
  return {
    desde: horaLocalAUtc(lunes, "00:00", zona),
    hasta: horaLocalAUtc(sumarDias(lunes, 7), "00:00", zona),
  };
}

export function resumirDashboard(turnos: TurnoListado[]): ResumenDashboard {
  let cobrada = 0;
  let pendiente = 0;
  let cantidadAtendidos = 0;
  let cantidadConfirmados = 0;
  const conteo = new Map<string, number>();

  for (const turno of turnos) {
    if (turno.estado === "ATENDIDO") {
      cobrada += turno.precio;
      cantidadAtendidos += 1;
    }
    if (turno.estado === "CONFIRMADO") {
      pendiente += turno.precio;
      cantidadConfirmados += 1;
    }
    if (turno.estado === "ATENDIDO" || turno.estado === "CONFIRMADO") {
      conteo.set(turno.servicio, (conteo.get(turno.servicio) ?? 0) + 1);
    }
  }

  const total = [...conteo.values()].reduce((suma, n) => suma + n, 0);
  const servicios = [...conteo.entries()]
    .map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
      porcentaje: total === 0 ? 0 : Math.round((cantidad / total) * 100),
    }))
    .sort((a, b) => b.cantidad - a.cantidad);

  return {
    cobrada,
    pendiente,
    cantidadAtendidos,
    cantidadConfirmados,
    servicios,
  };
}

export async function obtenerResumenDashboard(
  peluqueria: Peluqueria,
  periodo: PeriodoDashboard,
) {
  const hoy = fechaLocalHoy(peluqueria.zonaHoraria);
  const { desde, hasta } = rangoDelPeriodo(
    periodo,
    hoy,
    peluqueria.zonaHoraria,
  );
  const turnos = await listarTurnosEnRango(peluqueria, desde, hasta);
  return resumirDashboard(turnos);
}

export function periodoValido(valor: string | undefined): PeriodoDashboard {
  if (valor === "hoy" || valor === "mes" || valor === "semana") return valor;
  return "semana";
}
