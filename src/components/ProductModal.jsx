import { useEffect, useState, useRef } from 'react'

const CERT_COLORS = {
  PSA:     { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)',  text: '#fca5a5' },
  Beckett: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', text: '#93c5fd' },
  CGC:     { bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.4)',  text: '#86efac' },
  PCG:     { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)', text: '#d8b4fe' },
}

function ActionLink({ href, color, icon, label, target = '_blank' }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.625rem',
        padding: '0.6rem 1rem',
        border: `1px solid ${hovered ? color : color + '40'}`,
        borderRadius: '10px',
        color: hovered ? '#e8f4ff' : '#90c0dc',
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: 500,
        background: hovered ? color + '14' : 'transparent',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
    >
      <span style={{ color, flexShrink: 0, display: 'flex' }}>{icon}</span>
      {label}
    </a>
  )
}

export default function ProductModal({ product, onClose }) {
  const allImages = (product.images?.length > 0)
    ? product.images
    : [product.image_url].filter(Boolean)

  const [idx,        setIdx]        = useState(0)
  const [imgLoaded,  setImgLoaded]  = useState(false)
  const [imgError,   setImgError]   = useState(false)
  const touchStartX = useRef(null)

  const hasMultiple = allImages.length > 1
  const currentSrc  = allImages[idx] ?? null

  const prev = () => { setImgLoaded(false); setImgError(false); setIdx(i => (i - 1 + allImages.length) % allImages.length) }
  const next = () => { setImgLoaded(false); setImgError(false); setIdx(i => (i + 1) % allImages.length) }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft'  && hasMultiple) prev()
      if (e.key === 'ArrowRight' && hasMultiple) next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose, hasMultiple, idx])

  // Reset image state when idx changes
  useEffect(() => { setImgLoaded(false); setImgError(false) }, [idx])

  const badge     = product.certification || (product.category === 'gradeadas_pcg' ? 'PCG' : null)
  const certStyle = badge ? CERT_COLORS[badge] : null

  const formatPrice = (p) => Number(p).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })

  const instagramUrl = 'https://ig.me/m/defsunetcg'
  const telegramUrl  = 'https://t.me/Defsune'
  const emailUrl     = `mailto:Defsunetcg@gmail.com?subject=${encodeURIComponent(`Consulta — ${product.name}`)}&body=${encodeURIComponent(`Hola,\n\nMe interesa la carta "${product.name}" que tienes en el catálogo. ¿Está disponible?\n\nGracias.`)}`

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(3,8,16,0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
    >
      <div
        className="modal-layout"
        style={{
          width: '100%', maxWidth: 840,
          background: 'linear-gradient(160deg, #0a1e38 0%, #060c1a 100%)',
          border: '1px solid #163860',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(92,200,224,0.06)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem', zIndex: 10,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(6,12,26,0.8)',
            border: '1px solid #163860',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#6aa0bc', cursor: 'pointer',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#5cc8e0'; e.currentTarget.style.color = '#e8f4ff' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#163860'; e.currentTarget.style.color = '#6aa0bc' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Image panel */}
        <div
          className="modal-img-panel"
          style={{ width: '42%', flexShrink: 0, background: '#060c1a', position: 'relative', minHeight: 360 }}
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={e => {
            if (touchStartX.current === null || !hasMultiple) return
            const dx = e.changedTouches[0].clientX - touchStartX.current
            if (dx > 45) prev()
            else if (dx < -45) next()
            touchStartX.current = null
          }}
        >
          {!imgLoaded && !imgError && currentSrc && (
            <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />
          )}

          {currentSrc && !imgError ? (
            <img
              key={currentSrc}
              src={currentSrc}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center top',
                display: 'block',
                opacity: imgLoaded ? 1 : 0,
                transition: 'opacity 0.3s',
              }}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              color: '#163860', gap: '0.75rem',
            }}>
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="m21 15-5-5L5 21"/>
              </svg>
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.06em' }}>Sin imagen</span>
            </div>
          )}

          {/* Cert badge */}
          {badge && certStyle && (
            <div style={{
              position: 'absolute', top: '1rem', left: '1rem',
              padding: '0.3rem 0.75rem', borderRadius: '8px',
              background: certStyle.bg, border: `1px solid ${certStyle.border}`,
              color: certStyle.text, fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.08em',
              backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
            }}>
              {badge}
            </div>
          )}

          {/* Prev/Next arrows */}
          {hasMultiple && (
            <>
              <button onClick={prev} style={{
                position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(6,12,26,0.75)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#e8f4ff', cursor: 'pointer', backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)', zIndex: 2,
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M8 2L4 6l4 4"/>
                </svg>
              </button>
              <button onClick={next} style={{
                position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(6,12,26,0.75)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#e8f4ff', cursor: 'pointer', backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)', zIndex: 2,
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 2l4 4-4 4"/>
                </svg>
              </button>
            </>
          )}

          {/* Dots */}
          {hasMultiple && (
            <div style={{
              position: 'absolute', bottom: '0.75rem', left: 0, right: 0,
              display: 'flex', justifyContent: 'center', gap: '0.375rem', zIndex: 2,
            }}>
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setImgLoaded(false); setImgError(false); setIdx(i) }}
                  style={{
                    width: i === idx ? 16 : 6, height: 6,
                    borderRadius: 3,
                    background: i === idx ? '#5cc8e0' : 'rgba(255,255,255,0.3)',
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
          )}

          {/* Gradient right edge */}
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: 32,
            background: 'linear-gradient(90deg, transparent, rgba(10,30,56,0.4))',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Details panel */}
        <div className="modal-details" style={{
          flex: 1, padding: '2rem 2rem 2rem 1.75rem',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
          overflowY: 'auto', maxHeight: '90vh',
        }}>
          <div style={{ paddingRight: '2.5rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
              fontWeight: 600, color: '#e8f4ff',
              margin: '0 0 0.75rem', lineHeight: 1.2,
            }}>
              {product.name}
            </h2>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem', fontWeight: 700,
              color: '#5cc8e0', margin: 0,
              letterSpacing: '0.02em', lineHeight: 1,
            }}>
              {formatPrice(product.price)}
            </p>
          </div>

          {product.description && (
            <div style={{
              padding: '0.875rem 1rem',
              background: 'rgba(22,56,96,0.2)',
              border: '1px solid #0d2540', borderRadius: '10px',
            }}>
              <p style={{ color: '#6aa0bc', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>
                {product.description}
              </p>
            </div>
          )}

          <div style={{ height: 1, background: 'linear-gradient(90deg, #163860, transparent)' }} />

          <div>
            <p style={{
              fontSize: '0.6875rem', textTransform: 'uppercase',
              letterSpacing: '0.12em', color: '#3d7090', margin: '0 0 0.75rem',
            }}>
              Contactar / Comprar
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {product.wallapop_url && (
                <ActionLink href={product.wallapop_url} color="#f15a24" label="Ver en Wallapop"
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14.5l-4-4 1.5-1.5 2.5 2.5 5.5-5.5 1.5 1.5-7 7z"/></svg>}
                />
              )}
              {product.vinted_url && (
                <ActionLink href={product.vinted_url} color="#09b1ba" label="Ver en Vinted"
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/></svg>}
                />
              )}
              <ActionLink href={instagramUrl} color="#e1306c" label="Preguntar por Instagram"
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>}
              />
              <ActionLink href={telegramUrl} color="#229ED9" label="Preguntar por Telegram"
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.93 7.16l-1.68 7.92c-.12.56-.45.7-.9.44l-2.5-1.84-1.2 1.16c-.14.14-.25.25-.5.25l.18-2.52 4.6-4.16c.2-.18-.04-.28-.3-.1L8.1 14.27l-2.44-.76c-.53-.17-.54-.53.11-.78l9.54-3.68c.44-.16.83.1.62.61z"/></svg>}
              />
              <ActionLink href={emailUrl} color="#5cc8e0" label="Enviar email (con asunto ya escrito)" target="_self"
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>}
              />
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#3d7090', margin: 0, lineHeight: 1.5 }}>
            Vendedor particular · Las operaciones se cierran por contacto directo
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .modal-layout {
            flex-direction: column !important;
            height: 88svh !important;
            max-height: 88svh !important;
          }
          .modal-img-panel {
            width: 100% !important;
            height: 220px !important;
            min-height: 0 !important;
            max-height: 220px !important;
            flex-shrink: 0 !important;
          }
          .modal-details {
            flex: 1 !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow-y: auto !important;
            padding: 1.25rem 1.25rem 1.5rem !important;
          }
        }
      `}</style>
    </div>
  )
}
