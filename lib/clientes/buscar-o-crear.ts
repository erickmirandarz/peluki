import { createAdminClient } from "@/lib/supabase/admin";

const VIOLACION_UNICA = "23505";

/** Devuelve el id del cliente con ese teléfono en la peluquería, creándolo si no existe. */
export async function buscarOCrearCliente({
  peluqueriaId,
  nombre,
  telefonoOriginal,
  telefonoNormalizado,
}: {
  peluqueriaId: string;
  nombre: string;
  telefonoOriginal: string;
  telefonoNormalizado: string;
}): Promise<string> {
  const supabase = createAdminClient();

  const buscar = async () => {
    const { data, error } = await supabase
      .from("clientes")
      .select("id, merged_into_id")
      .eq("peluqueria_id", peluqueriaId)
      .eq("telefono_normalizado", telefonoNormalizado)
      .maybeSingle();

    if (error) throw error;
    return data ? (data.merged_into_id ?? data.id) : null;
  };

  const existente = await buscar();
  if (existente) return existente;

  const { data, error } = await supabase
    .from("clientes")
    .insert({
      peluqueria_id: peluqueriaId,
      nombre_canonico: nombre.trim().replace(/\s+/g, " "),
      telefono_original: telefonoOriginal,
      telefono_normalizado: telefonoNormalizado,
    })
    .select("id")
    .single();

  // Otra reserva con el mismo teléfono pudo crear al cliente entre la búsqueda y el insert.
  if (error?.code === VIOLACION_UNICA) {
    const creadoEnParalelo = await buscar();
    if (creadoEnParalelo) return creadoEnParalelo;
  }

  if (error) throw error;
  return data.id;
}
