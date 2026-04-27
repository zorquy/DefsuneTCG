const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/defsunetcg',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
      </svg>
    ),
    color: '#c0cad8',
  },
  {
    label: 'Wallapop',
    href: 'https://wallapop.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14.5l-4-4 1.5-1.5 2.5 2.5 5.5-5.5 1.5 1.5-7 7z"/>
      </svg>
    ),
    color: '#c0cad8',
  },
  {
    label: 'Vinted',
    href: 'https://vinted.es',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
      </svg>
    ),
    color: '#c0cad8',
  },
]

export default function Hero() {
  return (
    <section
      id="inicio"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '6rem 1.5rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(36,64,104,0.35) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(36,64,104,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(36,64,104,0.08) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Logo mark */}
      <div
        className="animate-fade-in-up"
        style={{
          width: 72, height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a304f 0%, #244068 100%)',
          border: '1px solid rgba(212,175,106,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '2rem',
          boxShadow: '0 0 30px rgba(212,175,106,0.15)',
          position: 'relative',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M6 8h24a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#d4af6a" strokeWidth="1.5"/>
          <circle cx="18" cy="18" r="5" stroke="#d4af6a" strokeWidth="1.5"/>
          <circle cx="18" cy="18" r="2" fill="#d4af6a"/>
        </svg>
      </div>

      {/* Title */}
      <h1
        className="animate-fade-in-up animate-delay-100"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 10vw, 6.5rem)',
          fontWeight: 600,
          letterSpacing: '0.08em',
          lineHeight: 1,
          textTransform: 'uppercase',
          margin: '0 0 1rem',
          color: '#f0f6ff',
          position: 'relative',
        }}
      >
        Defsune<span style={{ color: '#d4af6a' }}>TCG</span>
      </h1>

      {/* Tagline */}
      <p
        className="animate-fade-in-up animate-delay-200"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1rem, 3vw, 1.4rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: '#8892a4',
          marginBottom: '0.5rem',
          letterSpacing: '0.04em',
        }}
      >
        Coleccionables TCG de confianza
      </p>
      <p
        className="animate-fade-in-up animate-delay-300"
        style={{
          fontSize: '0.875rem',
          color: '#5c6880',
          marginBottom: '2.5rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Vendedor particular · Operaciones por contacto directo
      </p>

      {/* Social buttons */}
      <div
        className="animate-fade-in-up animate-delay-400"
        style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}
      >
        {SOCIAL_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              border: '1px solid #244068',
              borderRadius: '999px',
              color: '#c0cad8',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              background: 'rgba(17,32,53,0.6)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.25s',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#d4af6a'
              e.currentTarget.style.color = '#f0f6ff'
              e.currentTarget.style.background = 'rgba(212,175,106,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#244068'
              e.currentTarget.style.color = '#c0cad8'
              e.currentTarget.style.background = 'rgba(17,32,53,0.6)'
            }}
          >
            {link.icon}
            {link.label}
          </a>
        ))}
      </div>

      {/* Scroll indicator */}
      <div
        className="animate-fade-in-up animate-delay-500"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <span style={{ fontSize: '0.75rem', color: '#5c6880', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Explorar catálogo
        </span>
        <div style={{
          width: 24, height: 40,
          border: '1px solid #244068',
          borderRadius: 12,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          paddingTop: '6px',
        }}>
          <div style={{
            width: 4, height: 8,
            borderRadius: 2,
            background: '#d4af6a',
            animation: 'scrollDot 1.8s ease infinite',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50%       { transform: translateY(12px); opacity: 0.3; }
        }
      `}</style>
    </section>
  )
}
