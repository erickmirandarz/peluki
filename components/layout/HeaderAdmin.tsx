import Link from "next/link";

import { Contenedor } from "./Contenedor";
import { NavAdmin } from "./NavAdmin";

interface Props {
  nombrePeluqueria: string;
}

export function HeaderAdmin({ nombrePeluqueria }: Props) {
  return (
    <header className="border-b border-[#E5E5E5] bg-white">
      <Contenedor
        ancho="ancho"
        className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="/admin/dashboard"
            className="truncate text-base font-semibold text-[#222] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8542A]"
          >
            {nombrePeluqueria}
            <span className="ml-2 text-[13px] font-medium text-[#666666]">
              Panel
            </span>
          </Link>
          <NavAdmin />
        </div>
        <Link
          href="/reservar"
          className="shrink-0 rounded-lg px-3 py-2 text-[13px] font-semibold text-[#E8542A] transition hover:bg-[#FFF5F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8542A]"
        >
          Vista pública
        </Link>
      </Contenedor>
    </header>
  );
}
