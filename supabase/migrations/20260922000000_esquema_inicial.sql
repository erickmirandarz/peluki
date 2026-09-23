-- =========================================================
-- Peluki — Esquema inicial
-- =========================================================

-- Necesaria para impedir turnos superpuestos del mismo profesional
create extension if not exists btree_gist with schema extensions;

-- ---------------------------------------------------------
-- Tipos enumerados
-- ---------------------------------------------------------
create type public.rol_perfil          as enum ('DUENO', 'ADMIN');
create type public.estado_turno        as enum ('SIN_CONFIRMAR', 'CONFIRMADO', 'ATENDIDO', 'CANCELADO', 'AUSENTE');
create type public.canal_reserva       as enum ('WEB', 'WHATSAPP', 'ADMIN');
create type public.cancelado_por       as enum ('CLIENTE', 'ADMIN');
create type public.metodo_pago         as enum ('MERCADO_PAGO', 'EFECTIVO');
create type public.estado_pago         as enum ('PENDIENTE', 'PAGADO', 'RECHAZADO', 'A_PAGAR_EN_LOCAL');
create type public.tipo_recordatorio   as enum ('VEINTICUATRO_HORAS', 'DOS_HORAS');
create type public.estado_recordatorio as enum ('PENDIENTE', 'ENVIADO', 'ERROR');

-- ---------------------------------------------------------
-- Función para mantener updated_at
-- ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------
-- peluquerias
-- ---------------------------------------------------------
create table public.peluquerias (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  slug          text not null unique,
  telefono      text,
  direccion     text,
  zona_horaria  text not null default 'America/Argentina/Jujuy',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------
-- perfiles (administradores del panel)
-- ---------------------------------------------------------
create table public.perfiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  peluqueria_id  uuid not null references public.peluquerias (id) on delete cascade,
  nombre         text not null,
  rol            public.rol_perfil not null default 'ADMIN',
  activo         boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------
-- profesionales
-- ---------------------------------------------------------
create table public.profesionales (
  id             uuid primary key default gen_random_uuid(),
  peluqueria_id  uuid not null references public.peluquerias (id) on delete cascade,
  nombre         text not null,
  telefono       text,
  activo         boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------
-- servicios
-- ---------------------------------------------------------
create table public.servicios (
  id                uuid primary key default gen_random_uuid(),
  peluqueria_id     uuid not null references public.peluquerias (id) on delete cascade,
  nombre            text not null,
  descripcion       text,
  duracion_minutos  integer not null check (duracion_minutos > 0),
  precio_centavos   integer not null check (precio_centavos >= 0),
  activo            boolean not null default true,
  created_at        timestamptz not null default now()
);

-- ---------------------------------------------------------
-- profesional_servicios (muchos a muchos)
-- ---------------------------------------------------------
create table public.profesional_servicios (
  profesional_id  uuid not null references public.profesionales (id) on delete cascade,
  servicio_id     uuid not null references public.servicios (id) on delete cascade,
  primary key (profesional_id, servicio_id)
);

-- ---------------------------------------------------------
-- horarios_trabajo
-- ---------------------------------------------------------
create table public.horarios_trabajo (
  id              uuid primary key default gen_random_uuid(),
  profesional_id  uuid not null references public.profesionales (id) on delete cascade,
  dia_semana      smallint not null check (dia_semana between 0 and 6), -- 0 = domingo
  hora_inicio     time not null,
  hora_fin        time not null,
  activo          boolean not null default true,
  check (hora_fin > hora_inicio)
);

-- ---------------------------------------------------------
-- bloqueos_agenda
-- ---------------------------------------------------------
create table public.bloqueos_agenda (
  id              uuid primary key default gen_random_uuid(),
  profesional_id  uuid not null references public.profesionales (id) on delete cascade,
  inicio          timestamptz not null,
  fin             timestamptz not null,
  motivo          text,
  created_at      timestamptz not null default now(),
  check (fin > inicio)
);

-- ---------------------------------------------------------
-- clientes
-- ---------------------------------------------------------
create table public.clientes (
  id                    uuid primary key default gen_random_uuid(),
  peluqueria_id         uuid not null references public.peluquerias (id) on delete cascade,
  nombre_canonico       text not null,
  telefono_original     text not null,
  telefono_normalizado  text not null,
  telefono_verificado   boolean not null default false,
  merged_into_id        uuid references public.clientes (id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (peluqueria_id, telefono_normalizado)
);

-- ---------------------------------------------------------
-- turnos
-- ---------------------------------------------------------
create table public.turnos (
  id                  uuid primary key default gen_random_uuid(),
  peluqueria_id       uuid not null references public.peluquerias (id) on delete restrict,
  cliente_id          uuid not null references public.clientes (id) on delete restrict,
  profesional_id      uuid not null references public.profesionales (id) on delete restrict,
  servicio_id         uuid not null references public.servicios (id) on delete restrict,
  nombre_ingresado    text not null,
  inicio              timestamptz not null,
  fin                 timestamptz not null,
  estado              public.estado_turno not null default 'CONFIRMADO',
  canal               public.canal_reserva not null,
  notas               text,
  token_gestion_hash  text unique,
  cancelado_at        timestamptz,
  cancelado_por       public.cancelado_por,
  motivo_cancelacion  text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  check (fin > inicio),
  -- Un profesional no puede tener dos turnos superpuestos (salvo cancelados)
  constraint turnos_sin_superposicion exclude using gist (
    profesional_id with =,
    tstzrange(inicio, fin, '[)') with &&
  ) where (estado <> 'CANCELADO')
);

-- ---------------------------------------------------------
-- pagos
-- ---------------------------------------------------------
create table public.pagos (
  id                         uuid primary key default gen_random_uuid(),
  turno_id                   uuid not null references public.turnos (id) on delete cascade,
  metodo                     public.metodo_pago not null,
  estado                     public.estado_pago not null default 'PENDIENTE',
  importe_centavos           integer not null check (importe_centavos >= 0),
  moneda                     text not null default 'ARS',
  mercadopago_preference_id  text,
  mercadopago_payment_id     text unique,
  checkout_url               text,
  paid_at                    timestamptz,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

-- ---------------------------------------------------------
-- recordatorios
-- ---------------------------------------------------------
create table public.recordatorios (
  id                    uuid primary key default gen_random_uuid(),
  turno_id              uuid not null references public.turnos (id) on delete cascade,
  tipo                  public.tipo_recordatorio not null,
  programado_para       timestamptz not null,
  estado                public.estado_recordatorio not null default 'PENDIENTE',
  enviado_at            timestamptz,
  proveedor_message_id  text,
  error                 text,
  created_at            timestamptz not null default now(),
  unique (turno_id, tipo)
);

-- ---------------------------------------------------------
-- Triggers de updated_at
-- ---------------------------------------------------------
create trigger peluquerias_updated_at before update on public.peluquerias
  for each row execute function public.set_updated_at();
create trigger clientes_updated_at before update on public.clientes
  for each row execute function public.set_updated_at();
create trigger turnos_updated_at before update on public.turnos
  for each row execute function public.set_updated_at();
create trigger pagos_updated_at before update on public.pagos
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- Índices para las consultas más comunes
-- ---------------------------------------------------------
create index turnos_peluqueria_inicio_idx on public.turnos (peluqueria_id, inicio);
create index turnos_cliente_idx           on public.turnos (cliente_id);
create index turnos_servicio_idx          on public.turnos (servicio_id);
create index pagos_turno_idx              on public.pagos (turno_id);
create index recordatorios_pendientes_idx on public.recordatorios (programado_para)
  where estado = 'PENDIENTE';
create index horarios_profesional_idx     on public.horarios_trabajo (profesional_id);
create index bloqueos_profesional_idx     on public.bloqueos_agenda (profesional_id, inicio);
create index profesionales_peluqueria_idx on public.profesionales (peluqueria_id);
create index servicios_peluqueria_idx     on public.servicios (peluqueria_id);
create index perfiles_peluqueria_idx      on public.perfiles (peluqueria_id);

-- ---------------------------------------------------------
-- Seguridad: RLS activado en todas las tablas
-- ---------------------------------------------------------
alter table public.peluquerias           enable row level security;
alter table public.perfiles              enable row level security;
alter table public.profesionales         enable row level security;
alter table public.servicios             enable row level security;
alter table public.profesional_servicios enable row level security;
alter table public.horarios_trabajo      enable row level security;
alter table public.bloqueos_agenda       enable row level security;
alter table public.clientes              enable row level security;
alter table public.turnos                enable row level security;
alter table public.pagos                 enable row level security;
alter table public.recordatorios         enable row level security;

-- Lectura pública solo de la información del negocio y sus servicios
create policy "Peluquerías visibles públicamente"
  on public.peluquerias for select
  to anon, authenticated
  using (true);

create policy "Servicios activos visibles públicamente"
  on public.servicios for select
  to anon, authenticated
  using (activo);
