/** Link para abrir un chat de WhatsApp, o null si no hay teléfono cargado. */
export function linkWhatsapp(telefono: string | null) {
  const digitos = telefono?.replace(/\D/g, "");
  return digitos ? `https://wa.me/${digitos}` : null;
}
