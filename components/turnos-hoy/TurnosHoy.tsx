import Link from "next/link";

import { NavegacionDia } from "@/components/turnos-hoy/NavegacionDia";
import { TarjetaTurno } from "@/components/turnos-hoy/TarjetaTurno";
import { EmptyState } from "@/components/ui/EmptyState";
import type { TurnoListado } from "@/lib/turnos/listar-en-rango";

interface Props {
  titulo: string;
  subtitulo: string;
  fecha: string;
  hoy: string;
  turnos: TurnoListado[];
  esHoy: boolean;
  ahora: Date;
  onAbrir: (turno: TurnoListado) => void;
}

export function TurnosHoy({
  titulo,
  subtitulo,
  fecha,
  hoy,
  turnos,
  esHoy,
  ahora,
  onAbrir,
}: Props) {
  const indiceAhora = esHoy
    ? turnos.findIndex((turno) => new Date(turno.fin) > ahora)
    : -1;
  const idActual = esHoy
    ? turnos.find((turno) => {
        const inicio = new Date(turno.inicio);
        const fin = new Date(turno.fin);
        return inicio <= ahora && fin > ahora;
      })?.id
    : undefined;

  return (
    <section>
      <header className="mb-6 border-b border-[#E5E5E5] pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-tight text-[#222222]">
              {titulo}
            </h1>
            <p className="mt-1 text-[13px] text-[#666666]">{subtitulo}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <NavegacionDia fecha={fecha} hoy={hoy} />
            <Link
              href="/reservar"
              className="inline-flex items-center gap-1 rounded bg-[#E8542A] px-4 py-2 text-sm font-medium text-white hover:bg-[#D34822]"
            >
              <span className="text-base font-semibold leading-none">+</span>{" "}
              Nuevo turno
            </Link>
          </div>
        </div>
      </header>

      {turnos.length === 0 ? (
        <EmptyState
          message={
            esHoy
              ? "Todavía no tenés turnos para hoy"
              : "No hay turnos este día"
          }
          accionHref="/reservar"
          accionTexto="Nuevo turno"
          compacto
        />
      ) : (
        <div className="space-y-4">
          {turnos.map((turno, indice) => (
            <div key={turno.id}>
              {indice === indiceAhora && <MarcaAhora />}
              <TarjetaTurno
                hora={turno.hora}
                cliente={turno.cliente}
                servicio={turno.servicio}
                estado={turno.estado}
                destacado={turno.id === idActual}
                onClick={() => onAbrir(turno)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function MarcaAhora() {
  return (
    <div className="relative flex items-center py-1">
      <div className="flex-grow border-t border-[#FBD5CA]" />
      <span className="mx-3 shrink-0 text-[13px] font-semibold tracking-wider text-[#E8542A] uppercase">
        Ahora
      </span>
      <div className="flex-grow border-t border-[#FBD5CA]" />
    </div>
  );
}
