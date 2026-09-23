import "server-only";

import { createHash, randomBytes } from "node:crypto";

export function hashearToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/** El token va en el enlace privado del cliente; en la base solo se guarda su hash. */
export function generarTokenGestion() {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashearToken(token) };
}
