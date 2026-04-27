import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Inicio',    to: '/' },
  { label: 'Catálogo',  to: '/catalogo' },
  { label: 'Eventos',   to: '/eventos' },
  { label: 'Contacto',  to: 'contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleContactClick = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  const linkStyle = (active) => ({
    color: active ? '#5cc8e0' : '#90c0dc',
    textDecoration: 'none',
    fontSize: '0.8125rem',
    fontWeight: 500,
    letterSpacing: '0.04em',
    padding: '0.375rem 0.625rem',
    borderRadius: '6px',
    transition: 'color 0.2s, background 0.2s',
    display: 'block',
    background: active ? 'rgba(92,200,224,0.08)' : 'transparent',
  })

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'background 0.3s, box-shadow 0.3s',
      background: scrolled ? 'rgba(3,8,16,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
      boxShadow: scrolled ? '0 1px 0 rgba(22,56,96,0.5)' : 'none',
    }}>
      <nav style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <img
            src="/logo.png"
            alt="DefsuneTCG"
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#e8f4ff',
          }}>
            Defsune<span style={{ color: '#5cc8e0' }}>TCG</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="desktop-nav" style={{
          display: 'none', gap: '0.25rem',
          listStyle: 'none', margin: 0, padding: 0,
        }}>
          {NAV_LINKS.map(link => (
            <li key={link.to}>
              {link.to === 'contacto' ? (
                <a
                  href="#contacto"
                  onClick={handleContactClick}
                  style={linkStyle(false)}
                  onMouseEnter={e => { e.currentTarget.style.color = '#e8f4ff'; e.currentTarget.style.background = 'rgba(22,56,96,0.5)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#90c0dc'; e.currentTarget.style.background = 'transparent' }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.to}
                  style={linkStyle(isActive(link.to))}
                  onMouseEnter={e => { if (!isActive(link.to)) { e.currentTarget.style.color = '#e8f4ff'; e.currentTarget.style.background = 'rgba(22,56,96,0.5)' } }}
                  onMouseLeave={e => { if (!isActive(link.to)) { e.currentTarget.style.color = '#90c0dc'; e.currentTarget.style.background = 'transparent' } }}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Abrir menú"
          className="hamburger-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: '#90c0dc' }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {menuOpen ? (
              <>
                <line x1="3" y1="3" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="19" y1="3" x2="3" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </>
            ) : (
              <>
                <line x1="3" y1="5"  x2="19" y2="5"  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid #163860',
          padding: '0.5rem 1.5rem 1.25rem',
        }}>
          {NAV_LINKS.map(link => (
            link.to === 'contacto' ? (
              <a
                key="contacto"
                href="#contacto"
                onClick={handleContactClick}
                style={{
                  display: 'block', color: '#90c0dc', textDecoration: 'none',
                  fontSize: '0.9375rem', fontWeight: 500,
                  padding: '0.75rem 0', borderBottom: '1px solid #0d2540',
                }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'block', textDecoration: 'none',
                  fontSize: '0.9375rem', fontWeight: 500,
                  padding: '0.75rem 0', borderBottom: '1px solid #0d2540',
                  color: isActive(link.to) ? '#5cc8e0' : '#90c0dc',
                }}
              >
                {link.label}
              </Link>
            )
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav   { display: flex !important; }
          .hamburger-btn { display: none !important; }
        }
      `}</style>
    </header>
  )
}
