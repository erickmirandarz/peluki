export type EstadoTurno =
  | "CONFIRMADO"
  | "SIN_CONFIRMAR"
  | "ATENDIDO"
  | "CANCELADO";

export type EstadoPago = "PENDIENTE" | "PAGADO" | "A_PAGAR_EN_LOCAL";
export type MetodoPago = "MERCADO_PAGO" | "EFECTIVO";
export type CanalReserva = "WEB" | "WHATSAPP";

export interface Servicio {
  id: string;
  nombre: string;
  duracionMinutos: number;
  precio: number;
}

export interface Turno {
  id: string;
  fecha: Date;
  clienteNombre: string;
  clienteTelefono: string;
  estado: EstadoTurno;
  estadoPago: EstadoPago;
  metodoPago?: MetodoPago;
  canal: CanalReserva;
  servicioId: string;
}
