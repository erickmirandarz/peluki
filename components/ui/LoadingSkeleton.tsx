export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-[#F4F4F4] ${className}`}
    />
  );
}
