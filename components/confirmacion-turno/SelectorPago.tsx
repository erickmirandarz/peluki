import type { MetodoPago } from "@/types";

const METODOS: { id: MetodoPago; nombre: string; detalle: string }[] = [
  {
    id: "MERCADO_PAGO",
    nombre: "Mercado Pago",
    detalle: "Pagá de forma segura online",
  },
  {
    id: "EFECTIVO",
    nombre: "Efectivo en el local",
    detalle: "Al finalizar tu turno",
  },
];

interface Props {
  seleccionado: MetodoPago | null;
  bloquearMercadoPago?: boolean;
  onElegir: (metodo: MetodoPago) => void;
}

export function SelectorPago({
  seleccionado,
  bloquearMercadoPago = false,
  onElegir,
}: Props) {
  return (
    <div className="mt-4 grid gap-3">
      {METODOS.map((metodo) => {
        const estaSeleccionado = seleccionado === metodo.id;
        const bloqueado = bloquearMercadoPago && metodo.id === "MERCADO_PAGO";
        return (
          <button
            key={metodo.id}
            type="button"
            disabled={bloqueado}
            onClick={() => onElegir(metodo.id)}
            aria-pressed={estaSeleccionado}
            className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8542A] ${estaSeleccionado ? "border-[#E8542A] bg-[#FFF7F4]" : "border-[#E5E5E5] bg-white hover:bg-[#F4F4F4]"} ${bloqueado ? "cursor-not-allowed opacity-45" : ""}`}
          >
            <span className="min-w-0">
              <span className="block break-words text-base font-medium text-[#222222]">
                {metodo.nombre}
              </span>
              <span className="mt-1 block text-[13px] text-[#666666]">
                {metodo.detalle}
              </span>
            </span>
            <span
              className={`ml-4 flex size-5 shrink-0 items-center justify-center rounded-full border ${estaSeleccionado ? "border-[#E8542A]" : "border-[#BDBDBD]"}`}
            >
              {estaSeleccionado && (
                <span className="size-2.5 rounded-full bg-[#E8542A]" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
