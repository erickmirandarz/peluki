import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { TurnoPorToken } from "@/lib/turnos/obtener-por-token";
import { obtenerTurnoPorToken } from "@/lib/turnos/obtener-por-token";
import { sePuedeCancelar } from "@/lib/turnos/reglas";

export type MotivoNoCancelar =
  | "NO_ENCONTRADO"
  | "NO_CANCELABLE"
  | "YA_EMPEZO";

export type ResultadoCancelar =
  | { ok: true; turno: TurnoPorToken; yaCancelado: boolean }
  | { ok: false; motivo: MotivoNoCancelar };

export async function cancelarTurnoPorToken(
  token: string,
): Promise<ResultadoCancelar> {
  const turno = await obtenerTurnoPorToken(token, { incluirCancelados: true });
  if (!turno) return { ok: false, motivo: "NO_ENCONTRADO" };

  if (turno.estado === "CANCELADO") {
    return { ok: true, turno, yaCancelado: true };
  }

  if (turno.estado !== "CONFIRMADO" && turno.estado !== "SIN_CONFIRMAR") {
    return { ok: false, motivo: "NO_CANCELABLE" };
  }

  if (!sePuedeCancelar(turno.estado, turno.inicio)) {
    return { ok: false, motivo: "YA_EMPEZO" };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("turnos")
    .update({
      estado: "CANCELADO",
      cancelado_at: new Date().toISOString(),
      cancelado_por: "CLIENTE",
      motivo_cancelacion: "Cancelado por el cliente",
    })
    .eq("id", turno.turnoId)
    .in("estado", ["CONFIRMADO", "SIN_CONFIRMAR"])
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) return { ok: false, motivo: "NO_CANCELABLE" };

  return {
    ok: true,
    yaCancelado: false,
    turno: { ...turno, estado: "CANCELADO" },
  };
}
