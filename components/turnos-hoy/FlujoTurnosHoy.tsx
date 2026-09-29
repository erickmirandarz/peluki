"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ModalDetalleTurno } from "@/components/turnos-hoy/ModalDetalleTurno";
import { TurnosHoy } from "@/components/turnos-hoy/TurnosHoy";
import type { TurnoListado } from "@/lib/turnos/listar-en-rango";
import type { EstadoTurno } from "@/types";

interface Props {
  titulo: string;
  subtitulo: string;
  fecha: string;
  hoy: string;
  turnos: TurnoListado[];
  esHoy: boolean;
  ahoraIso: string;
}

export function FlujoTurnosHoy({
  titulo,
  subtitulo,
  fecha,
  hoy,
  turnos,
  esHoy,
  ahoraIso,
}: Props) {
  const router = useRouter();
  const [seleccionado, setSeleccionado] = useState<TurnoListado | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const cambiarEstado = async (estado: EstadoTurno) => {
    if (!seleccionado || enviando) return;
    setEnviando(true);
    setMensajeError(null);
    try {
      const respuesta = await fetch(`/api/turnos/${seleccionado.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
      setSeleccionado(null);
      router.refresh();
    } catch {
      setMensajeError("No pudimos actualizar el turno. Probá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      {mensajeError && (
        <p role="alert" className="mb-4 text-[13px] font-medium text-[#c62828]">
          {mensajeError}
        </p>
      )}
      <TurnosHoy
        titulo={titulo}
        subtitulo={subtitulo}
        fecha={fecha}
        hoy={hoy}
        turnos={turnos}
        esHoy={esHoy}
        ahora={new Date(ahoraIso)}
        onAbrir={setSeleccionado}
      />
      {seleccionado && (
        <ModalDetalleTurno
          turno={seleccionado}
          enviando={enviando}
          onCerrar={() => setSeleccionado(null)}
          onCambiarEstado={cambiarEstado}
        />
      )}
    </>
  );
}
