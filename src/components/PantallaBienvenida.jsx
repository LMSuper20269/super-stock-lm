import { useState } from 'react'

const CLAVE_FAMILIAR = 'super'

export default function PantallaBienvenida({ onConfirmar }) {
  const [nombre, setNombre] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState(false)

  function manejarEntrar() {
    if (clave.trim().toLowerCase() !== CLAVE_FAMILIAR) {
      setError(true)
      return
    }
    onConfirmar(nombre.trim())
  }

  return (
    <div className="contenedor" style={{ paddingTop: 60, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>🛒</div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Super Stock LM</h1>
      <p style={{ color: 'var(--gris-texto)', fontSize: 14, marginBottom: 28 }}>
        Decinos tu nombre y la clave familiar para entrar.
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
      <div className="campo" style={{ textAlign: 'left' }}>
        <label>Clave familiar</label>
        <input
          type="password"
          placeholder="Pedísela a quien armó la app"
          value={clave}
          onChange={e => { setClave(e.target.value); setError(false) }}
        />
        {error && (
          <p style={{ fontSize: 12, color: 'var(--rojo)', margin: '6px 0 0' }}>
            Esa clave no es correcta. Probá de nuevo.
          </p>
        )}
      </div>
      <button
        className="btn-principal"
        disabled={!nombre.trim() || !clave.trim()}
        onClick={manejarEntrar}
      >
        Entrar
      </button>
    </div>
  )
}
