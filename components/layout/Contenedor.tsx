interface Props {
  children: React.ReactNode;
  className?: string;
  ancho?: "contenido" | "ancho";
}

export function Contenedor({
  children,
  className = "",
  ancho = "contenido",
}: Props) {
  const maximo = ancho === "ancho" ? "max-w-7xl" : "max-w-2xl";
  return (
    <div className={`mx-auto w-full ${maximo} px-4 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
