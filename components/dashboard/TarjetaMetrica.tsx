interface Props {
  etiqueta: string;
  valor: string;
  detalle: string;
}

export function TarjetaMetrica({ etiqueta, valor, detalle }: Props) {
  return (
    <article className="rounded-lg border border-[#E5E5E5] bg-white p-5">
      <p className="text-[13px] font-medium text-[#666666]">{etiqueta}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-[#222222]">
        {valor}
      </p>
      <p className="mt-1 text-[13px] text-[#666666]">{detalle}</p>
    </article>
  );
}
