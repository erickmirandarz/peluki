import Link from "next/link";

import { Contenedor } from "./Contenedor";

interface Props {
  nombrePeluqueria: string;
  whatsapp: string | null;
}

export function HeaderCliente({ nombrePeluqueria, whatsapp }: Props) {
  return (
    <header className="border-b border-[#eeeeee] bg-white">
      <Contenedor className="flex items-center justify-between gap-4 py-4">
        <Link
          href="/reservar"
          className="break-words text-base font-semibold text-[#222] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8542A]"
        >
          {nombrePeluqueria}
        </Link>

        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg px-3 py-2 text-[13px] font-semibold text-[#E8542A] transition hover:bg-[#fff1ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8542A]"
          >
            Escribinos
          </a>
        )}
      </Contenedor>
    </header>
  );
}
