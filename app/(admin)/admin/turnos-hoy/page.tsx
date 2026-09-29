import type { Metadata } from "next";

import { FlujoTurnosHoy } from "@/components/turnos-hoy/FlujoTurnosHoy";
import {
  esFechaValida,
  fechaLocalHoy,
  formatearFechaTitulo,
} from "@/lib/fechas";
import { obtenerPeluqueriaActual } from "@/lib/peluquerias/actual";
import { listarTurnosPorDia } from "@/lib/turnos/listar-por-dia";

export const metadata: Metadata = {
  title: "Turnos",
};

export default async function TurnosHoyPage({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string }>;
}) {
  const peluqueria = await obtenerPeluqueriaActual();
  const { fecha: fechaParam } = await searchParams;
  const hoy = fechaLocalHoy(peluqueria.zonaHoraria);
  const fecha = fechaParam && esFechaValida(fechaParam) ? fechaParam : hoy;
  const esHoy = fecha === hoy;
  const turnos = await listarTurnosPorDia(peluqueria, fecha);
  const cantidad = turnos.length;
  const etiquetaTurnos =
    cantidad === 1 ? "1 turno" : `${cantidad} turnos`;

  return (
    <FlujoTurnosHoy
      titulo="Turnos"
      subtitulo={`${formatearFechaTitulo(fecha)} · ${etiquetaTurnos}`}
      fecha={fecha}
      hoy={hoy}
      turnos={turnos}
      esHoy={esHoy}
      ahoraIso={new Date().toISOString()}
    />
  );
}
