import { diaSemana, fechaLocalHoy, nombreDia, sumarDias } from "@/lib/fechas";
import type { Peluqueria } from "@/lib/peluquerias/obtener-por-slug";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DiaDisponible } from "@/types";

import { DIAS_HACIA_ADELANTE } from "./reglas";

/** Próximos días en los que al menos un profesional activo atiende. */
export async function listarDiasConAtencion(
  peluqueria: Peluqueria,
  ahora = new Date(),
): Promise<DiaDisponible[]> {
  const supabase = createAdminClient();

  const { data: profesionales, error: errorProfesionales } = await supabase
    .from("profesionales")
    .select("id")
    .eq("peluqueria_id", peluqueria.id)
    .eq("activo", true);

  if (errorProfesionales) throw errorProfesionales;
  if (profesionales.length === 0) return [];

  const { data: horarios, error: errorHorarios } = await supabase
    .from("horarios_trabajo")
    .select("dia_semana")
    .in(
      "profesional_id",
      profesionales.map((profesional) => profesional.id),
    )
    .eq("activo", true);

  if (errorHorarios) throw errorHorarios;

  const diasConAtencion = new Set(horarios.map((horario) => horario.dia_semana));
  const hoy = fechaLocalHoy(peluqueria.zonaHoraria, ahora);
  const dias: DiaDisponible[] = [];

  for (let i = 0; i < DIAS_HACIA_ADELANTE; i++) {
    const fecha = sumarDias(hoy, i);
    if (!diasConAtencion.has(diaSemana(fecha))) continue;

    dias.push({
      id: fecha,
      etiqueta: nombreDia(fecha),
      numero: String(Number(fecha.slice(8, 10))),
      fecha,
    });
  }

  return dias;
}
