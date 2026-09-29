import { Contenedor } from "@/components/layout/Contenedor";
import { FooterAdmin } from "@/components/layout/FooterAdmin";
import { HeaderAdmin } from "@/components/layout/HeaderAdmin";
import { obtenerPeluqueriaActual } from "@/lib/peluquerias/actual";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const peluqueria = await obtenerPeluqueriaActual();

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#222]">
      <HeaderAdmin nombrePeluqueria={peluqueria.nombre} />
      <main className="flex-1 py-8">
        <Contenedor ancho="ancho">{children}</Contenedor>
      </main>
      <FooterAdmin
        nombrePeluqueria={peluqueria.nombre}
        direccion={peluqueria.direccion}
      />
    </div>
  );
}
