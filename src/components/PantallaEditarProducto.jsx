import { useState } from 'react'

const CATEGORIAS = ['Lácteos', 'Limpieza', 'Almacén', 'Frescos', 'Bebidas', 'Panadería', 'Carnes', 'Higiene', 'Otros']
const UNIDADES = ['unidad', 'kg', 'litro', 'paquete']

export default function PantallaEditarProducto({ producto, onVolver, onGuardar, onEliminar }) {
  const [nombre, setNombre] = useState(producto.nombre)
  const [categoria, setCategoria] = useState(producto.categoria || 'Otros')
  const [unidad, setUnidad] = useState(producto.unidad || 'unidad')
  const [stock, setStock] = useState(String(producto.stock))
  const [ultimoPrecio, setUltimoPrecio] = useState(producto.ultimo_precio ? String(producto.ultimo_precio) : '')
  const [guardando, setGuardando] = useState(false)

  async function confirmar() {
    if (!nombre.trim() || stock === '' || Number(stock) < 0) return
    setGuardando(true)
    await onGuardar(producto.id, {
      nombre: nombre.trim(),
      categoria,
      unidad,
      stock: Number(stock),
      ultimo_precio: ultimoPrecio ? Number(ultimoPrecio) : null,
    })
    setGuardando(false)
  }

  function manejarEliminar() {
    const confirmado = window.confirm(`¿Eliminar "${producto.nombre}" de la lista? Esto borra también su historial de precios.`)
    if (confirmado) onEliminar(producto)
  }

  return (
    <div>
      <div className="top-bar">
        <button className="btn-volver" onClick={onVolver} aria-label="Volver">←</button>
        <h2>Editar producto</h2>
      </div>

      <div className="contenedor">
        <div className="campo">
          <label>Nombre</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} autoFocus />
        </div>

        <div className="fila-campos">
          <div className="campo">
            <label>Categoría</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)}>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="campo">
            <label>Unidad</label>
            <select value={unidad} onChange={e => setUnidad(e.target.value)}>
              {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="fila-campos">
          <div className="campo">
            <label>Stock actual</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={stock}
              onChange={e => setStock(e.target.value)}
            />
          </div>
          <div className="campo">
            <label>Último precio</label>
            <input
              type="number"
              min="0"
              placeholder="Opcional"
              value={ultimoPrecio}
              onChange={e => setUltimoPrecio(e.target.value)}
            />
          </div>
        </div>

        <button
          className="btn-principal"
          onClick={confirmar}
          disabled={!nombre.trim() || guardando}
        >
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>

        <button
          className="btn-eliminar-grande"
          onClick={manejarEliminar}
          style={{ marginTop: 10 }}
        >
          🗑 Eliminar producto
        </button>
      </div>
    </div>
  )
}
