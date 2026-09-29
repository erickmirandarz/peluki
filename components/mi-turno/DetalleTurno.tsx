"use client";

import type { EstadoTurno, MetodoPago, TurnoConfirmado } from "@/types";

import { BotonGoogleCalendar } from "@/components/confirmacion-turno/BotonGoogleCalendar";
import { TarjetaTurno } from "@/components/confirmacion-turno/TarjetaTurno";

import { CancelarTurno } from "./CancelarTurno";
import { EstadoPago } from "./EstadoPago";

export type VistaMiTurno =
  | "sin_turno"
  | "datos"
  | "cargando"
  | "cancelado"
  | "error";

interface Props {
  turno: TurnoConfirmado | null;
  estadoTurno: EstadoTurno | null;
  metodoPago: MetodoPago | null;
  vista: VistaMiTurno;
  puedeCancelar: boolean;
  pidiendoConfirmacion: boolean;
  onAgregarGoogleCalendar: () => void;
  onIrAReservar: () => void;
  onIrAPagar: () => void;
  onPedirConfirmacion: () => void;
  onConfirmarCancelacion: () => void;
  onVolverCancelacion: () => void;
}

export function DetalleTurno({
  turno,
  estadoTurno,
  metodoPago,
  vista,
  puedeCancelar,
  pidiendoConfirmacion,
  onAgregarGoogleCalendar,
  onIrAReservar,
  onIrAPagar,
  onPedirConfirmacion,
  onConfirmarCancelacion,
  onVolverCancelacion,
}: Props) {
  if (vista === "sin_turno" || !turno || !estadoTurno) {
    return (
      <section
        className="w-full rounded-3xl bg-white p-6 text-center sm:p-8"
        aria-labelledby="sin-turno-title"
      >
        <div
          className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-[#F4F4F4] text-2xl text-[#666666]"
          aria-hidden="true"
        >
          ?
        </div>
        <h1
          id="sin-turno-title"
          className="text-2xl font-semibold tracking-[-0.03em] text-[#222222]"
        >
          No encontramos ese turno
        </h1>
        <p className="mt-3 text-base leading-6 text-[#666666]">
          El enlace puede haber vencido o el turno ya no está disponible.
        </p>
        <button
          type="button"
          onClick={onIrAReservar}
          className="mt-8 w-full rounded-xl bg-[#E8542A] px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#D94A24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8542A]"
        >
          Reservar un turno
        </button>
      </section>
    );
  }

  const cancelado = vista === "cancelado" || estadoTurno === "CANCELADO";

  return (
    <section
      className="w-full rounded-3xl bg-white p-6 sm:p-8"
      aria-labelledby="mi-turno-title"
    >
      <div className="text-center">
        <p
          className={`text-[13px] font-medium uppercase tracking-[0.08em] ${cancelado ? "text-[#C74424]" : "text-[#378248]"}`}
        >
          {cancelado ? "Cancelado" : "Tu turno"}
        </p>
        <h1
          id="mi-turno-title"
          className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#222222]"
        >
          {cancelado ? "Este turno fue cancelado" : "Detalle de tu turno"}
        </h1>
        <EstadoPago estadoTurno={estadoTurno} metodoPago={metodoPago} />
      </div>

      <div className="mt-8 text-left">
        <TarjetaTurno
          turno={turno}
          cargando={vista === "cargando"}
          mensajeCarga="Cancelando tu turno…"
        />
      </div>

      {vista !== "cargando" && !cancelado && (
        <>
          <BotonGoogleCalendar onClick={onAgregarGoogleCalendar} />

          {estadoTurno === "SIN_CONFIRMAR" && puedeCancelar && (
            <button
              type="button"
              onClick={onIrAPagar}
              className="mt-4 w-full rounded-xl bg-[#E8542A] px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#D94A24]"
            >
              Completar el pago
            </button>
          )}

          {puedeCancelar && (
            <CancelarTurno
              pidiendoConfirmacion={pidiendoConfirmacion}
              cargando={false}
              onPedirConfirmacion={onPedirConfirmacion}
              onConfirmar={onConfirmarCancelacion}
              onVolver={onVolverCancelacion}
            />
          )}

          {!puedeCancelar && (
            <p className="mt-4 text-center text-[13px] text-[#666666]">
              Este turno ya no se puede cancelar.
            </p>
          )}
        </>
      )}

      {cancelado && (
        <button
          type="button"
          onClick={onIrAReservar}
          className="mt-6 w-full rounded-xl bg-[#E8542A] px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#D94A24]"
        >
          Reservar otro turno
        </button>
      )}
    </section>
  );
}
