import { obtenerTurnoPorToken } from "@/lib/turnos/obtener-por-token";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  try {
    const turno = await obtenerTurnoPorToken(token);
    if (!turno) {
      return Response.json({ error: "No encontramos ese turno." }, { status: 404 });
    }
    return Response.json({
      turno: turno.confirmado,
      estado: turno.estado,
      metodoPago: turno.metodoPago,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "No pudimos cargar el turno." },
      { status: 500 },
    );
  }
}
