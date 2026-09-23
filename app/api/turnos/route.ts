import { esFechaValida, esHoraValida } from "@/lib/fechas";
import { obtenerPeluqueriaPorSlug } from "@/lib/peluquerias/obtener-por-slug";
import { crearTurno } from "@/lib/turnos/crear-turno";

const LARGO_MAXIMO_NOMBRE = 100;

const MENSAJES = {
  TELEFONO_INVALIDO:
    "Revisá el teléfono: código de área sin 0 y número sin 15, por ejemplo 388 123 4567.",
  SERVICIO_NO_ENCONTRADO: "Ese servicio ya no está disponible.",
  HORARIO_NO_DISPONIBLE: "Ese horario ya no está disponible. Elegí otro.",
} as const;

export async function GET() {
  return Response.json(
    { message: "Pendiente de implementar" },
    { status: 501 },
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const { peluqueria: slug, servicioId, fecha, hora, nombre, telefono } =
    body ?? {};

  const esTexto = (valor: unknown): valor is string =>
    typeof valor === "string" && valor.trim().length > 0;

  if (
    !esTexto(slug) ||
    !esTexto(servicioId) ||
    !esTexto(fecha) ||
    !esTexto(hora) ||
    !esTexto(nombre) ||
    !esTexto(telefono)
  ) {
    return Response.json(
      { error: "Completá servicio, día, horario, nombre y teléfono." },
      { status: 400 },
    );
  }

  if (!esFechaValida(fecha) || !esHoraValida(hora)) {
    return Response.json(
      { error: "La fecha u hora no son válidas." },
      { status: 400 },
    );
  }

  if (nombre.trim().length > LARGO_MAXIMO_NOMBRE) {
    return Response.json(
      { error: "El nombre es demasiado largo." },
      { status: 400 },
    );
  }

  try {
    const peluqueria = await obtenerPeluqueriaPorSlug(slug);

    if (!peluqueria) {
      return Response.json(
        { error: "Peluquería no encontrada" },
        { status: 404 },
      );
    }

    const resultado = await crearTurno({
      peluqueria,
      servicioId,
      fecha,
      hora,
      nombre,
      telefono,
      canal: "WEB",
    });

    if (!resultado.ok) {
      const status = resultado.motivo === "HORARIO_NO_DISPONIBLE" ? 409 : 400;
      return Response.json(
        { error: MENSAJES[resultado.motivo], motivo: resultado.motivo },
        { status },
      );
    }

    return Response.json(
      { turno: { id: resultado.turnoId, token: resultado.token } },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "No pudimos guardar el turno. Probá de nuevo." },
      { status: 500 },
    );
  }
}
