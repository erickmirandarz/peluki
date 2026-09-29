import { obtenerTurnoPorToken } from "@/lib/turnos/obtener-por-token";
import { sePuedeCancelar } from "@/lib/turnos/reglas";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  try {
    const turno = await obtenerTurnoPorToken(token, { incluirCancelados: true });
    if (!turno) {
      return Response.json({ error: "No encontramos ese turno." }, { status: 404 });
    }
    return Response.json({
      turno: turno.confirmado,
      estado: turno.estado,
      metodoPago: turno.metodoPago,
      puedeCancelar: sePuedeCancelar(turno.estado, turno.inicio),
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "No pudimos cargar el turno." },
      { status: 500 },
    );
  }
}
