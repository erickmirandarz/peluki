import {
  diaSemana,
  fechaLocalHoy,
  horaAMinutos,
  horaLocalAUtc,
  minutosAHora,
  sumarDias,
} from "@/lib/fechas";
import type { Peluqueria } from "@/lib/peluquerias/obtener-por-slug";
import { createAdminClient } from "@/lib/supabase/admin";
import { liberarReservasVencidas } from "@/lib/turnos/liberar-reservas-vencidas";

import {
  ANTICIPACION_MINIMA_MINUTOS,
  DIAS_HACIA_ADELANTE,
  INTERVALO_MINUTOS,
} from "./reglas";

export interface HorarioDisponible {
  hora: string;
  inicio: Date;
  fin: Date;
  profesionalIds: string[];
}

export interface ResultadoDisponibilidad {
  servicio: { id: string; duracionMinutos: number; precioCentavos: number };
  horarios: HorarioDisponible[];
}

interface Intervalo {
  profesional_id: string;
  inicio: string;
  fin: string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Devuelve null si el servicio no existe o no está activo en esa peluquería. */
export async function calcularHorariosDisponibles({
  peluqueria,
  servicioId,
  fecha,
  ahora = new Date(),
}: {
  peluqueria: Peluqueria;
  servicioId: string;
  fecha: string;
  ahora?: Date;
}): Promise<ResultadoDisponibilidad | null> {
  if (!UUID.test(servicioId)) return null;

  await liberarReservasVencidas();
  const supabase = createAdminClient();

  const { data: servicio, error: errorServicio } = await supabase
    .from("servicios")
    .select("id, duracion_minutos, precio_centavos")
    .eq("id", servicioId)
    .eq("peluqueria_id", peluqueria.id)
    .eq("activo", true)
    .maybeSingle();

  if (errorServicio) throw errorServicio;
  if (!servicio) return null;

  const resultado: ResultadoDisponibilidad = {
    servicio: {
      id: servicio.id,
      duracionMinutos: servicio.duracion_minutos,
      precioCentavos: servicio.precio_centavos,
    },
    horarios: [],
  };

  const hoy = fechaLocalHoy(peluqueria.zonaHoraria, ahora);
  if (fecha < hoy || fecha >= sumarDias(hoy, DIAS_HACIA_ADELANTE)) {
    return resultado;
  }

  const { data: asignaciones, error: errorAsignaciones } = await supabase
    .from("profesional_servicios")
    .select("profesional_id")
    .eq("servicio_id", servicio.id);

  if (errorAsignaciones) throw errorAsignaciones;

  const { data: profesionales, error: errorProfesionales } = await supabase
    .from("profesionales")
    .select("id")
    .eq("peluqueria_id", peluqueria.id)
    .eq("activo", true)
    .in(
      "id",
      asignaciones.map((asignacion) => asignacion.profesional_id),
    );

  if (errorProfesionales) throw errorProfesionales;
  if (profesionales.length === 0) return resultado;

  const profesionalIds = profesionales.map((profesional) => profesional.id);
  const inicioDia = horaLocalAUtc(fecha, "00:00", peluqueria.zonaHoraria);
  const finDia = horaLocalAUtc(
    sumarDias(fecha, 1),
    "00:00",
    peluqueria.zonaHoraria,
  );

  const [horariosTrabajo, turnos, bloqueos] = await Promise.all([
    supabase
      .from("horarios_trabajo")
      .select("profesional_id, hora_inicio, hora_fin")
      .in("profesional_id", profesionalIds)
      .eq("dia_semana", diaSemana(fecha))
      .eq("activo", true),
    supabase
      .from("turnos")
      .select("profesional_id, inicio, fin")
      .in("profesional_id", profesionalIds)
      .neq("estado", "CANCELADO")
      .lt("inicio", finDia.toISOString())
      .gt("fin", inicioDia.toISOString()),
    supabase
      .from("bloqueos_agenda")
      .select("profesional_id, inicio, fin")
      .in("profesional_id", profesionalIds)
      .lt("inicio", finDia.toISOString())
      .gt("fin", inicioDia.toISOString()),
  ]);

  if (horariosTrabajo.error) throw horariosTrabajo.error;
  if (turnos.error) throw turnos.error;
  if (bloqueos.error) throw bloqueos.error;

  const ocupados: Intervalo[] = [...turnos.data, ...bloqueos.data];
  const primerInicioPermitido =
    ahora.getTime() + ANTICIPACION_MINIMA_MINUTOS * 60_000;
  const porHora = new Map<string, HorarioDisponible>();

  for (const franja of horariosTrabajo.data) {
    const finFranja = horaAMinutos(franja.hora_fin);

    for (
      let minuto = horaAMinutos(franja.hora_inicio);
      minuto + servicio.duracion_minutos <= finFranja;
      minuto += INTERVALO_MINUTOS
    ) {
      const hora = minutosAHora(minuto);
      const inicio = horaLocalAUtc(fecha, hora, peluqueria.zonaHoraria);
      const fin = new Date(
        inicio.getTime() + servicio.duracion_minutos * 60_000,
      );

      if (inicio.getTime() < primerInicioPermitido) continue;

      const seSuperpone = ocupados.some(
        (ocupado) =>
          ocupado.profesional_id === franja.profesional_id &&
          new Date(ocupado.inicio) < fin &&
          new Date(ocupado.fin) > inicio,
      );
      if (seSuperpone) continue;

      const existente = porHora.get(hora);
      if (existente) {
        existente.profesionalIds.push(franja.profesional_id);
      } else {
        porHora.set(hora, {
          hora,
          inicio,
          fin,
          profesionalIds: [franja.profesional_id],
        });
      }
    }
  }

  resultado.horarios = [...porHora.values()].sort((a, b) =>
    a.hora.localeCompare(b.hora),
  );
  return resultado;
}
