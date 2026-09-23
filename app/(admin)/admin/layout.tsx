import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav aria-label="Navegación del panel">
        <Link href="/admin/turnos-hoy">Turnos de hoy</Link>
        {" · "}
        <Link href="/admin/agenda-semanal">Agenda semanal</Link>
      </nav>
      <main>{children}</main>
    </>
  );
}
