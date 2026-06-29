-- Tabla de productos
create table productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  categoria text default 'Otros',
  unidad text default 'unidad',
  stock numeric not null default 0,
  stock_minimo numeric default 1,
  ultimo_precio numeric,
  creado_en timestamptz default now()
);

-- Tabla de movimientos (compras y consumos)
create table movimientos (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid references productos(id) on delete cascade,
  tipo text not null check (tipo in ('compra', 'consumo')),
  cantidad numeric not null,
  precio numeric,
  persona text,
  creado_en timestamptz default now()
);

-- Activar seguridad por fila (RLS)
alter table productos enable row level security;
alter table movimientos enable row level security;

-- Política simple: como es una app familiar privada (sin login),
-- permitimos lectura y escritura abierta con la clave anon.
-- (más adelante se puede restringir si se agrega login)
create policy "Acceso total productos" on productos
  for all using (true) with check (true);

create policy "Acceso total movimientos" on movimientos
  for all using (true) with check (true);

-- Índice para que las consultas de historial de precios sean rápidas
create index idx_movimientos_producto on movimientos(producto_id, creado_en desc);
