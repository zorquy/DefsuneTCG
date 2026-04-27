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
    color: '#90c0dc',
  },
  {
    label: 'Wallapop',
    href: 'https://wallapop.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14.5l-4-4 1.5-1.5 2.5 2.5 5.5-5.5 1.5 1.5-7 7z"/>
      </svg>
    ),
    color: '#90c0dc',
  },
  {
    label: 'Vinted',
    href: 'https://vinted.es',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
      </svg>
    ),
    color: '#90c0dc',
  },
]

export default function Hero() {
  return (
    <section
      id="inicio"
      style={{
        minHeight: '100svh',
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
      {/* Background — Lugia orb glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: [
          'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(22,56,96,0.55) 0%, rgba(9,22,40,0.2) 55%, transparent 75%)',
          'radial-gradient(ellipse 40% 30% at 50% 42%, rgba(92,200,224,0.07) 0%, transparent 60%)',
        ].join(', '),
        pointerEvents: 'none',
      }} />
      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(22,56,96,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(22,56,96,0.06) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Logo mark */}
      <div
        className="animate-fade-in-up"
        style={{
          marginBottom: '2rem',
          position: 'relative',
          filter: 'drop-shadow(0 0 32px rgba(92,200,224,0.3))',
        }}
      >
        <img
          src="/logo.png"
          alt="DefsuneTCG"
          style={{
            width: 140, height: 140,
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
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
          color: '#e8f4ff',
          position: 'relative',
        }}
      >
        Defsune<span style={{ color: '#5cc8e0' }}>TCG</span>
      </h1>

      {/* Tagline */}
      <p
        className="animate-fade-in-up animate-delay-200"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
          fontWeight: 400,
          color: '#6aa0bc',
          marginBottom: '0.5rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        Coleccionables TCG de confianza
      </p>
      <p
        className="animate-fade-in-up animate-delay-300"
        style={{
          fontSize: '0.875rem',
          color: '#3d7090',
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
              border: '1px solid #163860',
              borderRadius: '999px',
              color: '#90c0dc',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              background: 'rgba(9,22,40,0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'all 0.25s',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#5cc8e0'
              e.currentTarget.style.color = '#e8f4ff'
              e.currentTarget.style.background = 'rgba(92,200,224,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#163860'
              e.currentTarget.style.color = '#90c0dc'
              e.currentTarget.style.background = 'rgba(9,22,40,0.6)'
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
        <span style={{ fontSize: '0.75rem', color: '#3d7090', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Explorar catálogo
        </span>
        <div style={{
          width: 24, height: 40,
          border: '1px solid #163860',
          borderRadius: 12,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          paddingTop: '6px',
        }}>
          <div style={{
            width: 4, height: 8,
            borderRadius: 2,
            background: '#5cc8e0',
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
