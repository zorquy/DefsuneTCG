export default function SectionHeader({ title, subtitle, accent }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {accent && (
        <span style={{
          display: 'inline-block',
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#d4af6a',
          marginBottom: '0.75rem',
          padding: '0.25rem 0.75rem',
          border: '1px solid rgba(212,175,106,0.3)',
          borderRadius: '999px',
          background: 'rgba(212,175,106,0.06)',
        }}>
          {accent}
        </span>
      )}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 500,
        color: '#f0f6ff',
        margin: '0 0 0.75rem',
        lineHeight: 1.1,
        letterSpacing: '-0.01em',
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          color: '#8892a4',
          fontSize: '0.9375rem',
          maxWidth: '520px',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {subtitle}
        </p>
      )}
      <div style={{
        width: 48, height: 2,
        background: 'linear-gradient(90deg, #d4af6a, transparent)',
        marginTop: '1.25rem',
        borderRadius: 1,
      }} />
    </div>
  )
}
