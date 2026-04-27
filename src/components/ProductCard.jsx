import { useState } from 'react'

const CERT_COLORS = {
  PSA:     { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)',  text: '#fca5a5' },
  Beckett: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', text: '#93c5fd' },
  CGC:     { bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.4)',  text: '#86efac' },
  PCG:     { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)', text: '#d8b4fe' },
}

export default function ProductCard({ product, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)

  const badge = product.certification || (product.category === 'gradeadas_pcg' ? 'PCG' : null)
  const certStyle = badge ? CERT_COLORS[badge] : null

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#091628',
        border: `1px solid ${hovered ? 'rgba(92,200,224,0.2)' : '#0d2540'}`,
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(92,200,224,0.15)' : 'none',
      }}
    >
      {/* Image */}
      <div style={{
        aspectRatio: '3/4',
        background: '#060c1a',
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
              transition: 'opacity 0.4s, transform 0.5s',
              display: 'block',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            color: '#163860', gap: '0.5rem',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>Sin imagen</span>
          </div>
        )}

        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(3,8,16,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.25s',
          backdropFilter: hovered ? 'blur(2px)' : 'none',
        }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(92,200,224,0.15)',
              border: '1px solid rgba(92,200,224,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#5cc8e0',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <span style={{
              fontSize: '0.6875rem', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#e8f4ff',
            }}>
              Ver detalles
            </span>
          </div>
        </div>

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
          color: '#e8f4ff',
          margin: 0,
          lineHeight: 1.3,
          flex: 1,
        }}>
          {product.name}
        </h3>

        {product.description && (
          <p style={{
            fontSize: '0.8125rem',
            color: '#3d7090',
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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.625rem' }}>
          <p style={{
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: '#5cc8e0',
            margin: 0,
            letterSpacing: '0.01em',
          }}>
            {Number(product.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </p>
          {(product.wallapop_url || product.vinted_url) && (
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {product.wallapop_url && (
                <span style={{
                  fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em',
                  padding: '0.15rem 0.4rem', borderRadius: '4px',
                  background: 'rgba(241,90,36,0.12)', border: '1px solid rgba(241,90,36,0.3)',
                  color: '#f15a24',
                }}>WP</span>
              )}
              {product.vinted_url && (
                <span style={{
                  fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em',
                  padding: '0.15rem 0.4rem', borderRadius: '4px',
                  background: 'rgba(9,177,186,0.12)', border: '1px solid rgba(9,177,186,0.3)',
                  color: '#09b1ba',
                }}>VT</span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
