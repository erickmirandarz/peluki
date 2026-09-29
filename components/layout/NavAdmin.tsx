"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ENLACES = [
  { href: "/admin/dashboard", etiqueta: "Dashboard" },
  { href: "/admin/turnos-hoy", etiqueta: "Turnos" },
  { href: "/admin/agenda-semanal", etiqueta: "Agenda semanal" },
] as const;

export function NavAdmin() {
  const ruta = usePathname();

  return (
    <nav aria-label="Paneles" className="flex flex-wrap items-center gap-1">
      {ENLACES.map((enlace) => {
        const activo =
          ruta === enlace.href || ruta.startsWith(`${enlace.href}/`);
        return (
          <Link
            key={enlace.href}
            href={enlace.href}
            className={`rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8542A] ${activo ? "bg-[#FFF5F2] text-[#E8542A]" : "text-[#666666] hover:bg-[#F4F4F4] hover:text-[#222222]"}`}
          >
            {enlace.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
