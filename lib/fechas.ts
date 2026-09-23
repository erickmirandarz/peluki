// Las fechas locales se manejan como "YYYY-MM-DD" y las horas como "HH:mm",
// siempre en la zona horaria de la peluquería.

const NOMBRES_DIA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function partesEnZona(instante: Date, zona: string) {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: zona,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instante);

  const valor = (tipo: string) =>
    Number(partes.find((parte) => parte.type === tipo)?.value);

  return {
    anio: valor("year"),
    mes: valor("month"),
    dia: valor("day"),
    hora: valor("hour"),
    minuto: valor("minute"),
    segundo: valor("second"),
  };
}

function aTexto(numero: number) {
  return String(numero).padStart(2, "0");
}

export function esFechaValida(fecha: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const utc = new Date(Date.UTC(anio, mes - 1, dia));
  return utc.getUTCMonth() === mes - 1 && utc.getUTCDate() === dia;
}

export function esHoraValida(hora: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
}

export function fechaLocalHoy(zona: string, ahora = new Date()) {
  const { anio, mes, dia } = partesEnZona(ahora, zona);
  return `${anio}-${aTexto(mes)}-${aTexto(dia)}`;
}

export function sumarDias(fecha: string, dias: number) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const utc = new Date(Date.UTC(anio, mes - 1, dia + dias));
  return `${utc.getUTCFullYear()}-${aTexto(utc.getUTCMonth() + 1)}-${aTexto(utc.getUTCDate())}`;
}

/** 0 = domingo … 6 = sábado, igual que horarios_trabajo.dia_semana. */
export function diaSemana(fecha: string) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia)).getUTCDay();
}

export function nombreDia(fecha: string) {
  return NOMBRES_DIA[diaSemana(fecha)];
}

/** Convierte una fecha y hora locales de la zona indicada al instante UTC correspondiente. */
export function horaLocalAUtc(fecha: string, hora: string, zona: string) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const [horas, minutos] = hora.split(":").map(Number);
  const comoSiFueraUtc = Date.UTC(anio, mes - 1, dia, horas, minutos);

  const enZona = partesEnZona(new Date(comoSiFueraUtc), zona);
  const desfaseMs =
    Date.UTC(
      enZona.anio,
      enZona.mes - 1,
      enZona.dia,
      enZona.hora,
      enZona.minuto,
      enZona.segundo,
    ) - comoSiFueraUtc;

  return new Date(comoSiFueraUtc - desfaseMs);
}

/** "09:00:00" (columna time de Postgres) → minutos desde medianoche. */
export function horaAMinutos(hora: string) {
  const [horas, minutos] = hora.split(":").map(Number);
  return horas * 60 + minutos;
}

export function minutosAHora(minutos: number) {
  return `${aTexto(Math.floor(minutos / 60))}:${aTexto(minutos % 60)}`;
}
