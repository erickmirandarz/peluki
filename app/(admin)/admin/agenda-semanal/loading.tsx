import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function CargandoAgenda() {
  return (
    <section aria-busy="true" aria-label="Cargando agenda">
      <div className="border-b border-[#E5E5E5] pb-6">
        <LoadingSkeleton className="h-8 w-48" />
        <LoadingSkeleton className="mt-2 h-4 w-56" />
      </div>
      <div className="mt-5 overflow-hidden rounded-lg border border-[#E5E5E5]">
        <div className="grid grid-cols-1 divide-y divide-[#E5E5E5] md:grid-cols-7 md:divide-x md:divide-y-0">
          {Array.from({ length: 7 }, (_, indice) => (
            <div key={indice} className="space-y-3 p-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="space-y-1.5">
                  <LoadingSkeleton className="h-3.5 w-14" />
                  <LoadingSkeleton className="h-3 w-10" />
                </div>
                <LoadingSkeleton className="size-6 rounded-full" />
              </div>
              <LoadingSkeleton className="h-20" />
              <LoadingSkeleton className="h-20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
