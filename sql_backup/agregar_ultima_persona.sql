-- Agrega una columna para saber quién hizo el último movimiento de cada producto
alter table productos add column if not exists ultima_persona text;
