import type { SegmentoServicio } from "@/lib/turnos/resumen-dashboard";

const COLORES = [
  "#E8542A",
  "#2A9D8F",
  "#E9C46A",
  "#264653",
  "#9B5DE5",
  "#00BBF9",
  "#F4A261",
];

interface Props {
  segmentos: SegmentoServicio[];
}

export function GraficoTorta({ segmentos }: Props) {
  const total = segmentos.reduce((suma, s) => suma + s.cantidad, 0);
  if (total === 0 || segmentos.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-[#666666]">
        Todavía no hay servicios confirmados o atendidos en este período.
      </p>
    );
  }

  const radio = 54;
  const circunferencia = 2 * Math.PI * radio;
  let acumulado = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
      <svg
        viewBox="0 0 140 140"
        className="size-44 shrink-0"
        role="img"
        aria-label="Distribución de servicios"
      >
        <circle cx="70" cy="70" r={radio} fill="none" stroke="#F4F4F4" strokeWidth="22" />
        {segmentos.map((segmento, indice) => {
          const largo = (segmento.cantidad / total) * circunferencia;
          const offset = acumulado;
          acumulado += largo;
          return (
            <circle
              key={segmento.nombre}
              cx="70"
              cy="70"
              r={radio}
              fill="none"
              stroke={COLORES[indice % COLORES.length]}
              strokeWidth="22"
              strokeDasharray={`${largo} ${circunferencia - largo}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 70 70)"
            />
          );
        })}
      </svg>
      <ul className="w-full space-y-2">
        {segmentos.map((segmento, indice) => (
          <li
            key={segmento.nombre}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: COLORES[indice % COLORES.length] }}
              />
              <span className="truncate text-[#222222]">{segmento.nombre}</span>
            </span>
            <span className="shrink-0 text-[#666666]">
              {segmento.cantidad} · {segmento.porcentaje}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
