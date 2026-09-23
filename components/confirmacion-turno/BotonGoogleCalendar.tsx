interface Props {
  onClick: () => void;
}

export function BotonGoogleCalendar({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9D9D9] px-5 py-3 text-base font-medium text-[#222222] transition-colors hover:bg-[#F4F4F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8542A]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
      Agregar a Google Calendar
    </button>
  );
}
