import { createClient } from "@/lib/supabase/server";
import type { Servicio } from "@/types";

export async function listarServicios(
  peluqueriaId: string,
): Promise<Servicio[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("servicios")
    .select("id, nombre, descripcion, duracion_minutos, precio_centavos")
    .eq("peluqueria_id", peluqueriaId)
    .eq("activo", true)
    .order("nombre");

  if (error) throw error;

  return data.map((servicio) => ({
    id: servicio.id,
    nombre: servicio.nombre,
    descripcion: servicio.descripcion,
    duracionMinutos: servicio.duracion_minutos,
    precio: servicio.precio_centavos / 100,
  }));
}
