import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: authError } = await signIn(email, password)
    if (authError) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
      background: '#0a1628',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#f0f6ff',
            margin: '0 0 0.5rem',
          }}>
            Defsune<span style={{ color: '#d4af6a' }}>TCG</span>
          </p>
          <p style={{ color: '#5c6880', fontSize: '0.875rem', margin: 0 }}>
            Panel de administración
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: '#112035',
            border: '1px solid #244068',
            borderRadius: '16px',
            padding: '2rem',
          }}
        >
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.375rem',
            fontWeight: 500,
            color: '#f0f6ff',
            margin: '0 0 1.5rem',
          }}>
            Acceder
          </h1>

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              color: '#fca5a5',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: '#8892a4',
              marginBottom: '0.375rem',
              letterSpacing: '0.04em',
            }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@email.com"
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                background: '#0a1628',
                border: '1px solid #244068',
                borderRadius: '8px',
                color: '#f0f6ff',
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#d4af6a'}
              onBlur={e => e.target.style.borderColor = '#244068'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: '#8892a4',
              marginBottom: '0.375rem',
              letterSpacing: '0.04em',
            }}>
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                background: '#0a1628',
                border: '1px solid #244068',
                borderRadius: '8px',
                color: '#f0f6ff',
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#d4af6a'}
              onBlur={e => e.target.style.borderColor = '#244068'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? '#1a304f' : 'linear-gradient(135deg, #d4af6a, #c9a05a)',
              border: 'none',
              borderRadius: '8px',
              color: loading ? '#5c6880' : '#040d1a',
              fontWeight: 600,
              fontSize: '0.9375rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.04em',
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
