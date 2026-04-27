import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { href: '#compra-venta', label: 'Compra / Venta' },
  { href: '#singles', label: 'Singles' },
  { href: '#gradeadas-pcg', label: 'PCG' },
  { href: '#gradeadas-psa', label: 'PSA · CGC' },
  { href: '#packs', label: 'Packs' },
  { href: '#eventos', label: 'Eventos' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'background 0.3s, box-shadow 0.3s',
        background: scrolled ? 'rgba(3,8,16,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 rgba(22,56,96,0.5)' : 'none',
      }}
    >
      <nav style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <a
          href="#inicio"
          onClick={e => handleNavClick(e, '#inicio')}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: '#e8f4ff',
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          Defsune<span style={{ color: '#5cc8e0' }}>TCG</span>
        </a>

        {/* Desktop nav */}
        <ul style={{
          display: 'none',
          gap: '0.25rem',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
          className="desktop-nav"
        >
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={e => handleNavClick(e, link.href)}
                style={{
                  color: '#90c0dc',
                  textDecoration: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  padding: '0.375rem 0.625rem',
                  borderRadius: '6px',
                  transition: 'color 0.2s, background 0.2s',
                  display: 'block',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#e8f4ff'
                  e.currentTarget.style.background = 'rgba(22,56,96,0.5)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#90c0dc'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Abrir menú"
          className="hamburger-btn"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '0.5rem', color: '#90c0dc',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {menuOpen ? (
              <>
                <line x1="3" y1="3" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="19" y1="3" x2="3" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </>
            ) : (
              <>
                <line x1="3" y1="5" x2="19" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="17" x2="19" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(3,8,16,0.98)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid #163860',
          padding: '1rem 1.5rem 1.5rem',
        }}>
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => handleNavClick(e, link.href)}
              style={{
                display: 'block',
                color: '#90c0dc',
                textDecoration: 'none',
                fontSize: '0.9375rem',
                fontWeight: 500,
                padding: '0.75rem 0',
                borderBottom: '1px solid #0d2540',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#e8f4ff'}
              onMouseLeave={e => e.currentTarget.style.color = '#90c0dc'}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .hamburger-btn { display: none !important; }
        }
      `}</style>
    </header>
  )
}
