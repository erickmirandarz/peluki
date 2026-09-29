import Link from "next/link";

import { TarjetaTurno } from "@/components/turnos-hoy/TarjetaTurno";
import type { DiaAgenda } from "@/lib/turnos/listar-por-semana";

interface Props {
  dia: DiaAgenda;
  esHoy?: boolean;
}

export function ColumnaDia({ dia, esHoy = false }: Props) {
  const hrefDia = `/admin/turnos-hoy?fecha=${dia.fecha}`;

  return (
    <Link
      href={hrefDia}
      className={`flex flex-col bg-white transition-colors hover:bg-[#FFF5F2] ${esHoy ? "bg-[#FFFAF8]" : ""}`}
    >
      <div className="flex items-center justify-between border-b border-[#E5E5E5] bg-[#FAFAFA] p-3">
        <div>
          <span className="block text-[13px] font-semibold text-[#222222]">
            {dia.nombre}
          </span>
          <span className="block text-[13px] text-[#666666]">
            {dia.etiquetaCorta}
          </span>
        </div>
        <span
          className={`flex size-6 items-center justify-center rounded-full bg-[#F4F4F4] text-[13px] font-medium ${dia.turnos.length === 0 ? "text-[#666666]" : "text-[#222222]"}`}
        >
          {dia.turnos.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-2">
        {dia.turnos.length === 0 ? (
          <p className="p-2 text-[13px] text-[#666666]">Sin turnos</p>
        ) : (
          dia.turnos.map((turno) => (
            <TarjetaTurno
              key={turno.id}
              hora={turno.hora}
              cliente={turno.cliente}
              servicio={turno.servicio}
            />
          ))
        )}
      </div>
    </Link>
  );
}
