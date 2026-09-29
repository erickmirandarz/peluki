import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function CargandoDashboard() {
  return (
    <section aria-busy="true" aria-label="Cargando dashboard">
      <div className="mb-6 border-b border-[#E5E5E5] pb-6">
        <LoadingSkeleton className="h-8 w-40" />
        <LoadingSkeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <LoadingSkeleton className="h-28 rounded-lg" />
        <LoadingSkeleton className="h-28 rounded-lg" />
      </div>
      <LoadingSkeleton className="mt-6 h-64 rounded-lg" />
    </section>
  );
}
