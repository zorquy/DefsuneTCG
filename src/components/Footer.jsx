export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #0d2540',
      padding: '2rem 1.5rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          color: '#3d7090',
          margin: '0 0 0.5rem',
          letterSpacing: '0.08em',
        }}>
          DEFSUNE<span style={{ color: '#5cc8e0' }}>TCG</span>
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#3d7090', margin: 0 }}>
          Vendedor particular · {new Date().getFullYear()} · Todas las operaciones por contacto directo
        </p>
      </div>
    </footer>
  )
}
