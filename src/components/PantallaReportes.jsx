import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORES = ['#75AADB', '#4A86C4', '#A8CBE8', '#0B3D5C', '#9BC4E2', '#6FA0CC', '#C5DDF0']

export default function PantallaReportes({ movimientos, productos }) {
  const gastoPorMes = useMemo(() => calcularGastoPorMes(movimientos), [movimientos])
  const gastoPorCategoria = useMemo(() => calcularGastoPorCategoria(movimientos, productos), [movimientos, productos])
  const totalMesActual = gastoPorMes.length > 0 ? gastoPorMes[gastoPorMes.length - 1].total : 0
  const subiendoPrecio = useMemo(() => productosConSubidaPrecio(movimientos, productos), [movimientos, productos])

  return (
    <div>
      <div className="top-bar">
        <h2>Reportes de gasto</h2>
      </div>

      <div className="contenedor">
        <div className="fila-stats">
          <div className="card-stat">
            <p className="label">Gasto este mes</p>
            <p className="valor">${totalMesActual.toLocaleString('es-AR')}</p>
          </div>
          <div className="card-stat">
            <p className="label">Compras registradas</p>
            <p className="valor">{movimientos.filter(m => m.tipo === 'compra').length}</p>
          </div>
        </div>

        <p className="seccion-titulo">Gasto por mes</p>
        {gastoPorMes.length === 0 ? (
          <div className="vacio"><p>Todavía no hay compras registradas.</p></div>
        ) : (
          <div className="card" style={{ height: 220, padding: '14px 8px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gastoPorMes}>
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#6B7785' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7785' }} axisLine={false} tickLine={false} width={50} />
                <Tooltip formatter={(v) => `$${Number(v).toLocaleString('es-AR')}`} />
                <Bar dataKey="total" fill="#75AADB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <p className="seccion-titulo">Gasto por categoría (este mes)</p>
        {gastoPorCategoria.length === 0 ? (
          <div className="vacio"><p>Sin datos todavía.</p></div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 130, height: 130, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={gastoPorCategoria} dataKey="total" nameKey="categoria" innerRadius={32} outerRadius={60}>
                    {gastoPorCategoria.map((_, i) => (
                      <Cell key={i} fill={COLORES[i % COLORES.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1 }}>
              {gastoPorCategoria.map((c, i) => (
                <div key={c.categoria} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORES[i % COLORES.length], display: 'inline-block' }} />
                  <span style={{ flex: 1 }}>{c.categoria}</span>
                  <span style={{ fontWeight: 600 }}>${c.total.toLocaleString('es-AR')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="seccion-titulo">Precios que subieron</p>
        {subiendoPrecio.length === 0 ? (
          <div className="vacio"><p>No hay suficientes compras repetidas todavía para comparar.</p></div>
        ) : (
          subiendoPrecio.map(p => (
            <div key={p.nombre} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{p.nombre}</span>
              <span style={{ fontSize: 13 }}>
                ${p.anterior.toLocaleString('es-AR')} → <strong style={{ color: 'var(--rojo)' }}>${p.actual.toLocaleString('es-AR')}</strong>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function calcularGastoPorMes(movimientos) {
  const compras = movimientos.filter(m => m.tipo === 'compra' && m.precio)
  const porMes = {}
  compras.forEach(m => {
    const fecha = new Date(m.creado_en)
    const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
    const label = fecha.toLocaleDateString('es-AR', { month: 'short' })
    if (!porMes[clave]) porMes[clave] = { mes: label, total: 0, orden: clave }
    porMes[clave].total += Number(m.precio) * Number(m.cantidad)
  })
  return Object.values(porMes)
    .sort((a, b) => a.orden.localeCompare(b.orden))
    .slice(-6)
    .map(m => ({ mes: m.mes, total: Math.round(m.total) }))
}

function calcularGastoPorCategoria(movimientos, productos) {
  const ahora = new Date()
  const mesActual = ahora.getMonth()
  const anioActual = ahora.getFullYear()
  const porCategoria = {}

  movimientos
    .filter(m => m.tipo === 'compra' && m.precio)
    .filter(m => {
      const f = new Date(m.creado_en)
      return f.getMonth() === mesActual && f.getFullYear() === anioActual
    })
    .forEach(m => {
      const producto = productos.find(p => p.id === m.producto_id)
      const cat = producto?.categoria || 'Otros'
      porCategoria[cat] = (porCategoria[cat] || 0) + Number(m.precio) * Number(m.cantidad)
    })

  return Object.entries(porCategoria)
    .map(([categoria, total]) => ({ categoria, total: Math.round(total) }))
    .sort((a, b) => b.total - a.total)
}

function productosConSubidaPrecio(movimientos, productos) {
  const porProducto = {}
  movimientos
    .filter(m => m.tipo === 'compra' && m.precio)
    .forEach(m => {
      if (!porProducto[m.producto_id]) porProducto[m.producto_id] = []
      porProducto[m.producto_id].push(m)
    })

  const resultado = []
  Object.entries(porProducto).forEach(([productoId, lista]) => {
    if (lista.length < 2) return
    const ordenada = lista.sort((a, b) => new Date(a.creado_en) - new Date(b.creado_en))
    const actual = ordenada[ordenada.length - 1]
    const anterior = ordenada[ordenada.length - 2]
    if (Number(actual.precio) > Number(anterior.precio)) {
      const producto = productos.find(p => p.id === productoId)
      resultado.push({
        nombre: producto?.nombre || 'Producto',
        actual: Number(actual.precio),
        anterior: Number(anterior.precio),
      })
    }
  })
  return resultado.slice(0, 5)
}
