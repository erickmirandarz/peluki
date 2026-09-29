import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { obtenerTurnoPorToken } from "@/lib/turnos/obtener-por-token";
import {
  armarAvisoTurnoConfirmado,
  notificarTurnoConfirmado,
} from "@/lib/whatsapp";

export async function registrarPagoEfectivo(token: string) {
  const turno = await obtenerTurnoPorToken(token, { omitirLiberacion: true });
  if (!turno) return null;

  if (turno.metodoPago === "EFECTIVO" && turno.estado === "CONFIRMADO") {
    return turno;
  }

  const supabase = createAdminClient();
  const { error: errorPago } = await supabase.from("pagos").insert({
    turno_id: turno.turnoId,
    metodo: "EFECTIVO",
    estado: "A_PAGAR_EN_LOCAL",
    importe_centavos: Math.round(turno.confirmado.precio * 100),
  });

  if (errorPago) throw errorPago;

  const { error: errorTurno } = await supabase
    .from("turnos")
    .update({ estado: "CONFIRMADO" })
    .eq("id", turno.turnoId)
    .eq("estado", "SIN_CONFIRMAR");

  if (errorTurno) throw errorTurno;

  const confirmado = {
    ...turno,
    estado: "CONFIRMADO" as const,
    metodoPago: "EFECTIVO" as const,
  };

  const aviso = armarAvisoTurnoConfirmado(token, confirmado);
  if (!aviso) {
    console.warn("Make: el turno no tiene teléfono, no se mandó el aviso.");
    return confirmado;
  }

  try {
    await notificarTurnoConfirmado(aviso);
  } catch (error) {
    console.error("No se pudo avisar a Make para el WhatsApp:", error);
  }

  return confirmado;
}
