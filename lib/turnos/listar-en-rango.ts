import "server-only";

import {
  fechaLocalDe,
  formatearHoraCorta,
} from "@/lib/fechas";
import type { Peluqueria } from "@/lib/peluquerias/obtener-por-slug";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EstadoTurno } from "@/types";

export interface TurnoListado {
  id: string;
  fecha: string;
  hora: string;
  cliente: string;
  servicio: string;
  estado: EstadoTurno;
  telefono: string | null;
  precio: number;
  inicio: string;
  fin: string;
}

type Relacion<T> = T | T[] | null;

interface ServicioFila {
  nombre: string;
  precio_centavos: number;
}

interface ClienteFila {
  telefono_original: string;
  telefono_normalizado: string;
}

function uno<T>(valor: Relacion<T>): T | null {
  if (!valor) return null;
  return Array.isArray(valor) ? (valor[0] ?? null) : valor;
}

/** Turnos no cancelados en [desde, hasta). Una sola consulta. */
export async function listarTurnosEnRango(
  peluqueria: Peluqueria,
  desde: Date,
  hasta: Date,
): Promise<TurnoListado[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("turnos")
    .select(
      `
      id,
      inicio,
      fin,
      estado,
      nombre_ingresado,
      servicios ( nombre, precio_centavos ),
      clientes!cliente_id ( telefono_original, telefono_normalizado )
    `,
    )
    .eq("peluqueria_id", peluqueria.id)
    .gte("inicio", desde.toISOString())
    .lt("inicio", hasta.toISOString())
    .neq("estado", "CANCELADO")
    .order("inicio");

  if (error) throw error;

  return data.map((fila) => {
    const inicio = new Date(fila.inicio);
    const servicio = uno(fila.servicios as Relacion<ServicioFila>);
    const cliente = uno(fila.clientes as Relacion<ClienteFila>);
    return {
      id: fila.id,
      fecha: fechaLocalDe(inicio, peluqueria.zonaHoraria),
      hora: formatearHoraCorta(inicio, peluqueria.zonaHoraria),
      cliente: fila.nombre_ingresado,
      servicio: servicio?.nombre ?? "Servicio",
      estado: fila.estado as EstadoTurno,
      telefono: cliente?.telefono_original ?? cliente?.telefono_normalizado ?? null,
      precio: (servicio?.precio_centavos ?? 0) / 100,
      inicio: inicio.toISOString(),
      fin: new Date(fila.fin).toISOString(),
    };
  });
}
