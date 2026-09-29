"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function ErrorAgenda({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="No pudimos cargar la agenda de la semana"
      message="Revisá tu conexión e intentá nuevamente."
      onReintentar={reset}
    />
  );
}
