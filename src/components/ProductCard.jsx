import { useState } from 'react'

const CERT_COLORS = {
  PSA:     { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)',  text: '#fca5a5' },
  Beckett: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', text: '#93c5fd' },
  CGC:     { bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.4)',  text: '#86efac' },
  PCG:     { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)', text: '#d8b4fe' },
}

export default function ProductCard({ product }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const badge = product.certification || (product.category === 'gradeadas_pcg' ? 'PCG' : null)
  const certStyle = badge ? CERT_COLORS[badge] : null

  return (
    <article style={{
      background: '#112035',
      border: '1px solid #1a304f',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
      cursor: 'default',
      display: 'flex',
      flexDirection: 'column',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,106,0.15)'
        e.currentTarget.style.borderColor = 'rgba(212,175,106,0.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = '#1a304f'
      }}
    >
      {/* Image */}
      <div style={{
        aspectRatio: '3/4',
        background: '#0a1628',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {!imgLoaded && !imgError && (
          <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />
        )}
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.4s, transform 0.4s',
              display: 'block',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: '#244068',
            gap: '0.5rem',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>Sin imagen</span>
          </div>
        )}

        {/* Badge */}
        {badge && certStyle && (
          <div style={{
            position: 'absolute', top: '0.625rem', right: '0.625rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
            background: certStyle.bg,
            border: `1px solid ${certStyle.border}`,
            color: certStyle.text,
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            backdropFilter: 'blur(4px)',
          }}>
            {badge}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '0.875rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: 500,
          color: '#f0f6ff',
          margin: 0,
          lineHeight: 1.3,
          flex: 1,
        }}>
          {product.name}
        </h3>

        {product.description && (
          <p style={{
            fontSize: '0.8125rem',
            color: '#5c6880',
            margin: '0.25rem 0 0',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.description}
          </p>
        )}

        <p style={{
          fontSize: '1.0625rem',
          fontWeight: 600,
          color: '#d4af6a',
          margin: '0.625rem 0 0',
          letterSpacing: '0.01em',
        }}>
          {Number(product.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
        </p>
      </div>
    </article>
  )
}
