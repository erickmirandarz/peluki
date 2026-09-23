"use client";

import type { MetodoPago, TurnoConfirmado } from "@/types";

import { BotonGoogleCalendar } from "./BotonGoogleCalendar";
import { ConfirmacionExito } from "./ConfirmacionExito";
import { SelectorPago } from "./SelectorPago";
import { TarjetaTurno } from "./TarjetaTurno";

export type EstadoConfirmacion =
  | "datos"
  | "sin_turno"
  | "cargando"
  | "error"
  | "exito";

interface Props {
  turno: TurnoConfirmado | null;
  estado: EstadoConfirmacion;
  pagoConfirmado: boolean;
  metodoPagoSeleccionado: MetodoPago | null;
  onElegirMetodoPago: (metodo: MetodoPago) => void;
  onAgregarGoogleCalendar: () => void;
  onReintentarPago: () => void;
  onIrAReservar: () => void;
  onConfirmar: () => void;
  onListo: () => void;
}

function CheckCircle({ error = false }: { error?: boolean }) {
  return (
    <span
      className={`flex size-12 shrink-0 items-center justify-center rounded-full ${error ? "bg-[#FBE9E5] text-[#C74424]" : "bg-[#E8F3EA] text-[#378248]"}`}
      aria-hidden="true"
    >
      {error ? (
        <span className="text-xl font-semibold">!</span>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="size-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            d="m5 12 4 4L19 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

export function ConfirmacionTurno({
  turno,
  estado,
  pagoConfirmado,
  metodoPagoSeleccionado,
  onElegirMetodoPago,
  onAgregarGoogleCalendar,
  onReintentarPago,
  onIrAReservar,
  onConfirmar,
  onListo,
}: Props) {
  if (estado === "sin_turno") {
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

  if (!turno) return null;

  if (estado === "exito") {
    return (
      <ConfirmacionExito
        turno={turno}
        onAgregarGoogleCalendar={onAgregarGoogleCalendar}
        onListo={onListo}
      />
    );
  }

  const esError = estado === "error";

  return (
    <section
      className="w-full rounded-3xl bg-white p-6 sm:p-8"
      aria-labelledby="confirmacion-title"
    >
      <div className="flex items-center gap-4">
        <CheckCircle error={esError} />
        <div>
          <p
            className={`text-[13px] font-medium uppercase tracking-[0.08em] ${esError ? "text-[#C74424]" : pagoConfirmado ? "text-[#378248]" : "text-[#E8542A]"}`}
          >
            {esError
              ? "Pago rechazado"
              : pagoConfirmado
                ? "Confirmación"
                : "Reserva"}
          </p>
          <h1
            id="confirmacion-title"
            className="text-2xl font-semibold tracking-[-0.03em] text-[#222222]"
          >
            {esError
              ? "Tu pago no pudo procesarse"
              : pagoConfirmado
                ? "¡Turno confirmado!"
                : "Reservamos tu horario"}
          </h1>
          {!esError && !pagoConfirmado && (
            <p className="mt-1 text-[13px] text-[#666666]">
              Tenés 10 minutos para elegir cómo pagar. Si no, el horario se
              libera.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <TarjetaTurno
          turno={turno}
          cargando={estado === "cargando"}
          mensajeCarga="Confirmando tu turno…"
        />
      </div>

      {estado !== "cargando" && (
        <>
          {!esError && (
            <BotonGoogleCalendar onClick={onAgregarGoogleCalendar} />
          )}

          <div className="mt-8">
            <h2 className="text-base font-semibold text-[#222222]">
              ¿Cómo vas a pagar?
            </h2>
            <SelectorPago
              seleccionado={metodoPagoSeleccionado}
              bloquearMercadoPago={esError}
              onElegir={onElegirMetodoPago}
            />
          </div>

          {esError && (
            <button
              type="button"
              onClick={onReintentarPago}
              className="mt-4 w-full rounded-xl border border-[#E8542A] px-5 py-3.5 text-base font-semibold text-[#E8542A] transition-colors hover:bg-[#FFF7F4]"
            >
              Reintentar el pago
            </button>
          )}
          <button
            type="button"
            disabled={metodoPagoSeleccionado !== "EFECTIVO"}
            onClick={onConfirmar}
            className="mt-6 w-full rounded-xl bg-[#E8542A] px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#D94A24] disabled:cursor-not-allowed disabled:bg-[#D9D9D9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8542A]"
          >
            Confirmar
          </button>
        </>
      )}
    </section>
  );
}
