import Link from "next/link";

import { GraficoTorta } from "@/components/dashboard/GraficoTorta";
import { TarjetaMetrica } from "@/components/dashboard/TarjetaMetrica";
import { formatearPrecio } from "@/lib/dinero";
import type {
  PeriodoDashboard,
  ResumenDashboard,
} from "@/lib/turnos/resumen-dashboard";

const PERIODOS: { id: PeriodoDashboard; etiqueta: string }[] = [
  { id: "hoy", etiqueta: "Hoy" },
  { id: "semana", etiqueta: "Esta semana" },
  { id: "mes", etiqueta: "Este mes" },
];

interface Props {
  periodo: PeriodoDashboard;
  resumen: ResumenDashboard;
}

export function Dashboard({ periodo, resumen }: Props) {
  return (
    <section>
      <header className="mb-6 flex flex-col gap-4 border-b border-[#E5E5E5] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#222222]">
            Dashboard
          </h1>
          <p className="mt-0.5 text-[13px] text-[#666666]">
            Ganancias de turnos atendidos y lo que falta cobrar de los
            confirmados.
          </p>
        </div>
        <div className="flex overflow-hidden rounded-md border border-[#D9D9D9] bg-white">
          {PERIODOS.map((item, indice) => (
            <Link
              key={item.id}
              href={`/admin/dashboard?periodo=${item.id}`}
              className={`h-8 px-3.5 text-[13px] font-medium leading-8 ${indice < PERIODOS.length - 1 ? "border-r border-[#D9D9D9]" : ""} ${periodo === item.id ? "bg-[#FFF5F2] text-[#E8542A]" : "text-[#222222] hover:bg-[#FAFAFA]"}`}
            >
              {item.etiqueta}
            </Link>
          ))}
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <TarjetaMetrica
          etiqueta="Ganancia"
          valor={formatearPrecio(resumen.cobrada)}
          detalle={`${resumen.cantidadAtendidos === 1 ? "1 turno atendido" : `${resumen.cantidadAtendidos} turnos atendidos`}`}
        />
        <TarjetaMetrica
          etiqueta="Ganancia faltante"
          valor={formatearPrecio(resumen.pendiente)}
          detalle={`${resumen.cantidadConfirmados === 1 ? "1 turno confirmado" : `${resumen.cantidadConfirmados} turnos confirmados`} sin atender`}
        />
      </div>

      <article className="mt-6 rounded-lg border border-[#E5E5E5] bg-white p-5">
        <h2 className="text-base font-semibold text-[#222222]">
          Servicios
        </h2>
        <p className="mt-1 mb-6 text-[13px] text-[#666666]">
          Porcentaje de turnos confirmados y atendidos, por tipo de servicio.
        </p>
        <GraficoTorta segmentos={resumen.servicios} />
      </article>
    </section>
  );
}
