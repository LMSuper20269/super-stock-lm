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

const ORDEN_CATEGORIAS = ['Lácteos', 'Frescos', 'Carnes', 'Panadería', 'Almacén', 'Bebidas', 'Limpieza', 'Higiene', 'Otros']

export default function PantallaStock({ productos, onConsumir, onAbrirCompra, onEliminar, onEditar, cargando, gastoMes }) {
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('alfabetico') // 'alfabetico' | 'stock'

  const filtrados = ordenar(
    productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())),
    orden
  )

  const cantidadStockBajo = productos.filter(p => p.stock <= (p.stock_minimo ?? 1)).length

  return (
    <div>
      <div className="app-header">
        <h1>🛒 Super Stock LM</h1>
        <p className="subt">
          {cantidadStockBajo > 0
            ? `${cantidadStockBajo} producto${cantidadStockBajo > 1 ? 's' : ''} con stock bajo`
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

        <div className="fila-campos" style={{ marginBottom: 8 }}>
          <div className="campo" style={{ flex: 2, marginBottom: 0 }}>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          <div className="campo" style={{ flex: 1, marginBottom: 0 }}>
            <select value={orden} onChange={e => setOrden(e.target.value)}>
              <option value="alfabetico">A - Z</option>
              <option value="stock">Stock ↑</option>
            </select>
          </div>
        </div>

        {cargando && <p className="vacio">Cargando...</p>}

        {!cargando && filtrados.length === 0 && (
          <div className="vacio">
            <div className="icono-grande">📦</div>
            <p>{busqueda ? 'No se encontró ese producto' : 'Todavía no hay productos. Registrá tu primera compra.'}</p>
          </div>
        )}

        {!cargando && agruparPorCategoria(filtrados).map(grupo => (
          <div key={grupo.categoria}>
            <p className="chip-categoria">{iconoDe(grupo.categoria)} {grupo.categoria}</p>
            {grupo.items.map(p => (
              <FilaProducto
                key={p.id}
                producto={p}
                onConsumir={onConsumir}
                onEliminar={onEliminar}
                onEditar={onEditar}
                bajo={p.stock <= (p.stock_minimo ?? 1)}
              />
            ))}
          </div>
        ))}
      </div>

      <button className="fab" onClick={onAbrirCompra} aria-label="Registrar compra">+</button>
    </div>
  )
}

function agruparPorCategoria(productos) {
  const grupos = {}
  productos.forEach(p => {
    const cat = p.categoria || 'Otros'
    if (!grupos[cat]) grupos[cat] = []
    grupos[cat].push(p)
  })

  return Object.entries(grupos)
    .map(([categoria, items]) => ({ categoria, items }))
    .sort((a, b) => {
      const ia = ORDEN_CATEGORIAS.indexOf(a.categoria)
      const ib = ORDEN_CATEGORIAS.indexOf(b.categoria)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
    })
}

function ordenar(lista, criterio) {
  const copia = [...lista]
  if (criterio === 'stock') {
    return copia.sort((a, b) => Number(a.stock) - Number(b.stock))
  }
  return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
}

function FilaProducto({ producto, onConsumir, onEliminar, onEditar, bajo }) {
  function manejarEliminar() {
    const confirmado = window.confirm(`¿Eliminar "${producto.nombre}" de la lista? Esto borra también su historial de precios.`)
    if (confirmado) onEliminar(producto)
  }

  return (
    <div className="card producto-card">
      <div className="producto-card-fila">
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
      <div className="fila-acciones">
        <button className="btn-accion-texto" onClick={() => onEditar(producto)}>✎ editar</button>
        <button className="btn-accion-texto" onClick={manejarEliminar}>🗑 quitar</button>
      </div>
    </div>
  )
}

