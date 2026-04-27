import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const CATEGORIES = [
  { value: 'singles',        label: 'Singles' },
  { value: 'gradeadas_pcg',  label: 'Gradeadas PCG' },
  { value: 'gradeadas_psa',  label: 'Gradeadas PSA / Beckett / CGC' },
  { value: 'packs',          label: 'Packs / Lotes' },
]

const CERTIFICATIONS = ['PSA', 'Beckett', 'CGC']

const inputStyle = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  background: '#0a1628',
  border: '1px solid #244068',
  borderRadius: '8px',
  color: '#f0f6ff',
  fontSize: '0.9375rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: '#8892a4',
  marginBottom: '0.375rem',
  letterSpacing: '0.04em',
}

export default function ProductForm({ product, onSaved, onCancel }) {
  const isEdit = !!product

  const [form, setForm] = useState({
    name: product?.name ?? '',
    price: product?.price ?? '',
    category: product?.category ?? 'singles',
    image_url: product?.image_url ?? '',
    description: product?.description ?? '',
    certification: product?.certification ?? '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setImageFile(file)
  }

  const uploadImage = async () => {
    if (!imageFile) return form.image_url
    setUploading(true)
    const ext = imageFile.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(path, imageFile, { upsert: true })
    setUploading(false)
    if (error) throw new Error('Error subiendo imagen: ' + error.message)
    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
    return publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const imageUrl = await uploadImage()
      const payload = {
        name: form.name.trim(),
        price: parseFloat(form.price),
        category: form.category,
        image_url: imageUrl || null,
        description: form.description.trim() || null,
        certification: form.category === 'gradeadas_psa' ? (form.certification || null) : null,
      }

      let result
      if (isEdit) {
        result = await supabase.from('products').update(payload).eq('id', product.id)
      } else {
        result = await supabase.from('products').insert(payload)
      }

      if (result.error) throw new Error(result.error.message)
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const showCertification = form.category === 'gradeadas_psa'
  const showDescription = form.category === 'packs'

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Nombre *</label>
          <input
            required
            value={form.name}
            onChange={set('name')}
            placeholder="Ej: Charizard Base Set"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#d4af6a'}
            onBlur={e => e.target.style.borderColor = '#244068'}
          />
        </div>

        <div>
          <label style={labelStyle}>Precio (€) *</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={set('price')}
            placeholder="0.00"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#d4af6a'}
            onBlur={e => e.target.style.borderColor = '#244068'}
          />
        </div>

        <div>
          <label style={labelStyle}>Categoría *</label>
          <select
            value={form.category}
            onChange={set('category')}
            style={{ ...inputStyle, cursor: 'pointer' }}
            onFocus={e => e.target.style.borderColor = '#d4af6a'}
            onBlur={e => e.target.style.borderColor = '#244068'}
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value} style={{ background: '#0a1628' }}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {showCertification && (
          <div>
            <label style={labelStyle}>Certificación</label>
            <select
              value={form.certification}
              onChange={set('certification')}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={e => e.target.style.borderColor = '#d4af6a'}
              onBlur={e => e.target.style.borderColor = '#244068'}
            >
              <option value="" style={{ background: '#0a1628' }}>Sin especificar</option>
              {CERTIFICATIONS.map(c => (
                <option key={c} value={c} style={{ background: '#0a1628' }}>{c}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {showDescription && (
        <div>
          <label style={labelStyle}>Descripción del contenido</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            placeholder="Ej: 50 cartas vintage, incluye raras y holofoil..."
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
            onFocus={e => e.target.style.borderColor = '#d4af6a'}
            onBlur={e => e.target.style.borderColor = '#244068'}
          />
        </div>
      )}

      <div>
        <label style={labelStyle}>Imagen</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              ...inputStyle,
              padding: '0.5rem 0.875rem',
              cursor: 'pointer',
              color: '#8892a4',
            }}
          />
          {(form.image_url || imageFile) && (
            <div style={{
              padding: '0.5rem',
              background: '#0a1628',
              borderRadius: '8px',
              border: '1px solid #244068',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : form.image_url}
                alt="Preview"
                style={{ width: 40, height: 56, objectFit: 'cover', borderRadius: 4 }}
              />
              <span style={{ fontSize: '0.8125rem', color: '#8892a4' }}>
                {imageFile ? imageFile.name : 'Imagen actual'}
              </span>
            </div>
          )}
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#5c6880' }}>
            O pega una URL directamente:
          </p>
          <input
            type="url"
            value={imageFile ? '' : form.image_url}
            onChange={e => { setImageFile(null); set('image_url')(e) }}
            placeholder="https://..."
            disabled={!!imageFile}
            style={{ ...inputStyle, opacity: imageFile ? 0.4 : 1 }}
            onFocus={e => e.target.style.borderColor = '#d4af6a'}
            onBlur={e => e.target.style.borderColor = '#244068'}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '0.625rem 1.25rem',
            background: 'transparent',
            border: '1px solid #244068',
            borderRadius: '8px',
            color: '#8892a4',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#5c6880'; e.currentTarget.style.color = '#f0f6ff' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#244068'; e.currentTarget.style.color = '#8892a4' }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving || uploading}
          style={{
            padding: '0.625rem 1.5rem',
            background: (saving || uploading) ? '#1a304f' : 'linear-gradient(135deg, #d4af6a, #c9a05a)',
            border: 'none',
            borderRadius: '8px',
            color: (saving || uploading) ? '#5c6880' : '#040d1a',
            cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            letterSpacing: '0.03em',
            transition: 'opacity 0.2s',
          }}
        >
          {uploading ? 'Subiendo imagen...' : saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Añadir producto'}
        </button>
      </div>
    </form>
  )
}
