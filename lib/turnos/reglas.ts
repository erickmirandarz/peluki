import type { EstadoTurno } from "@/types";

/** Minutos para elegir pago antes de liberar el horario. */
export const MINUTOS_RESERVA_PENDIENTE = 10;

/** El cliente puede cancelar mientras el turno no haya empezado. */
export function sePuedeCancelar(
  estado: EstadoTurno,
  inicio: Date,
  ahora = new Date(),
) {
  if (estado !== "CONFIRMADO" && estado !== "SIN_CONFIRMAR") return false;
  return inicio.getTime() > ahora.getTime();
}
