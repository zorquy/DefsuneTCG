import SectionHeader from './SectionHeader'

const CONTACT_ITEMS = [
  {
    label: 'Instagram',
    handle: '@defsunetcg',
    href: 'https://instagram.com/defsunetcg',
    color: '#e1306c',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
    color: '#229ED9',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 7.16l-1.68 7.92c-.12.56-.45.7-.9.44l-2.5-1.84-1.2 1.16c-.14.14-.25.25-.5.25l.18-2.52 4.6-4.16c.2-.18-.04-.28-.3-.1L8.1 14.27l-2.44-.76c-.53-.17-.54-.53.11-.78l9.54-3.68c.44-.16.83.1.62.61z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    handle: 'Defsunetcg@gmail.com',
    href: 'mailto:Defsunetcg@gmail.com',
    color: '#5cc8e0',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
]

export default function BuySection() {
  return (
    <section id="compra-venta" style={{
      padding: '5rem 0',
      background: 'linear-gradient(180deg, transparent, rgba(9,22,40,0.4), transparent)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <SectionHeader
          accent="Compra · Venta"
          title="Operaciones directas"
          subtitle="Soy un vendedor particular. Todo se gestiona por contacto directo: negociamos, acordamos el precio y el envío, y listo. Sin intermediarios."
        />

        {/* Info card */}
        <div style={{
          background: 'linear-gradient(135deg, #091628 0%, #060c1a 100%)',
          border: '1px solid #163860',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2.5rem',
          maxWidth: '680px',
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '10px',
              background: 'rgba(92,200,224,0.1)',
              border: '1px solid rgba(92,200,224,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5cc8e0" strokeWidth="1.75">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
            </div>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 500,
                color: '#e8f4ff',
                margin: '0 0 0.5rem',
              }}>
                ¿Cómo funciona?
              </h3>
              <p style={{ color: '#6aa0bc', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                Contacta por cualquiera de los canales de abajo, indícame qué carta o lote te interesa
                y lo gestionamos. También puedes encontrarme en <strong style={{ color: '#90c0dc' }}>Wallapop</strong> y{' '}
                <strong style={{ color: '#90c0dc' }}>Vinted</strong> para compras más formales.
              </p>
            </div>
          </div>
        </div>

        {/* Contact cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1rem',
          maxWidth: '800px',
        }}>
          {CONTACT_ITEMS.map(item => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1.125rem 1.25rem',
                background: '#091628',
                border: '1px solid #0d2540',
                borderRadius: '12px',
                color: '#90c0dc',
                textDecoration: 'none',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = item.color
                e.currentTarget.style.color = '#e8f4ff'
                e.currentTarget.style.boxShadow = `0 0 20px ${item.color}20`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#0d2540'
                e.currentTarget.style.color = '#90c0dc'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ color: item.color, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6, marginBottom: '0.2rem' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{item.handle}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
