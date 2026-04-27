import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const inputStyle = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  background: '#060c1a',
  border: '1px solid #163860',
  borderRadius: '8px',
  color: '#e8f4ff',
  fontSize: '0.9375rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: '#6aa0bc',
  marginBottom: '0.375rem',
  letterSpacing: '0.04em',
}

export default function EventForm({ event, onSaved, onCancel }) {
  const isEdit = !!event
  const [form, setForm] = useState({
    name: event?.name ?? '',
    date: event?.date ?? '',
    location: event?.location ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        date: form.date,
        location: form.location.trim(),
      }
      let result
      if (isEdit) {
        result = await supabase.from('events').update(payload).eq('id', event.id)
      } else {
        result = await supabase.from('events').insert(payload)
      }
      if (result.error) throw new Error(result.error.message)
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '8px',
          color: '#fca5a5',
          fontSize: '0.875rem',
        }}>
          {error}
        </div>
      )}

      <div>
        <label style={labelStyle}>Nombre del evento *</label>
        <input
          required
          value={form.name}
          onChange={set('name')}
          placeholder="Ej: Card Show Madrid"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#5cc8e0'}
          onBlur={e => e.target.style.borderColor = '#163860'}
        />
      </div>

      <div>
        <label style={labelStyle}>Fecha *</label>
        <input
          required
          type="date"
          value={form.date}
          onChange={set('date')}
          style={{ ...inputStyle, colorScheme: 'dark' }}
          onFocus={e => e.target.style.borderColor = '#5cc8e0'}
          onBlur={e => e.target.style.borderColor = '#163860'}
        />
      </div>

      <div>
        <label style={labelStyle}>Ubicación *</label>
        <input
          required
          value={form.location}
          onChange={set('location')}
          placeholder="Ej: IFEMA, Madrid"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#5cc8e0'}
          onBlur={e => e.target.style.borderColor = '#163860'}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '0.625rem 1.25rem',
            background: 'transparent',
            border: '1px solid #163860',
            borderRadius: '8px',
            color: '#6aa0bc',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#3d7090'; e.currentTarget.style.color = '#e8f4ff' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#163860'; e.currentTarget.style.color = '#6aa0bc' }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: '0.625rem 1.5rem',
            background: saving ? '#0d2540' : 'linear-gradient(135deg, #5cc8e0, #3aacc4)',
            border: 'none',
            borderRadius: '8px',
            color: saving ? '#3d7090' : '#030810',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            letterSpacing: '0.03em',
          }}
        >
          {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Añadir evento'}
        </button>
      </div>
    </form>
  )
}
