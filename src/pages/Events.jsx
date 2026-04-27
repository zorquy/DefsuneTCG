import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer'

function EventCard({ event, isPast }) {
  const date    = new Date(event.date + 'T00:00:00')
  const day     = date.getDate()
  const month   = date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()
  const year    = date.getFullYear()
  const weekday = date.toLocaleDateString('es-ES', { weekday: 'long' })
  const fullDate = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{
      display: 'flex', gap: '1.25rem', alignItems: 'stretch',
      opacity: isPast ? 0.45 : 1,
      transition: 'opacity 0.2s',
    }}>
      {/* Timeline line + dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
          background: isPast ? '#163860' : '#5cc8e0',
          border: isPast ? '2px solid #163860' : '2px solid #5cc8e0',
          boxShadow: isPast ? 'none' : '0 0 10px rgba(92,200,224,0.5)',
          marginTop: 20,
        }} />
        <div style={{
          width: 1, flex: 1, minHeight: 24,
          background: isPast ? 'linear-gradient(180deg, #163860, #0d2540)' : 'linear-gradient(180deg, #5cc8e0, #163860)',
          marginTop: 4,
          opacity: 0.4,
        }} />
      </div>

      {/* Card */}
      <div style={{
        flex: 1, marginBottom: '1rem',
        background: isPast ? 'rgba(9,22,40,0.3)' : '#091628',
        border: '1px solid',
        borderColor: isPast ? '#0d2540' : '#163860',
        borderRadius: '14px',
        overflow: 'hidden',
        display: 'flex',
      }}
        onMouseEnter={e => { if (!isPast) e.currentTarget.style.borderColor = 'rgba(92,200,224,0.35)' }}
        onMouseLeave={e => { if (!isPast) e.currentTarget.style.borderColor = '#163860' }}
      >
        {/* Date block */}
        <div style={{
          width: 72, flexShrink: 0,
          background: isPast
            ? 'rgba(13,37,64,0.4)'
            : 'linear-gradient(160deg, rgba(22,56,96,0.8), rgba(13,37,64,0.6))',
          borderRight: `1px solid ${isPast ? '#0d2540' : 'rgba(92,200,224,0.15)'}`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '1rem 0.5rem', gap: '0.125rem',
        }}>
          <span style={{
            fontSize: '2rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700, lineHeight: 1,
            color: isPast ? '#3d7090' : '#5cc8e0',
          }}>
            {day}
          </span>
          <span style={{
            fontSize: '0.6875rem', fontWeight: 600,
            letterSpacing: '0.1em',
            color: isPast ? '#3d7090' : '#6aa0bc',
          }}>
            {month}
          </span>
          <span style={{
            fontSize: '0.6875rem',
            color: isPast ? '#163860' : '#3d7090',
          }}>
            {year}
          </span>
        </div>

        {/* Details */}
        <div style={{
          flex: 1, padding: '1rem 1.25rem',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.375rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.0625rem', fontWeight: 600,
              color: isPast ? '#3d7090' : '#e8f4ff',
              margin: 0, lineHeight: 1.2,
            }}>
              {event.name}
            </h3>
            {!isPast && (
              <span style={{
                flexShrink: 0,
                padding: '0.2rem 0.625rem',
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: '999px',
                color: '#86efac',
                fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                Próximo
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: isPast ? '#163860' : '#3d7090', fontSize: '0.8125rem' }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}>
              <path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z"/>
              <circle cx="7" cy="5" r="1.5"/>
            </svg>
            <span>{event.location}</span>
          </div>

          <div style={{ fontSize: '0.75rem', color: isPast ? '#163860' : '#3d7090', textTransform: 'capitalize' }}>
            {fullDate}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Events() {
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
      if (!error) setEvents(data ?? [])
      setLoading(false)
    }
    fetchEvents()
  }, [])

  const today    = new Date(); today.setHours(0, 0, 0, 0)
  const upcoming = events.filter(e => new Date(e.date + 'T00:00:00') >= today)
  const past     = events.filter(e => new Date(e.date + 'T00:00:00') < today).reverse()

  return (
    <>
      {/* Page header */}
      <div style={{
        paddingTop: '64px',
        background: 'linear-gradient(180deg, rgba(9,22,40,0.6) 0%, transparent 100%)',
        borderBottom: '1px solid #0d2540',
      }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2.5rem 1.5rem 2rem' }}>
          <span style={{
            display: 'inline-block',
            fontSize: '0.6875rem', fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#5cc8e0', marginBottom: '0.5rem',
            padding: '0.2rem 0.625rem',
            border: '1px solid rgba(92,200,224,0.3)',
            borderRadius: '999px',
            background: 'rgba(92,200,224,0.06)',
          }}>
            Agenda
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 600, color: '#e8f4ff',
            margin: '0 0 0.5rem', lineHeight: 1.1,
            letterSpacing: '0.04em',
          }}>
            Card Shows & Eventos
          </h1>
          <p style={{ color: '#6aa0bc', fontSize: '0.9375rem', margin: 0, lineHeight: 1.6 }}>
            Ferias y eventos TCG donde podrás encontrarme en persona.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#163860', flexShrink: 0 }} />
                <div className="skeleton" style={{ height: 90, borderRadius: 14, flex: 1 }} />
              </div>
            ))}
          </div>
        )}

        {!loading && events.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '5rem 1rem',
            border: '1px dashed #163860', borderRadius: '16px', color: '#3d7090',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
              style={{ margin: '0 auto 1rem', display: 'block', color: '#163860' }}>
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            <p style={{ margin: 0 }}>No hay eventos programados próximamente.</p>
          </div>
        )}

        {/* Upcoming */}
        {!loading && upcoming.length > 0 && (
          <div>
            <p style={{
              fontSize: '0.6875rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: '#5cc8e0', marginBottom: '1.25rem',
            }}>
              Próximos eventos
            </p>
            <div>
              {upcoming.map(event => <EventCard key={event.id} event={event} isPast={false} />)}
            </div>
          </div>
        )}

        {/* Past */}
        {!loading && past.length > 0 && (
          <div style={{ marginTop: upcoming.length > 0 ? '2.5rem' : 0 }}>
            <p style={{
              fontSize: '0.6875rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: '#3d7090', marginBottom: '1.25rem',
            }}>
              Eventos pasados
            </p>
            <div>
              {past.map(event => <EventCard key={event.id} event={event} isPast={true} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}
