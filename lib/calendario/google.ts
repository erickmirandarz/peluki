/** Link para agregar el turno a Google Calendar (se abre en una pestaña nueva). */
export function linkGoogleCalendar({
  titulo,
  inicio,
  fin,
  descripcion,
}: {
  titulo: string;
  inicio: Date;
  fin: Date;
  descripcion?: string;
}) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: titulo,
    dates: `${aUtc(inicio)}/${aUtc(fin)}`,
  });
  if (descripcion) params.set("details", descripcion);
  return `https://calendar.google.com/calendar/render?${params}`;
}

function aUtc(fecha: Date) {
  return fecha.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
