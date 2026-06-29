import { useState } from 'react'

const CATEGORIAS = ['Lácteos', 'Limpieza', 'Almacén', 'Frescos', 'Bebidas', 'Panadería', 'Carnes', 'Higiene', 'Otros']
const UNIDADES = ['unidad', 'kg', 'litro', 'paquete']

export default function PantallaRegistrarCompra({ productos, onVolver, onGuardar, persona }) {
  const [nombre, setNombre] = useState('')
  const [productoExistente, setProductoExistente] = useState(null)
  const [cantidad, setCantidad] = useState('1')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('Otros')
  const [unidad, setUnidad] = useState('unidad')
  const [guardando, setGuardando] = useState(false)

  const sugerencias = nombre.length > 0 && !productoExistente
    ? productos.filter(p => p.nombre.toLowerCase().includes(nombre.toLowerCase())).slice(0, 5)
    : []

  function elegirSugerencia(p) {
    setProductoExistente(p)
    setNombre(p.nombre)
    setCategoria(p.categoria || 'Otros')
    setUnidad(p.unidad || 'unidad')
  }

  function cambiarNombre(valor) {
    setNombre(valor)
    if (productoExistente && valor !== productoExistente.nombre) {
      setProductoExistente(null)
    }
  }

  async function confirmar() {
    if (!nombre.trim() || !cantidad || Number(cantidad) <= 0) return
    setGuardando(true)
    await onGuardar({
      productoExistente,
      nombre: nombre.trim(),
      categoria,
      unidad,
      cantidad: Number(cantidad),
      precio: precio ? Number(precio) : null,
      persona,
    })
    setGuardando(false)
  }

  return (
    <div>
      <div className="top-bar">
        <button className="btn-volver" onClick={onVolver} aria-label="Volver">←</button>
        <h2>Registrar compra</h2>
      </div>

      <div className="contenedor">
        <div className="campo">
          <label>Producto</label>
          <input
            type="text"
            placeholder="Ej: Leche, Detergente..."
            value={nombre}
            onChange={e => cambiarNombre(e.target.value)}
            autoFocus
          />
          {sugerencias.length > 0 && (
            <div className="lista-sugerencias">
              {sugerencias.map(p => (
                <div key={p.id} className="sugerencia-item" onClick={() => elegirSugerencia(p)}>
                  {p.nombre} <span style={{ color: 'var(--gris-texto)' }}>· stock actual: {p.stock}</span>
                </div>
              ))}
            </div>
          )}
          {productoExistente && (
            <p style={{ fontSize: 12, color: 'var(--verde)', margin: '6px 0 0' }}>
              ✓ Producto existente — se va a sumar al stock actual
            </p>
          )}
          {!productoExistente && nombre && (
            <p style={{ fontSize: 12, color: 'var(--celeste-oscuro)', margin: '6px 0 0' }}>
              Producto nuevo — se va a crear en la lista
            </p>
          )}
        </div>

        <div className="fila-campos">
          <div className="campo">
            <label>Cantidad</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={cantidad}
              onChange={e => setCantidad(e.target.value)}
            />
          </div>
          <div className="campo">
            <label>Precio pagado</label>
            <input
              type="number"
              min="0"
              placeholder="Opcional"
              value={precio}
              onChange={e => setPrecio(e.target.value)}
            />
          </div>
        </div>

        {!productoExistente && nombre && (
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
        )}

        <button
          className="btn-principal"
          onClick={confirmar}
          disabled={!nombre.trim() || guardando}
        >
          {guardando ? 'Guardando...' : 'Guardar compra'}
        </button>
      </div>
    </div>
  )
}
