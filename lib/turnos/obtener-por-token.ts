import "server-only";

import {
  formatearFechaLarga,
  formatearHoraCorta,
} from "@/lib/fechas";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EstadoTurno, MetodoPago, TurnoConfirmado } from "@/types";

import { hashearToken } from "./generar-token";
import { liberarReservasVencidas } from "./liberar-reservas-vencidas";

export interface TurnoPorToken {
  turnoId: string;
  estado: EstadoTurno;
  confirmado: TurnoConfirmado;
  inicio: Date;
  fin: Date;
  metodoPago: MetodoPago | null;
}

type Relacion<T> = T | T[] | null;

export async function obtenerTurnoPorToken(
  token: string,
  opciones?: { omitirLiberacion?: boolean },
): Promise<TurnoPorToken | null> {
  if (!token) return null;

  if (!opciones?.omitirLiberacion) {
    await liberarReservasVencidas();
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("turnos")
    .select(
      `
      id,
      estado,
      inicio,
      fin,
      servicios ( nombre, duracion_minutos, precio_centavos ),
      peluquerias ( nombre, zona_horaria ),
      pagos ( metodo, estado, created_at )
    `,
    )
    .eq("token_gestion_hash", hashearToken(token))
    .maybeSingle();

  if (error) throw error;
  if (!data || data.estado === "CANCELADO") return null;

  const servicio = uno(data.servicios as Relacion<ServicioFila>);
  const peluqueria = uno(data.peluquerias as Relacion<PeluqueriaFila>);
  if (!servicio || !peluqueria) return null;

  const inicio = new Date(data.inicio);
  const fin = new Date(data.fin);
  const pagos = Array.isArray(data.pagos) ? data.pagos : [];
  const pagoElegido = [...pagos].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  )[0];

  return {
    turnoId: data.id,
    estado: data.estado as EstadoTurno,
    inicio,
    fin,
    metodoPago: (pagoElegido?.metodo as MetodoPago | undefined) ?? null,
    confirmado: {
      servicioNombre: servicio.nombre,
      fecha: formatearFechaLarga(inicio, peluqueria.zona_horaria),
      hora: formatearHoraCorta(inicio, peluqueria.zona_horaria),
      duracionMinutos: servicio.duracion_minutos,
      precio: servicio.precio_centavos / 100,
      nombrePeluqueria: peluqueria.nombre,
    },
  };
}

interface ServicioFila {
  nombre: string;
  duracion_minutos: number;
  precio_centavos: number;
}

interface PeluqueriaFila {
  nombre: string;
  zona_horaria: string;
}

function uno<T>(valor: Relacion<T>): T | null {
  if (!valor) return null;
  return Array.isArray(valor) ? (valor[0] ?? null) : valor;
}
