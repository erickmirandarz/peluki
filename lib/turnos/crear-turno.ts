import { buscarOCrearCliente } from "@/lib/clientes/buscar-o-crear";
import { normalizarTelefono } from "@/lib/clientes/normalizar-telefono";
import { calcularHorariosDisponibles } from "@/lib/horarios/calcular-disponibles";
import type { Peluqueria } from "@/lib/peluquerias/obtener-por-slug";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CanalReserva } from "@/types";

import { generarTokenGestion } from "./generar-token";

const VIOLACION_EXCLUSION = "23P01";

export type ResultadoCrearTurno =
  | { ok: true; turnoId: string; token: string }
  | {
      ok: false;
      motivo:
        | "TELEFONO_INVALIDO"
        | "SERVICIO_NO_ENCONTRADO"
        | "HORARIO_NO_DISPONIBLE";
    };

export async function crearTurno({
  peluqueria,
  servicioId,
  fecha,
  hora,
  nombre,
  telefono,
  canal,
}: {
  peluqueria: Peluqueria;
  servicioId: string;
  fecha: string;
  hora: string;
  nombre: string;
  telefono: string;
  canal: CanalReserva;
}): Promise<ResultadoCrearTurno> {
  const telefonoNormalizado = normalizarTelefono(telefono);
  if (!telefonoNormalizado) return { ok: false, motivo: "TELEFONO_INVALIDO" };

  const disponibilidad = await calcularHorariosDisponibles({
    peluqueria,
    servicioId,
    fecha,
  });
  if (!disponibilidad) return { ok: false, motivo: "SERVICIO_NO_ENCONTRADO" };

  const horario = disponibilidad.horarios.find((item) => item.hora === hora);
  if (!horario) return { ok: false, motivo: "HORARIO_NO_DISPONIBLE" };

  const clienteId = await buscarOCrearCliente({
    peluqueriaId: peluqueria.id,
    nombre,
    telefonoOriginal: telefono.trim(),
    telefonoNormalizado,
  });

  const supabase = createAdminClient();
  const { token, hash } = generarTokenGestion();

  // Si hay varios profesionales libres, se prueba con el siguiente cuando otra reserva ganó el horario.
  for (const profesionalId of horario.profesionalIds) {
    const { data, error } = await supabase
      .from("turnos")
      .insert({
        peluqueria_id: peluqueria.id,
        cliente_id: clienteId,
        profesional_id: profesionalId,
        servicio_id: disponibilidad.servicio.id,
        nombre_ingresado: nombre.trim(),
        inicio: horario.inicio.toISOString(),
        fin: horario.fin.toISOString(),
        canal,
        token_gestion_hash: hash,
      })
      .select("id")
      .single();

    if (error?.code === VIOLACION_EXCLUSION) continue;
    if (error) throw error;

    return { ok: true, turnoId: data.id, token };
  }

  return { ok: false, motivo: "HORARIO_NO_DISPONIBLE" };
}
