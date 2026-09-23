import { Contenedor } from "./Contenedor";

interface Props {
  nombrePeluqueria: string;
  direccion: string | null;
  whatsapp: string | null;
}

export function FooterCliente({ nombrePeluqueria, direccion, whatsapp }: Props) {
  return (
    <footer className="border-t border-[#eeeeee] bg-white">
      <Contenedor className="flex flex-col gap-2 py-6 text-[13px] text-[#666] sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="break-words font-semibold text-[#222]">
            {nombrePeluqueria}
          </p>
          {direccion && <p className="break-words">{direccion}</p>}
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-medium text-[#E8542A] hover:underline"
            >
              WhatsApp
            </a>
          )}
        </div>
        <p>Turnos con Peluki</p>
      </Contenedor>
    </footer>
  );
}
