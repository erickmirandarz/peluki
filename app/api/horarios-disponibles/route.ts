import type { NextRequest } from "next/server";

import { esFechaValida } from "@/lib/fechas";
import { calcularHorariosDisponibles } from "@/lib/horarios/calcular-disponibles";
import { obtenerPeluqueriaPorSlug } from "@/lib/peluquerias/obtener-por-slug";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const slug = params.get("peluqueria");
  const servicioId = params.get("servicio");
  const fecha = params.get("fecha");

  if (!slug || !servicioId || !fecha) {
    return Response.json(
      { error: "Faltan parámetros: peluqueria, servicio y fecha" },
      { status: 400 },
    );
  }

  if (!esFechaValida(fecha)) {
    return Response.json(
      { error: "La fecha debe tener el formato YYYY-MM-DD" },
      { status: 400 },
    );
  }

  try {
    const peluqueria = await obtenerPeluqueriaPorSlug(slug);

    if (!peluqueria) {
      return Response.json(
        { error: "Peluquería no encontrada" },
        { status: 404 },
      );
    }

    const disponibilidad = await calcularHorariosDisponibles({
      peluqueria,
      servicioId,
      fecha,
    });

    if (!disponibilidad) {
      return Response.json(
        { error: "Servicio no encontrado" },
        { status: 404 },
      );
    }

    return Response.json({
      horarios: disponibilidad.horarios.map((horario) => horario.hora),
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "No pudimos cargar los horarios disponibles" },
      { status: 500 },
    );
  }
}
