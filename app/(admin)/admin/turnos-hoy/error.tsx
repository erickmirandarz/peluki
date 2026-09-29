"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function ErrorTurnosHoy({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="No pudimos cargar los turnos de hoy"
      message="Revisá tu conexión e intentá nuevamente."
      onReintentar={reset}
    />
  );
}
