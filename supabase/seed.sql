-- Datos de prueba: una peluquería, su profesional, tres servicios
-- y horario de lunes a sábado de 9 a 18 h. Precios en centavos.

with p as (
  insert into public.peluquerias (nombre, slug, telefono, direccion)
  values ('Peluquería de Marta', 'marta', '+5493880000000', 'Centro, San Salvador de Jujuy')
  returning id
),
prof as (
  insert into public.profesionales (peluqueria_id, nombre)
  select id, 'Marta' from p
  returning id, peluqueria_id
),
serv as (
  insert into public.servicios (peluqueria_id, nombre, duracion_minutos, precio_centavos)
  select prof.peluqueria_id, s.nombre, s.duracion, s.precio
  from prof,
       (values ('Corte',    30, 1500000),
               ('Color',    90, 4500000),
               ('Brushing', 45, 2000000)) as s (nombre, duracion, precio)
  returning id
),
ps as (
  insert into public.profesional_servicios (profesional_id, servicio_id)
  select prof.id, serv.id from prof, serv
)
insert into public.horarios_trabajo (profesional_id, dia_semana, hora_inicio, hora_fin)
select prof.id, d, '09:00', '18:00'
from prof, generate_series(1, 6) as d;
