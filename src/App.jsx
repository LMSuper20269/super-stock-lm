import { useState, useEffect, useMemo } from 'react'
import { supabase } from './supabaseClient'
import PantallaBienvenida from './components/PantallaBienvenida'
import PantallaStock from './components/PantallaStock'
import PantallaRegistrarCompra from './components/PantallaRegistrarCompra'
import PantallaReportes from './components/PantallaReportes'
import TabsInferior from './components/TabsInferior'

export default function App() {
  const [persona, setPersona] = useState(() => localStorage.getItem('persona_nombre') || '')
  const [pantalla, setPantalla] = useState('stock')
  const [vista, setVista] = useState('lista')
  const [productos, setProductos] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!persona) return
    cargarDatos()

    const canalProductos = supabase
      .channel('productos-cambios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, () => {
        cargarProductos()
      })
      .subscribe()

    const canalMovimientos = supabase
      .channel('movimientos-cambios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'movimientos' }, () => {
        cargarMovimientos()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(canalProductos)
      supabase.removeChannel(canalMovimientos)
    }
  }, [persona])

  async function cargarDatos() {
    setCargando(true)
    await Promise.all([cargarProductos(), cargarMovimientos()])
    setCargando(false)
  }

  async function cargarProductos() {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('nombre', { ascending: true })
    if (!error) setProductos(data || [])
  }

  async function cargarMovimientos() {
    const { data, error } = await supabase
      .from('movimientos')
      .select('*')
      .order('creado_en', { ascending: false })
      .limit(500)
    if (!error) setMovimientos(data || [])
  }

  function confirmarPersona(nombre) {
    localStorage.setItem('persona_nombre', nombre)
    setPersona(nombre)
  }

  async function consumir(producto, delta) {
    const nuevoStock = Math.max(0, Number(producto.stock) + delta)

    await supabase
      .from('productos')
      .update({ stock: nuevoStock })
      .eq('id', producto.id)

    await supabase.from('movimientos').insert({
      producto_id: producto.id,
      tipo: 'consumo',
      cantidad: Math.abs(delta),
      persona,
    })

    cargarProductos()
    cargarMovimientos()
  }

  async function guardarCompra({ productoExistente, nombre, categoria, unidad, cantidad, precio, persona: quien }) {
    let productoId = productoExistente?.id

    if (productoExistente) {
      const nuevoStock = Number(productoExistente.stock) + cantidad
      await supabase
        .from('productos')
        .update({
          stock: nuevoStock,
          ultimo_precio: precio ?? productoExistente.ultimo_precio,
        })
        .eq('id', productoExistente.id)
    } else {
      const { data, error } = await supabase
        .from('productos')
        .insert({
          nombre,
          categoria,
          unidad,
          stock: cantidad,
          ultimo_precio: precio,
        })
        .select()
        .single()
      if (error) {
        alert('Hubo un error al guardar el producto: ' + error.message)
        return
      }
      productoId = data.id
    }

    await supabase.from('movimientos').insert({
      producto_id: productoId,
      tipo: 'compra',
      cantidad,
      precio,
      persona: quien,
    })

    await cargarDatos()
    setVista('lista')
  }

  async function eliminarProducto(producto) {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', producto.id)

    if (error) {
      alert('No se pudo eliminar: ' + error.message)
      return
    }

    cargarProductos()
    cargarMovimientos()
  }

  const gastoMes = useMemo(() => {
    const ahora = new Date()
    return Math.round(
      movimientos
        .filter(m => m.tipo === 'compra' && m.precio)
        .filter(m => {
          const f = new Date(m.creado_en)
          return f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear()
        })
        .reduce((acc, m) => acc + Number(m.precio) * Number(m.cantidad), 0)
    )
  }, [movimientos])

  if (!persona) {
    return <PantallaBienvenida onConfirmar={confirmarPersona} />
  }

  if (vista === 'compra') {
    return (
      <PantallaRegistrarCompra
        productos={productos}
        persona={persona}
        onVolver={() => setVista('lista')}
        onGuardar={guardarCompra}
      />
    )
  }

  return (
    <div>
      {pantalla === 'stock' && (
        <PantallaStock
          productos={productos}
          cargando={cargando}
          gastoMes={gastoMes}
          onConsumir={consumir}
          onAbrirCompra={() => setVista('compra')}
          onEliminar={eliminarProducto}
        />
      )}
      {pantalla === 'reportes' && (
        <PantallaReportes movimientos={movimientos} productos={productos} />
      )}
      <TabsInferior pantalla={pantalla} onCambiar={setPantalla} />
    </div>
  )
}
