import { actualizarEstadoTurno } from "@/lib/turnos/actualizar-estado";
import type { EstadoTurno } from "@/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const estado = body?.estado as EstadoTurno | undefined;

  if (!estado) {
    return Response.json({ error: "Falta el estado." }, { status: 400 });
  }

  try {
    const resultado = await actualizarEstadoTurno(id, estado);
    if (!resultado.ok) {
      const status = resultado.motivo === "NO_ENCONTRADO" ? 404 : 400;
      return Response.json({ error: "No se pudo actualizar el turno." }, { status });
    }
    return Response.json({ estado: resultado.estado });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "No pudimos actualizar el turno." },
      { status: 500 },
    );
  }
}
