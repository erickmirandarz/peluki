import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function CargandoTurnosHoy() {
  return (
    <section aria-busy="true" aria-label="Cargando turnos">
      <div className="mb-6 border-b border-[#E5E5E5] pb-6">
        <LoadingSkeleton className="h-8 w-48" />
        <LoadingSkeleton className="mt-2 h-4 w-56" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-md border border-[#E5E5E5] p-4"
          >
            <div className="flex w-1/2 items-center gap-8">
              <LoadingSkeleton className="h-5 w-12" />
              <div className="w-full max-w-[200px] space-y-2">
                <LoadingSkeleton className="h-4 w-3/4" />
                <LoadingSkeleton className="h-3 w-1/2" />
              </div>
            </div>
            <LoadingSkeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </section>
  );
}
