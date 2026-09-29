import type { Metadata } from "next";

import { AgendaSemanal } from "@/components/agenda-semanal/AgendaSemanal";
import {
  esFechaValida,
  fechaLocalHoy,
  formatearRangoSemana,
  inicioSemanaLunes,
  sumarDias,
} from "@/lib/fechas";
import { obtenerPeluqueriaActual } from "@/lib/peluquerias/actual";
import {
  listarAgendaSemanal,
} from "@/lib/turnos/listar-por-semana";

export const metadata: Metadata = {
  title: "Agenda semanal",
};

export default async function AgendaSemanalPage({
  searchParams,
}: {
  searchParams: Promise<{ semana?: string }>;
}) {
  const peluqueria = await obtenerPeluqueriaActual();
  const { semana } = await searchParams;
  const hoy = fechaLocalHoy(peluqueria.zonaHoraria);
  const referencia =
    semana && esFechaValida(semana) ? semana : hoy;
  const lunes = inicioSemanaLunes(referencia);
  const domingo = sumarDias(lunes, 6);
  const dias = await listarAgendaSemanal(peluqueria, lunes);

  return (
    <AgendaSemanal
      periodo={formatearRangoSemana(lunes, domingo)}
      lunes={lunes}
      hoy={hoy}
      dias={dias}
    />
  );
}
