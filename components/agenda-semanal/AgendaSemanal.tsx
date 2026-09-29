import Link from "next/link";

import { ColumnaDia } from "@/components/agenda-semanal/ColumnaDia";
import { Chevron } from "@/components/ui/Chevron";
import { sumarDias } from "@/lib/fechas";
import type { DiaAgenda } from "@/lib/turnos/listar-por-semana";

interface Props {
  periodo: string;
  lunes: string;
  hoy: string;
  dias: DiaAgenda[];
}

export function AgendaSemanal({ periodo, lunes, hoy, dias }: Props) {
  const anterior = `/admin/agenda-semanal?semana=${sumarDias(lunes, -7)}`;
  const siguiente = `/admin/agenda-semanal?semana=${sumarDias(lunes, 7)}`;

  return (
    <section>
      <header className="flex flex-col gap-4 border-b border-[#E5E5E5] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#222222]">
            Agenda semanal
          </h1>
          <p className="mt-0.5 text-[13px] leading-5 text-[#666666]">{periodo}</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/admin/turnos-hoy"
            className="px-2 py-1 text-[13px] font-medium text-[#E8542A] hover:underline"
          >
            Ver turnos
          </Link>
          <div className="flex overflow-hidden rounded-md border border-[#D9D9D9] bg-white">
            <Link
              href={anterior}
              title="Semana anterior"
              className="flex h-8 w-9 items-center justify-center border-r border-[#D9D9D9] text-[#222222] hover:bg-[#FAFAFA]"
            >
              <Chevron direccion="izq" />
            </Link>
            <Link
              href="/admin/agenda-semanal"
              className="flex h-8 items-center border-r border-[#D9D9D9] px-3.5 text-[13px] font-medium text-[#222222] hover:bg-[#FAFAFA]"
            >
              Esta semana
            </Link>
            <Link
              href={siguiente}
              title="Semana siguiente"
              className="flex h-8 w-9 items-center justify-center text-[#222222] hover:bg-[#FAFAFA]"
            >
              <Chevron direccion="der" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mt-5 overflow-hidden rounded-lg border border-[#E5E5E5] bg-white">
        <div className="grid min-h-[580px] grid-cols-1 divide-y divide-[#E5E5E5] md:grid-cols-7 md:divide-x md:divide-y-0">
          {dias.map((dia) => (
            <ColumnaDia key={dia.fecha} dia={dia} esHoy={dia.fecha === hoy} />
          ))}
        </div>
      </div>
    </section>
  );
}
