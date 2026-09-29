"use client";

import { Badge } from "@/components/ui/Badge";
import { formatearPrecio } from "@/lib/dinero";
import type { TurnoListado } from "@/lib/turnos/listar-en-rango";
import type { EstadoTurno } from "@/types";

interface Props {
  turno: TurnoListado;
  enviando: boolean;
  onCerrar: () => void;
  onCambiarEstado: (estado: EstadoTurno) => void;
}

export function ModalDetalleTurno({
  turno,
  enviando,
  onCerrar,
  onCambiarEstado,
}: Props) {
  const puedeEditar =
    turno.estado === "CONFIRMADO" || turno.estado === "SIN_CONFIRMAR";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detalle-turno-titulo"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Cerrar"
        onClick={onCerrar}
      />
      <div className="relative w-full max-w-md rounded-lg border border-[#E5E5E5] bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-start justify-between border-b border-[#E5E5E5] pb-4">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-[#666666] uppercase">
              Detalle del turno
            </span>
            <h2
              id="detalle-turno-titulo"
              className="mt-0.5 text-xl font-bold text-[#222222]"
            >
              {turno.cliente}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="p-1 text-xl leading-none text-[#666666] hover:text-[#222222]"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <dl className="mb-6 space-y-3 text-sm">
          <Fila etiqueta="Hora" valor={turno.hora} destacado />
          <Fila etiqueta="Servicio" valor={turno.servicio} />
          <Fila etiqueta="Teléfono" valor={turno.telefono ?? "—"} />
          <Fila etiqueta="Precio" valor={formatearPrecio(turno.precio)} negrita />
          <div className="flex items-center justify-between py-1">
            <dt className="text-[#666666]">Estado</dt>
            <dd>
              <Badge estado={turno.estado} compacto />
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-2 border-t border-[#E5E5E5] pt-4 sm:flex-row">
          {puedeEditar && (
            <>
              <button
                type="button"
                disabled={enviando}
                onClick={() => onCambiarEstado("ATENDIDO")}
                className="flex-1 rounded bg-[#16A34A] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#15803D] disabled:opacity-50"
              >
                Marcar atendido
              </button>
              <button
                type="button"
                disabled={enviando}
                onClick={() => onCambiarEstado("CANCELADO")}
                className="flex-1 rounded border border-[#DC2626] px-3 py-2 text-[13px] font-medium text-[#DC2626] hover:bg-red-50 disabled:opacity-50"
              >
                Cancelar turno
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onCerrar}
            className="rounded border border-[#E5E5E5] px-3 py-2 text-[13px] font-medium text-[#666666] hover:text-[#222222]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function Fila({
  etiqueta,
  valor,
  destacado = false,
  negrita = false,
}: {
  etiqueta: string;
  valor: string;
  destacado?: boolean;
  negrita?: boolean;
}) {
  return (
    <div className="flex justify-between border-b border-gray-100 py-1">
      <dt className="text-[#666666]">{etiqueta}</dt>
      <dd
        className={`text-[#222222] ${destacado || negrita ? "font-semibold" : "font-medium"}`}
      >
        {valor}
      </dd>
    </div>
  );
}
