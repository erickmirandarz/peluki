import { Contenedor } from "./Contenedor";
import { NavAdmin } from "./NavAdmin";

interface Props {
  nombrePeluqueria: string;
  direccion: string | null;
}

export function FooterAdmin({ nombrePeluqueria, direccion }: Props) {
  return (
    <footer className="border-t border-[#E5E5E5] bg-white">
      <Contenedor
        ancho="ancho"
        className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-1 text-[13px] text-[#666]">
          <p className="font-semibold text-[#222]">{nombrePeluqueria} · Panel</p>
          {direccion && <p className="break-words">{direccion}</p>}
        </div>
        <NavAdmin />
      </Contenedor>
    </footer>
  );
}
