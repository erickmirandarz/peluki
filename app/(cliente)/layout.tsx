import { Contenedor } from "@/components/layout/Contenedor";
import { FooterCliente } from "@/components/layout/FooterCliente";
import { HeaderCliente } from "@/components/layout/HeaderCliente";
import { obtenerPeluqueriaActual } from "@/lib/peluquerias/actual";
import { linkWhatsapp } from "@/lib/whatsapp";

export default async function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const peluqueria = await obtenerPeluqueriaActual();
  const whatsapp = linkWhatsapp(peluqueria.telefono);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f4] text-[#222]">
      <HeaderCliente nombrePeluqueria={peluqueria.nombre} whatsapp={whatsapp} />
      <main className="flex-1 py-8 sm:py-12">
        <Contenedor>{children}</Contenedor>
      </main>
      <FooterCliente
        nombrePeluqueria={peluqueria.nombre}
        direccion={peluqueria.direccion}
        whatsapp={whatsapp}
      />
    </div>
  );
}
