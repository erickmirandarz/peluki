import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export interface Peluqueria {
  id: string;
  nombre: string;
  slug: string;
  telefono: string | null;
  direccion: string | null;
  zonaHoraria: string;
}

// cache: el layout y la página la piden en la misma visita y se consulta una sola vez.
export const obtenerPeluqueriaPorSlug = cache(
  async (slug: string): Promise<Peluqueria | null> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("peluquerias")
      .select("id, nombre, slug, telefono, direccion, zona_horaria")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      nombre: data.nombre,
      slug: data.slug,
      telefono: data.telefono,
      direccion: data.direccion,
      zonaHoraria: data.zona_horaria,
    };
  },
);
