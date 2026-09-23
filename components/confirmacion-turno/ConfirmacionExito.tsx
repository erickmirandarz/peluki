import type { TurnoConfirmado } from "@/types";

import { BotonGoogleCalendar } from "./BotonGoogleCalendar";
import { TarjetaTurno } from "./TarjetaTurno";

interface Props {
  turno: TurnoConfirmado;
  onAgregarGoogleCalendar: () => void;
  onListo: () => void;
}

export function ConfirmacionExito({
  turno,
  onAgregarGoogleCalendar,
  onListo,
}: Props) {
  return (
    <section
      className="w-full rounded-3xl bg-white p-6 text-center sm:p-8"
      aria-labelledby="exito-title"
    >
      <div
        className="mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-[#E8F3EA] text-[#378248]"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-7"
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
      </div>
      <h1
        id="exito-title"
        className="text-2xl font-semibold tracking-[-0.03em] text-[#222222]"
      >
        ¡Turno confirmado!
      </h1>
      <p className="mt-3 text-base leading-6 text-[#666666]">
        Te vamos a mandar por WhatsApp un link para ver los detalles o cancelar
        el turno.
      </p>

      <div className="mt-8 text-left">
        <TarjetaTurno turno={turno} />
      </div>

      <BotonGoogleCalendar onClick={onAgregarGoogleCalendar} />

      <button
        type="button"
        onClick={onListo}
        className="mt-6 w-full rounded-xl bg-[#E8542A] px-5 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#D94A24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8542A]"
      >
        Listo
      </button>
    </section>
  );
}
