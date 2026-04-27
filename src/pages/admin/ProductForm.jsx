import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const CATEGORIES = [
  { value: 'singles',        label: 'Singles' },
  { value: 'gradeadas_pcg',  label: 'Gradeadas PCG' },
  { value: 'gradeadas_psa',  label: 'Gradeadas PSA / Beckett / CGC' },
  { value: 'packs',          label: 'Packs / Lotes' },
]

const CERTIFICATIONS = ['PSA', 'Beckett', 'CGC']

const inputStyle = {
  width: '100%', padding: '0.625rem 0.875rem',
  background: '#060c1a', border: '1px solid #163860',
  borderRadius: '8px', color: '#e8f4ff',
  fontSize: '0.9375rem', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
}

const labelStyle = {
  display: 'block', fontSize: '0.8125rem',
  fontWeight: 500, color: '#6aa0bc',
  marginBottom: '0.375rem', letterSpacing: '0.04em',
}

function initSavedUrls(product) {
  if (product?.images?.length > 0) return product.images
  if (product?.image_url) return [product.image_url]
  return []
}

export default function ProductForm({ product, onSaved, onCancel }) {
  const isEdit = !!product

  const [form, setForm] = useState({
    name:         product?.name         ?? '',
    price:        product?.price        ?? '',
    category:     product?.category     ?? 'singles',
    description:  product?.description  ?? '',
    certification:product?.certification?? '',
    wallapop_url: product?.wallapop_url ?? '',
    vinted_url:   product?.vinted_url   ?? '',
  })

  const [savedUrls,      setSavedUrls]      = useState(() => initSavedUrls(product))
  const [pendingFiles,   setPendingFiles]   = useState([])
  const [pendingPreview, setPendingPreview] = useState([])
  const [urlInput,       setUrlInput]       = useState('')
  const [uploading,      setUploading]      = useState(false)
  const [saving,         setSaving]         = useState(false)
  const [error,          setError]          = useState('')

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleFilesAdd = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setPendingFiles(prev => [...prev, ...files])
    setPendingPreview(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
    e.target.value = ''
  }

  const handleUrlAdd = () => {
    const url = urlInput.trim()
    if (!url) return
    setSavedUrls(prev => [...prev, url])
    setUrlInput('')
  }

  const removeImage = (globalIdx) => {
    const savedCount = savedUrls.length
    if (globalIdx < savedCount) {
      setSavedUrls(prev => prev.filter((_, i) => i !== globalIdx))
    } else {
      const pendingIdx = globalIdx - savedCount
      URL.revokeObjectURL(pendingPreview[pendingIdx])
      setPendingFiles(prev => prev.filter((_, i) => i !== pendingIdx))
      setPendingPreview(prev => prev.filter((_, i) => i !== pendingIdx))
    }
  }

  const uploadSingleFile = async (file) => {
    const ext  = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
    if (error) throw new Error('Error subiendo imagen: ' + error.message)
    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
    return publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      setUploading(true)
      const uploadedUrls = await Promise.all(pendingFiles.map(uploadSingleFile))
      setUploading(false)

      const allUrls = [...savedUrls, ...uploadedUrls].filter(Boolean)

      const payload = {
        name:         form.name.trim(),
        price:        parseFloat(form.price),
        category:     form.category,
        image_url:    allUrls[0] || null,
        images:       allUrls.length > 0 ? allUrls : null,
        description:  form.description.trim() || null,
        certification:form.category === 'gradeadas_psa' ? (form.certification || null) : null,
        wallapop_url: form.wallapop_url.trim() || null,
        vinted_url:   form.vinted_url.trim()   || null,
      }

      const result = isEdit
        ? await supabase.from('products').update(payload).eq('id', product.id)
        : await supabase.from('products').insert(payload)

      if (result.error) throw new Error(result.error.message)
      onSaved()
    } catch (err) {
      setError(err.message)
      setUploading(false)
    } finally {
      setSaving(false)
    }
  }

  const allPreviews = [...savedUrls, ...pendingPreview]
  const showCertification = form.category === 'gradeadas_psa'
  const showDescription   = form.category === 'packs'

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '8px', color: '#fca5a5', fontSize: '0.875rem',
        }}>
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label style={labelStyle}>Nombre *</label>
        <input required value={form.name} onChange={set('name')} placeholder="Ej: Charizard Base Set"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#5cc8e0'}
          onBlur={e => e.target.style.borderColor = '#163860'}
        />
      </div>

      {/* Price + Category */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Precio (€) *</label>
          <input required type="number" step="0.01" min="0"
            value={form.price} onChange={set('price')} placeholder="0.00"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#5cc8e0'}
            onBlur={e => e.target.style.borderColor = '#163860'}
          />
        </div>
        <div>
          <label style={labelStyle}>Categoría *</label>
          <select value={form.category} onChange={set('category')}
            style={{ ...inputStyle, cursor: 'pointer' }}
            onFocus={e => e.target.style.borderColor = '#5cc8e0'}
            onBlur={e => e.target.style.borderColor = '#163860'}
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value} style={{ background: '#060c1a' }}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Certification */}
      {showCertification && (
        <div>
          <label style={labelStyle}>Certificación</label>
          <select value={form.certification} onChange={set('certification')}
            style={{ ...inputStyle, cursor: 'pointer' }}
            onFocus={e => e.target.style.borderColor = '#5cc8e0'}
            onBlur={e => e.target.style.borderColor = '#163860'}
          >
            <option value="" style={{ background: '#060c1a' }}>Sin especificar</option>
            {CERTIFICATIONS.map(c => (
              <option key={c} value={c} style={{ background: '#060c1a' }}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {/* Description */}
      {showDescription && (
        <div>
          <label style={labelStyle}>Descripción del contenido</label>
          <textarea value={form.description} onChange={set('description')} rows={3}
            placeholder="Ej: 50 cartas vintage, incluye raras y holofoil..."
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
            onFocus={e => e.target.style.borderColor = '#5cc8e0'}
            onBlur={e => e.target.style.borderColor = '#163860'}
          />
        </div>
      )}

      {/* External URLs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>URL Wallapop</label>
          <input type="url" value={form.wallapop_url} onChange={set('wallapop_url')}
            placeholder="https://es.wallapop.com/item/..."
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#5cc8e0'}
            onBlur={e => e.target.style.borderColor = '#163860'}
          />
        </div>
        <div>
          <label style={labelStyle}>URL Vinted</label>
          <input type="url" value={form.vinted_url} onChange={set('vinted_url')}
            placeholder="https://www.vinted.es/items/..."
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#5cc8e0'}
            onBlur={e => e.target.style.borderColor = '#163860'}
          />
        </div>
      </div>

      {/* Images */}
      <div>
        <label style={labelStyle}>
          Imágenes{allPreviews.length > 0 ? ` (${allPreviews.length})` : ''}
          {allPreviews.length > 0 && (
            <span style={{ fontWeight: 400, color: '#3d7090', marginLeft: '0.5rem' }}>
              · La primera es la imagen principal
            </span>
          )}
        </label>

        {/* Thumbnail grid */}
        {allPreviews.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
            gap: '0.5rem',
            marginBottom: '0.75rem',
          }}>
            {allPreviews.map((src, i) => (
              <div key={i} style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 8, overflow: 'hidden', border: i === 0 ? '2px solid #5cc8e0' : '1px solid #163860' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                {i === 0 && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(92,200,224,0.8)',
                    fontSize: '0.55rem', fontWeight: 700, textAlign: 'center',
                    color: '#030810', padding: '0.15rem', letterSpacing: '0.05em',
                  }}>
                    PRINCIPAL
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  style={{
                    position: 'absolute', top: 2, right: 2,
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'rgba(239,68,68,0.85)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '10px', lineHeight: 1, fontWeight: 700,
                  }}
                >×</button>
              </div>
            ))}
          </div>
        )}

        {/* File input */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesAdd}
          style={{ ...inputStyle, padding: '0.5rem 0.875rem', cursor: 'pointer', color: '#6aa0bc', marginBottom: '0.5rem' }}
        />

        {/* URL input */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleUrlAdd())}
            placeholder="O añade una URL y pulsa Añadir..."
            style={{ ...inputStyle, flex: 1 }}
            onFocus={e => e.target.style.borderColor = '#5cc8e0'}
            onBlur={e => e.target.style.borderColor = '#163860'}
          />
          <button
            type="button"
            onClick={handleUrlAdd}
            disabled={!urlInput.trim()}
            style={{
              padding: '0.625rem 1rem',
              background: urlInput.trim() ? 'rgba(92,200,224,0.12)' : 'transparent',
              border: '1px solid #163860', borderRadius: '8px',
              color: urlInput.trim() ? '#5cc8e0' : '#3d7090',
              cursor: urlInput.trim() ? 'pointer' : 'default',
              fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap',
            }}
          >
            Añadir
          </button>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
        <button type="button" onClick={onCancel}
          style={{
            padding: '0.625rem 1.25rem', background: 'transparent',
            border: '1px solid #163860', borderRadius: '8px',
            color: '#6aa0bc', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#3d7090'; e.currentTarget.style.color = '#e8f4ff' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#163860'; e.currentTarget.style.color = '#6aa0bc' }}
        >
          Cancelar
        </button>
        <button type="submit" disabled={saving || uploading}
          style={{
            padding: '0.625rem 1.5rem',
            background: (saving || uploading) ? '#0d2540' : 'linear-gradient(135deg, #5cc8e0, #3aacc4)',
            border: 'none', borderRadius: '8px',
            color: (saving || uploading) ? '#3d7090' : '#030810',
            cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
            fontWeight: 600, fontSize: '0.9rem',
          }}
        >
          {uploading ? `Subiendo ${pendingFiles.length} imagen${pendingFiles.length !== 1 ? 'es' : ''}...`
            : saving ? 'Guardando...'
            : isEdit ? 'Guardar cambios' : 'Añadir producto'}
        </button>
      </div>
    </form>
  )
}
