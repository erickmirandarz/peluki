"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import type { DiaDisponible, Servicio } from "@/types";

import { ReservarTurno, type DatosReserva } from "./ReservarTurno";

interface Props {
  peluqueriaSlug: string;
  servicios: Servicio[];
  dias: DiaDisponible[];
  linkWhatsapp: string | null;
}

export function FlujoReserva({
  peluqueriaSlug,
  servicios,
  dias,
  linkWhatsapp,
}: Props) {
  const router = useRouter();
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [dia, setDia] = useState<DiaDisponible | null>(dias[0] ?? null);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [errorHorarios, setErrorHorarios] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  // Descarta respuestas viejas si el cliente cambia de servicio o día antes de que lleguen.
  const ultimaConsulta = useRef(0);

  const cargarHorarios = async (
    servicioElegido: Servicio | null,
    diaElegido: DiaDisponible | null,
  ) => {
    if (!servicioElegido || !diaElegido) return;

    const consulta = ++ultimaConsulta.current;
    setCargandoHorarios(true);
    setErrorHorarios(false);

    try {
      const params = new URLSearchParams({
        peluqueria: peluqueriaSlug,
        servicio: servicioElegido.id,
        fecha: diaElegido.fecha,
      });
      const respuesta = await fetch(`/api/horarios-disponibles?${params}`);
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      const { horarios: libres } = (await respuesta.json()) as {
        horarios: string[];
      };
      if (consulta === ultimaConsulta.current) setHorarios(libres);
    } catch {
      if (consulta === ultimaConsulta.current) setErrorHorarios(true);
    } finally {
      if (consulta === ultimaConsulta.current) setCargandoHorarios(false);
    }
  };

  const elegirServicio = (item: Servicio) => {
    setServicio(item);
    setMensajeError(null);
    cargarHorarios(item, dia);
  };

  const elegirDia = (item: DiaDisponible) => {
    setDia(item);
    setMensajeError(null);
    cargarHorarios(servicio, item);
  };

  const confirmarTurno = async (datos: DatosReserva) => {
    setEnviando(true);
    setMensajeError(null);

    try {
      const respuesta = await fetch("/api/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peluqueria: peluqueriaSlug,
          servicioId: datos.servicio.id,
          fecha: datos.dia.fecha,
          hora: datos.hora,
          nombre: datos.nombre,
          telefono: datos.telefono,
        }),
      });
      const cuerpo = await respuesta.json();

      if (!respuesta.ok) {
        setMensajeError(cuerpo.error ?? "No pudimos guardar el turno.");
        if (respuesta.status === 409) cargarHorarios(datos.servicio, datos.dia);
        setEnviando(false);
        return;
      }

      router.push(`/confirmacion/${cuerpo.turno.token}`);
    } catch {
      setMensajeError("No pudimos guardar el turno. Revisá tu conexión.");
      setEnviando(false);
    }
  };

  return (
    <ReservarTurno
      servicios={servicios}
      dias={dias}
      horariosDisponibles={horarios}
      estado={dias.length === 0 ? "vacio" : errorHorarios ? "error" : "datos"}
      linkWhatsapp={linkWhatsapp}
      cargandoHorarios={cargandoHorarios}
      enviando={enviando}
      mensajeError={mensajeError}
      onElegirServicio={elegirServicio}
      onElegirDia={elegirDia}
      onReintentar={() => cargarHorarios(servicio, dia)}
      onConfirmarTurno={confirmarTurno}
    />
  );
}
