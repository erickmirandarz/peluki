interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Contenedor({ children, className = "" }: Props) {
  return (
    <div className={`mx-auto w-full max-w-2xl px-4 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
