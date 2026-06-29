import { useState } from 'react'

const ICONOS_CATEGORIA = {
  'Lácteos': '🥛',
  'Limpieza': '🧴',
  'Almacén': '🥫',
  'Frescos': '🥦',
  'Bebidas': '🥤',
  'Panadería': '🍞',
  'Carnes': '🥩',
  'Higiene': '🧼',
  'Otros': '📦',
}

function iconoDe(categoria) {
  return ICONOS_CATEGORIA[categoria] || ICONOS_CATEGORIA['Otros']
}

export default function PantallaStock({ productos, onConsumir, onAbrirCompra, cargando, gastoMes }) {
  const [busqueda, setBusqueda] = useState('')

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const stockBajo = productos.filter(p => p.stock <= (p.stock_minimo ?? 1))

  return (
    <div>
      <div className="app-header">
        <h1>🛒 Super Stock LM</h1>
        <p className="subt">
          {stockBajo.length > 0
            ? `${stockBajo.length} producto${stockBajo.length > 1 ? 's' : ''} con stock bajo`
            : 'Todo en orden por ahora'}
        </p>
      </div>

      <div className="contenedor">
        <div className="fila-stats">
          <div className="card-stat">
            <p className="label">Productos totales</p>
            <p className="valor">{productos.length}</p>
          </div>
          <div className="card-stat">
            <p className="label">Gasto este mes</p>
            <p className="valor">${gastoMes.toLocaleString('es-AR')}</p>
          </div>
        </div>

        <div className="campo" style={{ marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        {stockBajo.length > 0 && !busqueda && (
          <>
            <p className="seccion-titulo">Stock bajo — para comprar</p>
            {stockBajo.map(p => (
              <FilaProducto key={p.id} producto={p} onConsumir={onConsumir} bajo />
            ))}
          </>
        )}

        <p className="seccion-titulo">
          {busqueda ? `Resultados (${filtrados.length})` : 'Todos los productos'}
        </p>

        {cargando && <p className="vacio">Cargando...</p>}

        {!cargando && filtrados.length === 0 && (
          <div className="vacio">
            <div className="icono-grande">📦</div>
            <p>{busqueda ? 'No se encontró ese producto' : 'Todavía no hay productos. Registrá tu primera compra.'}</p>
          </div>
        )}

        {!cargando && filtrados
          .filter(p => busqueda || !stockBajo.includes(p))
          .map(p => (
            <FilaProducto key={p.id} producto={p} onConsumir={onConsumir} />
          ))}
      </div>

      <button className="fab" onClick={onAbrirCompra} aria-label="Registrar compra">+</button>
    </div>
  )
}

function FilaProducto({ producto, onConsumir, bajo }) {
  return (
    <div className="card producto-card">
      <div className="producto-icono">{iconoDe(producto.categoria)}</div>
      <div className="producto-info">
        <p className="nombre">
          {producto.nombre}
          {bajo && <span className="badge-bajo">bajo</span>}
        </p>
        <p className="meta">
          {producto.ultimo_precio
            ? `Último precio: $${Number(producto.ultimo_precio).toLocaleString('es-AR')}`
            : 'Sin precio registrado'}
        </p>
      </div>
      <div className="contador">
        <button
          className="btn-circ"
          onClick={() => onConsumir(producto, -1)}
          disabled={producto.stock <= 0}
          aria-label="Restar"
        >−</button>
        <span className="num">{producto.stock}</span>
        <button
          className="btn-circ"
          onClick={() => onConsumir(producto, 1)}
          aria-label="Sumar"
        >+</button>
      </div>
    </div>
  )
}

