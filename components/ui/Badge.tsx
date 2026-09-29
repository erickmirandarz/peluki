import type { EstadoTurno } from "@/types";

const ESTILOS: Record<string, string> = {
  CONFIRMADO:
    "border border-emerald-200 bg-emerald-50 text-[#16A34A]",
  ATENDIDO: "border border-green-200 bg-[#F4F4F4] text-[#16A34A]",
  CANCELADO: "border border-red-200 bg-red-50 text-[#DC2626]",
  SIN_CONFIRMAR: "bg-[#F4F4F4] text-[#666666]",
  AUSENTE: "bg-[#F4F4F4] text-[#666666]",
};

const ETIQUETAS: Record<EstadoTurno, string> = {
  CONFIRMADO: "Confirmado",
  ATENDIDO: "Atendido",
  CANCELADO: "Cancelado",
  SIN_CONFIRMAR: "Sin confirmar",
  AUSENTE: "Ausente",
};

export function Badge({
  estado,
  compacto = false,
}: {
  estado: EstadoTurno;
  compacto?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded font-medium ${compacto ? "px-2.5 py-0.5 text-[12px]" : "px-3 py-1 text-[13px]"} ${ESTILOS[estado] ?? ESTILOS.SIN_CONFIRMAR}`}
    >
      {ETIQUETAS[estado]}
    </span>
  );
}
