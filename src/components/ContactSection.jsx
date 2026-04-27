const LINKS = [
  {
    label: 'Instagram',
    handle: '@defsunetcg',
    href: 'https://instagram.com/defsunetcg',
    desc: 'DM directo',
    color: '#e1306c',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Telegram',
    handle: '@Defsune',
    href: 'https://t.me/Defsune',
    desc: 'Respuesta rápida',
    color: '#229ED9',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 7.16l-1.68 7.92c-.12.56-.45.7-.9.44l-2.5-1.84-1.2 1.16c-.14.14-.25.25-.5.25l.18-2.52 4.6-4.16c.2-.18-.04-.28-.3-.1L8.1 14.27l-2.44-.76c-.53-.17-.54-.53.11-.78l9.54-3.68c.44-.16.83.1.62.61z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    handle: 'Defsunetcg@gmail.com',
    href: 'mailto:Defsunetcg@gmail.com',
    desc: 'Para consultas formales',
    color: '#5cc8e0',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
]

export default function ContactSection() {
  return (
    <section id="contacto" style={{
      padding: '5rem 0 6rem',
      background: 'linear-gradient(180deg, transparent, rgba(3,8,16,0.6))',
    }}>
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem',
        textAlign: 'center',
      }}>
        <span style={{
          display: 'inline-block',
          fontSize: '0.6875rem', fontWeight: 600,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#5cc8e0', marginBottom: '1rem',
          padding: '0.25rem 0.75rem',
          border: '1px solid rgba(92,200,224,0.3)',
          borderRadius: '999px',
          background: 'rgba(92,200,224,0.06)',
        }}>
          Contacto
        </span>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 500,
          color: '#e8f4ff',
          margin: '0 0 0.75rem',
          lineHeight: 1.1,
        }}>
          ¿Hablamos?
        </h2>
        <p style={{
          color: '#6aa0bc', fontSize: '0.9375rem',
          maxWidth: '420px', lineHeight: 1.7,
          margin: '0 auto 3rem',
        }}>
          Estoy disponible por Instagram, Telegram o email para cualquier consulta sobre compras, ventas o cambios.
        </p>

        <div style={{
          display: 'flex', gap: '1rem',
          justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                padding: '1.75rem 2rem',
                background: '#091628',
                border: '1px solid #0d2540',
                borderRadius: '16px',
                color: '#90c0dc',
                textDecoration: 'none',
                minWidth: 180,
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = link.color
                e.currentTarget.style.color = '#e8f4ff'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3), 0 0 0 1px ${link.color}40`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#0d2540'
                e.currentTarget.style.color = '#90c0dc'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ color: link.color }}>{link.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.2rem' }}>{link.handle}</div>
                <div style={{ fontSize: '0.8125rem', opacity: 0.6 }}>{link.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
