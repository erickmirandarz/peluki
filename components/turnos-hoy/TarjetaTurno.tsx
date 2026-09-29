import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import type { EstadoTurno } from "@/types";

interface Props {
  hora: string;
  cliente: string;
  servicio: string;
  href?: string;
  estado?: EstadoTurno;
  destacado?: boolean;
  onClick?: () => void;
}

const HOVER_SELECCION =
  "cursor-pointer transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out motion-safe:hover:-translate-y-0.5 hover:border-[#E8542A] hover:shadow-md hover:bg-white";

export function TarjetaTurno({
  hora,
  cliente,
  servicio,
  href,
  estado,
  destacado = false,
  onClick,
}: Props) {
  if (onClick || estado) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center justify-between rounded-md border p-4 text-left ${HOVER_SELECCION} ${destacado ? "border-[#E8542A] bg-[#FFF5F2]" : "border-[#E5E5E5] bg-white"}`}
      >
        <div className="flex items-center gap-8">
          <span className="w-14 text-base font-bold text-[#222222]">{hora}</span>
          <div>
            <h2 className="text-base font-semibold text-[#222222]">{cliente}</h2>
            <p className="text-[13px] text-[#666666]">{servicio}</p>
          </div>
        </div>
        {estado && <Badge estado={estado} />}
      </button>
    );
  }

  const contenido = (
    <>
      <span className="mb-0.5 block text-[13px] text-[#666666]">{hora}</span>
      <span className="block text-base font-medium leading-snug text-[#222222]">
        {cliente}
      </span>
      <span className="block text-[13px] text-[#666666]">{servicio}</span>
    </>
  );

  const clase = `block rounded border border-[#EBEBEB] bg-white p-2.5 ${HOVER_SELECCION}`;

  if (href) {
    return (
      <Link href={href} className={clase}>
        {contenido}
      </Link>
    );
  }

  return <div className={clase}>{contenido}</div>;
}
