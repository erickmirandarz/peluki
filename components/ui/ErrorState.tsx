export function ErrorState({
  title = "No pudimos cargar los datos",
  message,
  onReintentar,
}: {
  title?: string;
  message: string;
  onReintentar?: () => void;
}) {
  return (
    <div
      role="alert"
      className="min-h-[480px] rounded-lg border border-[#E5E5E5] bg-white p-8"
    >
      <div className="max-w-lg">
        <h2 className="mb-1.5 text-base font-semibold text-[#222222]">{title}</h2>
        <p className="mb-6 text-[13px] text-[#666666]">{message}</p>
        {onReintentar && (
          <button
            type="button"
            onClick={onReintentar}
            className="h-10 rounded border border-[#E8542A] px-5 text-sm font-medium text-[#E8542A] transition-colors hover:bg-[#E8542A] hover:text-white"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
