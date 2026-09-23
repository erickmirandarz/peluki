import { formatearPrecio } from "@/lib/dinero";
import type { TurnoConfirmado } from "@/types";

interface Props {
  turno: TurnoConfirmado;
  cargando?: boolean;
  mensajeCarga?: string;
}

export function TarjetaTurno({
  turno,
  cargando = false,
  mensajeCarga = "Guardando…",
}: Props) {
  const detalles = [
    { etiqueta: "Servicio", valor: turno.servicioNombre },
    { etiqueta: "Día", valor: turno.fecha },
    { etiqueta: "Hora", valor: turno.hora },
    { etiqueta: "Duración", valor: `${turno.duracionMinutos} min` },
    { etiqueta: "Precio", valor: formatearPrecio(turno.precio) },
    { etiqueta: "Peluquería", valor: turno.nombrePeluqueria },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white p-6">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
        {detalles.map((detalle) => (
          <div key={detalle.etiqueta} className="min-w-0">
            <dt className="mb-1 text-[13px] leading-4 text-[#666666]">
              {detalle.etiqueta}
            </dt>
            <dd className="break-words text-base leading-5 text-[#222222]">
              {detalle.valor}
            </dd>
          </div>
        ))}
      </dl>
      {cargando && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/90"
          role="status"
          aria-live="polite"
        >
          <span className="size-8 animate-spin rounded-full border-[3px] border-[#F5C9BC] border-t-[#E8542A]" />
          <span className="text-sm text-[#666666]">{mensajeCarga}</span>
        </div>
      )}
    </div>
  );
}
