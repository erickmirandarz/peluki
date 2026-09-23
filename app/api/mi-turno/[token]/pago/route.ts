import { registrarPagoEfectivo } from "@/lib/pagos/registrar-efectivo";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const body = await request.json().catch(() => null);
  const metodo = body?.metodo;

  if (metodo === "MERCADO_PAGO") {
    return Response.json(
      { error: "Mercado Pago todavía no está conectado." },
      { status: 501 },
    );
  }

  if (metodo !== "EFECTIVO") {
    return Response.json({ error: "Medio de pago inválido." }, { status: 400 });
  }

  try {
    const turno = await registrarPagoEfectivo(token);
    if (!turno) {
      return Response.json({ error: "No encontramos ese turno." }, { status: 404 });
    }
    return Response.json({ metodo: turno.metodoPago });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "No pudimos guardar el medio de pago." },
      { status: 500 },
    );
  }
}
