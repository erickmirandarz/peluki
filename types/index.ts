export type EstadoTurno =
  | "SIN_CONFIRMAR"
  | "CONFIRMADO"
  | "ATENDIDO"
  | "CANCELADO"
  | "AUSENTE";

export type EstadoPago =
  | "PENDIENTE"
  | "PAGADO"
  | "RECHAZADO"
  | "A_PAGAR_EN_LOCAL";
export type MetodoPago = "MERCADO_PAGO" | "EFECTIVO";
export type CanalReserva = "WEB" | "WHATSAPP" | "ADMIN";

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string | null;
  duracionMinutos: number;
  /** En pesos. En la base se guarda en centavos (precio_centavos). */
  precio: number;
}

export interface DiaDisponible {
  /** Igual a `fecha`; se usa como key. */
  id: string;
  /** "Lun", "Mar"… */
  etiqueta: string;
  /** Día del mes: "12". */
  numero: string;
  /** "YYYY-MM-DD" en la zona horaria de la peluquería. */
  fecha: string;
}

/** Datos que muestra la pantalla de confirmación. */
export interface TurnoConfirmado {
  servicioNombre: string;
  fecha: string;
  hora: string;
  duracionMinutos: number;
  precio: number;
  nombrePeluqueria: string;
}

export interface Turno {
  id: string;
  peluqueriaId: string;
  clienteId: string;
  profesionalId: string;
  servicioId: string;
  nombreIngresado: string;
  /** ISO 8601 en UTC. */
  inicio: string;
  /** ISO 8601 en UTC. */
  fin: string;
  estado: EstadoTurno;
  canal: CanalReserva;
  notas: string | null;
}
