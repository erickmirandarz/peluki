import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FlujoReserva } from "@/components/reservar-turno/FlujoReserva";
import { PELUQUERIA_SLUG } from "@/lib/config";
import { listarDiasConAtencion } from "@/lib/horarios/listar-dias";
import { obtenerPeluqueriaPorSlug } from "@/lib/peluquerias/obtener-por-slug";
import { listarServicios } from "@/lib/servicios/listar-servicios";

export const metadata: Metadata = {
  title: "Reservar turno",
};

export default async function ReservarPage() {
  const peluqueria = await obtenerPeluqueriaPorSlug(PELUQUERIA_SLUG);
  if (!peluqueria) notFound();

  const [servicios, dias] = await Promise.all([
    listarServicios(peluqueria.id),
    listarDiasConAtencion(peluqueria),
  ]);

  const telefonoWhatsapp = peluqueria.telefono?.replace(/\D/g, "") ?? "";

  return (
    <main className="min-h-screen bg-[#f4f4f4] px-4 py-8 text-[#222] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <FlujoReserva
          peluqueriaSlug={peluqueria.slug}
          nombrePeluqueria={peluqueria.nombre}
          servicios={servicios}
          dias={dias}
          linkWhatsapp={`https://wa.me/${telefonoWhatsapp}`}
        />
      </div>
    </main>
  );
}
