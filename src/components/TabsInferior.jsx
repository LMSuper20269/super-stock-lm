export default function TabsInferior({ pantalla, onCambiar }) {
  return (
    <div className="tabs-bottom">
      <button
        className={`tab-item ${pantalla === 'stock' ? 'activo' : ''}`}
        onClick={() => onCambiar('stock')}
      >
        <span className="icono">📋</span>
        Stock
      </button>
      <button
        className={`tab-item ${pantalla === 'reportes' ? 'activo' : ''}`}
        onClick={() => onCambiar('reportes')}
      >
        <span className="icono">📊</span>
        Reportes
      </button>
    </div>
  )
}
