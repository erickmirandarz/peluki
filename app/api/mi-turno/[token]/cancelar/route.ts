import { cancelarTurnoPorToken } from "@/lib/turnos/cancelar-turno";

const MENSAJES = {
  NO_ENCONTRADO: "No encontramos ese turno.",
  NO_CANCELABLE: "Este turno ya no se puede cancelar.",
  YA_EMPEZO: "El turno ya empezó y no se puede cancelar.",
} as const;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  try {
    const resultado = await cancelarTurnoPorToken(token);

    if (!resultado.ok) {
      const status = resultado.motivo === "NO_ENCONTRADO" ? 404 : 409;
      return Response.json(
        { error: MENSAJES[resultado.motivo], motivo: resultado.motivo },
        { status },
      );
    }

    return Response.json({
      estado: resultado.turno.estado,
      yaCancelado: resultado.yaCancelado,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "No pudimos cancelar el turno. Probá de nuevo." },
      { status: 500 },
    );
  }
}
