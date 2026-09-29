import type { EstadoTurno, MetodoPago } from "@/types";

interface Props {
  estadoTurno: EstadoTurno;
  metodoPago: MetodoPago | null;
}

function textoPago(estadoTurno: EstadoTurno, metodoPago: MetodoPago | null) {
  if (estadoTurno === "CANCELADO") return "Turno cancelado";
  if (estadoTurno === "ATENDIDO") return "Turno atendido";
  if (estadoTurno === "AUSENTE") return "No asistió";
  if (estadoTurno === "SIN_CONFIRMAR") return "Pago pendiente";
  if (metodoPago === "EFECTIVO") return "Se paga en el local";
  if (metodoPago === "MERCADO_PAGO") return "Pago online";
  return "Confirmado";
}

export function EstadoPago({ estadoTurno, metodoPago }: Props) {
  const cancelado = estadoTurno === "CANCELADO";

  return (
    <p
      className={`mt-3 text-sm ${cancelado ? "text-[#C74424]" : "text-[#666666]"}`}
    >
      {textoPago(estadoTurno, metodoPago)}
    </p>
  );
}
