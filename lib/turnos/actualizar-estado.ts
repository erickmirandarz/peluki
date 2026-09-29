import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { EstadoTurno } from "@/types";

const ESTADOS_ADMIN: EstadoTurno[] = ["ATENDIDO", "CANCELADO", "AUSENTE"];

export async function actualizarEstadoTurno(
  turnoId: string,
  estado: EstadoTurno,
) {
  if (!ESTADOS_ADMIN.includes(estado)) {
    return { ok: false as const, motivo: "ESTADO_INVALIDO" };
  }

  const supabase = createAdminClient();
  const actualizacion: Record<string, string> = { estado };

  if (estado === "CANCELADO") {
    actualizacion.cancelado_at = new Date().toISOString();
    actualizacion.cancelado_por = "ADMIN";
    actualizacion.motivo_cancelacion = "Cancelado desde el panel";
  }

  const { data, error } = await supabase
    .from("turnos")
    .update(actualizacion)
    .eq("id", turnoId)
    .neq("estado", "CANCELADO")
    .select("id, estado")
    .maybeSingle();

  if (error) throw error;
  if (!data) return { ok: false as const, motivo: "NO_ENCONTRADO" };
  return { ok: true as const, estado: data.estado as EstadoTurno };
}
