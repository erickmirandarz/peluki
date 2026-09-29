import type { Metadata } from "next";

import { Dashboard } from "@/components/dashboard/Dashboard";
import { obtenerPeluqueriaActual } from "@/lib/peluquerias/actual";
import {
  obtenerResumenDashboard,
  periodoValido,
} from "@/lib/turnos/resumen-dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const peluqueria = await obtenerPeluqueriaActual();
  const { periodo: periodoParam } = await searchParams;
  const periodo = periodoValido(periodoParam);
  const resumen = await obtenerResumenDashboard(peluqueria, periodo);

  return <Dashboard periodo={periodo} resumen={resumen} />;
}
