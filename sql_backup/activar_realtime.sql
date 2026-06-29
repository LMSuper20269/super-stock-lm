-- Activar sincronización en tiempo real para que todos los celulares
-- vean los cambios al instante
alter publication supabase_realtime add table productos;
alter publication supabase_realtime add table movimientos;
