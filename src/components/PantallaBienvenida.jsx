import { useState } from 'react'

export default function PantallaBienvenida({ onConfirmar }) {
  const [nombre, setNombre] = useState('')

  return (
    <div className="contenedor" style={{ paddingTop: 60, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>🛒</div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Super Stock LM</h1>
      <p style={{ color: 'var(--gris-texto)', fontSize: 14, marginBottom: 28 }}>
        Antes de empezar, decinos tu nombre para identificar quién hizo cada movimiento.
      </p>
      <div className="campo" style={{ textAlign: 'left' }}>
        <label>Tu nombre</label>
        <input
          type="text"
          placeholder="Ej: Victor"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          autoFocus
        />
      </div>
      <button
        className="btn-principal"
        disabled={!nombre.trim()}
        onClick={() => onConfirmar(nombre.trim())}
      >
        Entrar
      </button>
    </div>
  )
}
