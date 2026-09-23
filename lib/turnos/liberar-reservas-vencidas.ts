import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

import { MINUTOS_RESERVA_PENDIENTE } from "./reglas";

/** Cancela reservas sin pago vencidas para que el horario vuelva a estar libre. */
export async function liberarReservasVencidas() {
  const limite = new Date(
    Date.now() - MINUTOS_RESERVA_PENDIENTE * 60_000,
  ).toISOString();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("turnos")
    .update({
      estado: "CANCELADO",
      cancelado_at: new Date().toISOString(),
      motivo_cancelacion: "Reserva vencida sin medio de pago",
    })
    .eq("estado", "SIN_CONFIRMAR")
    .lt("created_at", limite);

  if (error) throw error;
}
