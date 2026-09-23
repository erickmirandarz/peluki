const LARGO_NUMERO_NACIONAL = 10;

/**
 * Normaliza un celular argentino al formato +549 + código de área + número (10 dígitos).
 * Acepta variantes con +54, 9, 0 inicial o el 15 después del código de área.
 * Devuelve null si no puede interpretarlo sin ambigüedad.
 */
export function normalizarTelefono(entrada: string): string | null {
  let digitos = entrada.replace(/\D/g, "");

  if (digitos.startsWith("00")) digitos = digitos.slice(2);

  if (digitos.startsWith("54")) {
    digitos = digitos.slice(2);
    if (digitos.startsWith("9")) digitos = digitos.slice(1);
  }

  if (digitos.startsWith("0")) digitos = digitos.slice(1);

  if (digitos.length === LARGO_NUMERO_NACIONAL + 2) {
    // Los códigos de área tienen 2, 3 o 4 dígitos; el "15" va justo después.
    const candidatos = [2, 3, 4]
      .filter((largoArea) => digitos.slice(largoArea, largoArea + 2) === "15")
      .map(
        (largoArea) =>
          digitos.slice(0, largoArea) + digitos.slice(largoArea + 2),
      );

    if (candidatos.length !== 1) return null;
    digitos = candidatos[0];
  }

  if (digitos.length !== LARGO_NUMERO_NACIONAL) return null;

  return `+549${digitos}`;
}
