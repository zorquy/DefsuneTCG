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
      background: '#060c1a',
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
            color: '#e8f4ff',
            margin: '0 0 0.5rem',
          }}>
            Defsune<span style={{ color: '#5cc8e0' }}>TCG</span>
          </p>
          <p style={{ color: '#3d7090', fontSize: '0.875rem', margin: 0 }}>
            Panel de administración
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: '#091628',
            border: '1px solid #163860',
            borderRadius: '16px',
            padding: '2rem',
          }}
        >
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.375rem',
            fontWeight: 500,
            color: '#e8f4ff',
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
              color: '#6aa0bc',
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
                background: '#060c1a',
                border: '1px solid #163860',
                borderRadius: '8px',
                color: '#e8f4ff',
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#5cc8e0'}
              onBlur={e => e.target.style.borderColor = '#163860'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: '#6aa0bc',
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
                background: '#060c1a',
                border: '1px solid #163860',
                borderRadius: '8px',
                color: '#e8f4ff',
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#5cc8e0'}
              onBlur={e => e.target.style.borderColor = '#163860'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: loading ? '#0d2540' : 'linear-gradient(135deg, #5cc8e0, #3aacc4)',
              border: 'none',
              borderRadius: '8px',
              color: loading ? '#3d7090' : '#030810',
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
