import { createClient } from "@/lib/supabase/server";

export interface Peluqueria {
  id: string;
  nombre: string;
  slug: string;
  telefono: string | null;
  zonaHoraria: string;
}

export async function obtenerPeluqueriaPorSlug(
  slug: string,
): Promise<Peluqueria | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("peluquerias")
    .select("id, nombre, slug, telefono, zona_horaria")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    nombre: data.nombre,
    slug: data.slug,
    telefono: data.telefono,
    zonaHoraria: data.zona_horaria,
  };
}
