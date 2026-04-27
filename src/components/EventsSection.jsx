import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import SectionHeader from './SectionHeader'

export default function EventsSection() {
  const [events, setEvents] = useState([])
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

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = events.filter(e => new Date(e.date) >= today)
  const past = events.filter(e => new Date(e.date) < today)

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const EventRow = ({ event, isPast }) => (
    <div style={{
      display: 'flex',
      gap: '1.25rem',
      padding: '1.25rem',
      background: isPast ? 'rgba(17,32,53,0.4)' : '#112035',
      border: '1px solid',
      borderColor: isPast ? '#1a304f' : '#244068',
      borderRadius: '12px',
      alignItems: 'center',
      opacity: isPast ? 0.55 : 1,
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => !isPast && (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Date block */}
      <div style={{
        minWidth: 56,
        textAlign: 'center',
        flexShrink: 0,
      }}>
        <div style={{
          background: isPast ? '#1a304f' : 'linear-gradient(135deg, #244068, #1a304f)',
          borderRadius: '10px',
          padding: '0.5rem',
          border: isPast ? '1px solid #1a304f' : '1px solid rgba(212,175,106,0.2)',
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            color: isPast ? '#5c6880' : '#d4af6a',
            lineHeight: 1,
          }}>
            {new Date(event.date + 'T00:00:00').getDate()}
          </div>
          <div style={{
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: isPast ? '#5c6880' : '#8892a4',
            marginTop: '0.125rem',
          }}>
            {new Date(event.date + 'T00:00:00').toLocaleDateString('es-ES', { month: 'short' })}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.0625rem',
          fontWeight: 500,
          color: isPast ? '#5c6880' : '#f0f6ff',
          margin: '0 0 0.25rem',
        }}>
          {event.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#5c6880', fontSize: '0.8125rem' }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z"/>
            <circle cx="7" cy="5" r="1.5"/>
          </svg>
          {event.location}
        </div>
        <div style={{ marginTop: '0.25rem', color: '#5c6880', fontSize: '0.75rem' }}>
          {formatDate(event.date)}
        </div>
      </div>

      {!isPast && (
        <span style={{
          flexShrink: 0,
          padding: '0.25rem 0.75rem',
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: '999px',
          color: '#86efac',
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          Próximo
        </span>
      )}
    </div>
  )

  return (
    <section id="eventos" style={{ padding: '5rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <SectionHeader
          accent="Agenda"
          title="Card Shows & Eventos"
          subtitle="Ferias y eventos TCG donde podrás encontrarme en persona."
        />

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: 88, borderRadius: 12 }} />
            ))}
          </div>
        )}

        {!loading && events.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '3rem 1rem',
            border: '1px dashed #244068', borderRadius: '12px',
            color: '#5c6880',
          }}>
            <p style={{ margin: 0 }}>No hay eventos programados próximamente.</p>
          </div>
        )}

        {!loading && upcoming.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '700px' }}>
            {upcoming.map(event => <EventRow key={event.id} event={event} isPast={false} />)}
          </div>
        )}

        {!loading && past.length > 0 && (
          <div style={{ marginTop: '2rem', maxWidth: '700px' }}>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5c6880', marginBottom: '0.75rem' }}>
              Eventos pasados
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {past.map(event => <EventRow key={event.id} event={event} isPast={true} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
