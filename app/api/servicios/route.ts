import type { NextRequest } from "next/server";

import { obtenerPeluqueriaPorSlug } from "@/lib/peluquerias/obtener-por-slug";
import { listarServicios } from "@/lib/servicios/listar-servicios";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("peluqueria");

  if (!slug) {
    return Response.json(
      { error: "Falta el parámetro 'peluqueria'" },
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

    const servicios = await listarServicios(peluqueria.id);
    return Response.json({ servicios });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "No pudimos cargar los servicios" },
      { status: 500 },
    );
  }
}
