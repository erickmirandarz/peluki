import Link from "next/link";

export function EmptyState({
  message,
  accionHref,
  accionTexto,
  compacto = false,
}: {
  message: string;
  accionHref?: string;
  accionTexto?: string;
  compacto?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-md border border-[#E5E5E5] bg-white px-6 ${compacto ? "py-20" : "min-h-[480px] p-8"}`}
    >
      <div className="mx-auto max-w-md text-center">
        <p className="text-base text-[#222222]">{message}</p>
        {accionHref && accionTexto && (
          <Link
            href={accionHref}
            className="mt-6 inline-flex h-10 items-center gap-1.5 rounded bg-[#E8542A] px-6 text-sm font-medium text-white transition-colors hover:bg-[#d44820]"
          >
            <span className="text-lg leading-none">+</span> {accionTexto}
          </Link>
        )}
      </div>
    </div>
  );
}
