import type { Metadata } from "next";

import { FlujoReserva } from "@/components/reservar-turno/FlujoReserva";
import { listarDiasConAtencion } from "@/lib/horarios/listar-dias";
import { obtenerPeluqueriaActual } from "@/lib/peluquerias/actual";
import { listarServicios } from "@/lib/servicios/listar-servicios";
import { linkWhatsapp } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Reservar turno",
};

export default async function ReservarPage() {
  const peluqueria = await obtenerPeluqueriaActual();
  const [servicios, dias] = await Promise.all([
    listarServicios(peluqueria.id),
    listarDiasConAtencion(peluqueria),
  ]);

  return (
    <FlujoReserva
      peluqueriaSlug={peluqueria.slug}
      servicios={servicios}
      dias={dias}
      linkWhatsapp={linkWhatsapp(peluqueria.telefono)}
    />
  );
}
