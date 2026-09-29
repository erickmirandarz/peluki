"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Chevron } from "@/components/ui/Chevron";
import { sumarDias } from "@/lib/fechas";

interface Props {
  fecha: string;
  hoy: string;
}

export function NavegacionDia({ fecha, hoy }: Props) {
  const router = useRouter();
  const anterior = `/admin/turnos-hoy?fecha=${sumarDias(fecha, -1)}`;
  const siguiente = `/admin/turnos-hoy?fecha=${sumarDias(fecha, 1)}`;
  const esHoy = fecha === hoy;

  return (
    <div className="flex overflow-hidden rounded-md border border-[#D9D9D9] bg-white">
      <Link
        href={anterior}
        title="Día anterior"
        className="flex h-8 w-9 items-center justify-center border-r border-[#D9D9D9] text-[#222222] hover:bg-[#FAFAFA]"
      >
        <Chevron direccion="izq" />
      </Link>
      <Link
        href="/admin/turnos-hoy"
        title="Hoy"
        className={`flex h-8 items-center border-r border-[#D9D9D9] px-3.5 text-[13px] font-medium hover:bg-[#FAFAFA] ${esHoy ? "bg-[#FFF5F2] text-[#E8542A]" : "text-[#222222]"}`}
      >
        Hoy
      </Link>
      <label className="flex h-8 items-center border-r border-[#D9D9D9] px-2">
        <span className="sr-only">Elegir día</span>
        <input
          type="date"
          value={fecha}
          onChange={(evento) => {
            const elegida = evento.target.value;
            if (!elegida) return;
            router.push(
              elegida === hoy
                ? "/admin/turnos-hoy"
                : `/admin/turnos-hoy?fecha=${elegida}`,
            );
          }}
          className="h-7 w-[9.5rem] border-0 bg-transparent text-[13px] text-[#222222] outline-none"
        />
      </label>
      <Link
        href={siguiente}
        title="Día siguiente"
        className="flex h-8 w-9 items-center justify-center text-[#222222] hover:bg-[#FAFAFA]"
      >
        <Chevron direccion="der" />
      </Link>
    </div>
  );
}
