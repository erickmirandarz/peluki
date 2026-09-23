import { notFound } from "next/navigation";

import { PELUQUERIA_SLUG } from "@/lib/config";

import { obtenerPeluqueriaPorSlug } from "./obtener-por-slug";

/** Peluquería de las páginas públicas. Muestra la página 404 si no existe. */
export async function obtenerPeluqueriaActual() {
  const peluqueria = await obtenerPeluqueriaPorSlug(PELUQUERIA_SLUG);
  if (!peluqueria) notFound();
  return peluqueria;
}
