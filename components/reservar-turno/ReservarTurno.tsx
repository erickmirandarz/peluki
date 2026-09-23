"use client";

import { useState } from "react";

import type { DiaDisponible, Servicio } from "@/types";

export type EstadoPantalla = "datos" | "vacio" | "cargando" | "error";

export interface DatosReserva {
  servicio: Servicio;
  dia: DiaDisponible;
  hora: string;
  nombre: string;
  telefono: string;
}

interface Props {
  servicios: Servicio[];
  dias: DiaDisponible[];
  horariosDisponibles: string[];
  estado: EstadoPantalla;
  linkWhatsapp: string | null;
  cargandoHorarios?: boolean;
  enviando?: boolean;
  mensajeError?: string | null;
  onElegirServicio: (servicio: Servicio) => void;
  onElegirDia: (dia: DiaDisponible) => void;
  onReintentar: () => void;
  onConfirmarTurno: (datos: DatosReserva) => void;
}

const formatearPrecio = (precio: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(precio);

function EsqueletoHorarios() {
  return (
    <div aria-hidden="true" className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="h-11 animate-pulse rounded-lg bg-[#e4e4e4]" />
      ))}
    </div>
  );
}

function EsqueletoCalendario() {
  return (
    <div aria-hidden="true" className="space-y-4">
      <div className="flex gap-2 overflow-hidden">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="h-[68px] min-w-[60px] flex-1 animate-pulse rounded-xl bg-[#e4e4e4]"
          />
        ))}
      </div>
      <EsqueletoHorarios />
    </div>
  );
}

export function ReservarTurno({
  servicios,
  dias,
  horariosDisponibles,
  estado,
  linkWhatsapp,
  cargandoHorarios = false,
  enviando = false,
  mensajeError = null,
  onElegirServicio,
  onElegirDia,
  onReintentar,
  onConfirmarTurno,
}: Props) {
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [dia, setDia] = useState<DiaDisponible | null>(dias[0] ?? null);
  const [hora, setHora] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  // Si la lista de horarios cambia (otro día, o alguien tomó el horario), la hora elegida puede dejar de existir.
  const horaElegida = hora && horariosDisponibles.includes(hora) ? hora : null;

  const elegirServicio = (item: Servicio) => {
    setServicio(item);
    setHora(null);
    onElegirServicio(item);
  };

  const elegirDia = (item: DiaDisponible) => {
    setDia(item);
    setHora(null);
    onElegirDia(item);
  };

  const puedeConfirmar =
    !enviando &&
    servicio !== null &&
    dia !== null &&
    horaElegida !== null &&
    nombre.trim() !== "" &&
    telefono.trim() !== "";

  const confirmar = () => {
    if (!servicio || !dia || !horaElegida) return;
    onConfirmarTurno({
      servicio,
      dia,
      hora: horaElegida,
      nombre,
      telefono,
    });
  };

  return (
    <section className="relative w-full overflow-hidden rounded-[28px] border border-[#e7e7e7] bg-white text-[#222]">
      <header className="border-b border-[#eeeeee] px-5 py-5 sm:px-7">
        <h1 className="text-2xl font-semibold tracking-[-0.03em]">
          Reservar turno
        </h1>
      </header>

      <div className="space-y-8 px-5 py-6 sm:px-7 sm:py-8">
        {estado === "cargando" ? (
          <>
            <div className="space-y-4" aria-hidden="true">
              <div className="h-5 w-28 animate-pulse rounded bg-[#e4e4e4]" />
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[76px] animate-pulse rounded-xl bg-[#e4e4e4]"
                  />
                ))}
              </div>
            </div>
            <EsqueletoCalendario />
          </>
        ) : estado === "error" ? (
          <div className="flex flex-col items-start gap-4 rounded-2xl bg-[#f4f4f4] p-5">
            <p className="break-words text-base font-medium">
              No pudimos cargar los horarios disponibles
            </p>
            <button
              type="button"
              onClick={onReintentar}
              className="rounded-lg bg-[#222] px-4 py-3 text-[13px] font-semibold text-white transition hover:bg-[#444] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8542A]"
            >
              Reintentar
            </button>
          </div>
        ) : estado === "vacio" ? (
          <div className="flex flex-col items-start gap-4 rounded-2xl bg-[#f4f4f4] p-5">
            <p className="break-words text-base font-medium">
              No hay turnos disponibles esta semana
            </p>
            {linkWhatsapp ? (
              <a
                href={linkWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#E8542A] px-4 py-3 text-[13px] font-semibold text-white transition hover:bg-[#c94420] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222]"
              >
                Escribinos por WhatsApp
              </a>
            ) : (
              <p className="text-[13px] text-[#666]">
                Volvé a intentar más tarde o contactá a la peluquería.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h2 className="text-base font-semibold">Elegí un servicio</h2>
              <div className="space-y-2">
                {servicios.map((item) => {
                  const seleccionado = servicio?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => elegirServicio(item)}
                      aria-pressed={seleccionado}
                      className={`w-full rounded-xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8542A] ${seleccionado ? "border-[#E8542A] bg-[#fff7f4]" : "border-[#e7e7e7] hover:border-[#cfcfcf]"}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="break-words text-base font-semibold">
                          {item.nombre}
                        </span>
                        <span className="shrink-0 text-base font-semibold">
                          {formatearPrecio(item.precio)}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-[#666]">
                        <span>{item.duracionMinutos} min</span>
                        {item.descripcion && (
                          <span className="break-words">{item.descripcion}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-semibold">Elegí día y horario</h2>
              <div
                className="flex gap-2 overflow-x-auto pb-1"
                aria-label="Días disponibles"
              >
                {dias.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => elegirDia(item)}
                    aria-pressed={dia?.id === item.id}
                    className={`min-w-[60px] flex-1 rounded-xl border px-2 py-3 text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8542A] ${dia?.id === item.id ? "border-[#E8542A] bg-[#E8542A] text-white" : "border-[#e7e7e7] hover:border-[#cfcfcf]"}`}
                  >
                    <span className="block text-[13px] font-medium">
                      {item.etiqueta}
                    </span>
                    <span className="mt-1 block text-xl font-semibold">
                      {item.numero}
                    </span>
                  </button>
                ))}
              </div>

              {!servicio ? (
                <p className="text-[13px] text-[#666]">
                  Elegí un servicio para ver los horarios.
                </p>
              ) : cargandoHorarios ? (
                <EsqueletoHorarios />
              ) : horariosDisponibles.length === 0 ? (
                <p className="text-[13px] text-[#666]">
                  No quedan horarios libres este día. Probá con otro.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {horariosDisponibles.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setHora(item)}
                      aria-pressed={horaElegida === item}
                      className={`rounded-lg border py-3 text-[13px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8542A] ${horaElegida === item ? "border-[#E8542A] bg-[#fff1ec] text-[#E8542A]" : "border-[#e7e7e7] hover:border-[#cfcfcf]"}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-semibold">Tus datos</h2>
              <div className="space-y-3">
                <label className="block text-[13px] font-medium text-[#666]">
                  Nombre
                  <input
                    value={nombre}
                    onChange={(event) => setNombre(event.target.value)}
                    autoComplete="name"
                    maxLength={100}
                    className="mt-2 w-full rounded-lg border border-[#dedede] px-3 py-3 text-base text-[#222] outline-none transition placeholder:text-[#999] focus:border-[#E8542A]"
                    placeholder="Tu nombre"
                  />
                </label>
                <label className="block text-[13px] font-medium text-[#666]">
                  Número de teléfono
                  <input
                    value={telefono}
                    onChange={(event) => setTelefono(event.target.value)}
                    type="tel"
                    autoComplete="tel"
                    className="mt-2 w-full rounded-lg border border-[#dedede] px-3 py-3 text-base text-[#222] outline-none transition placeholder:text-[#999] focus:border-[#E8542A]"
                    placeholder="388 123 4567"
                  />
                </label>
              </div>
            </div>
          </>
        )}
      </div>

      {estado === "datos" && (
        <div className="sticky bottom-0 space-y-3 border-t border-[#eeeeee] bg-white/95 px-5 py-4 backdrop-blur-sm sm:px-7">
          {mensajeError && (
            <p role="alert" className="break-words text-[13px] font-medium text-[#c62828]">
              {mensajeError}
            </p>
          )}
          <button
            type="button"
            disabled={!puedeConfirmar}
            onClick={confirmar}
            className="w-full rounded-xl bg-[#E8542A] px-4 py-4 text-base font-semibold text-white transition hover:bg-[#c94420] disabled:cursor-not-allowed disabled:bg-[#e4b4a7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222]"
          >
            {enviando ? "Confirmando…" : "Confirmar turno"}
          </button>
        </div>
      )}
    </section>
  );
}
