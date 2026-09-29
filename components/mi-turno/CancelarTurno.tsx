interface Props {
  pidiendoConfirmacion: boolean;
  cargando: boolean;
  onPedirConfirmacion: () => void;
  onConfirmar: () => void;
  onVolver: () => void;
}

export function CancelarTurno({
  pidiendoConfirmacion,
  cargando,
  onPedirConfirmacion,
  onConfirmar,
  onVolver,
}: Props) {
  if (!pidiendoConfirmacion) {
    return (
      <button
        type="button"
        onClick={onPedirConfirmacion}
        disabled={cargando}
        className="mt-4 w-full rounded-xl border border-[#E8542A] px-5 py-3.5 text-base font-semibold text-[#E8542A] transition-colors hover:bg-[#FFF7F4] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancelar turno
      </button>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-[#FBE9E5] bg-[#FFF7F4] p-4 text-left">
      <p className="text-base font-medium text-[#222222]">
        ¿Cancelamos este turno?
      </p>
      <p className="mt-1 text-[13px] leading-5 text-[#666666]">
        El horario se libera y vas a poder reservar otro.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onVolver}
          disabled={cargando}
          className="rounded-xl border border-[#D9D9D9] px-5 py-3 text-base font-medium text-[#222222] transition-colors hover:bg-white disabled:opacity-50"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={onConfirmar}
          disabled={cargando}
          className="rounded-xl bg-[#E8542A] px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-[#D94A24] disabled:cursor-not-allowed disabled:bg-[#D9D9D9]"
        >
          Sí, cancelar
        </button>
      </div>
    </div>
  );
}
