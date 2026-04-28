import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import ProductForm from './ProductForm'
import EventForm from './EventForm'

const TABS = [
  { key: 'singles', label: 'Singles',          category: 'singles' },
  { key: 'pcg',     label: 'PCG',              category: 'gradeadas_pcg' },
  { key: 'psa',     label: 'PSA / Beckett / CGC', category: 'gradeadas_psa' },
  { key: 'packs',   label: 'Packs',            category: 'packs' },
  { key: 'events',  label: 'Eventos',          category: null },
]

function Modal({ title, children, onClose }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(3,8,16,0.85)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        width: '100%', maxWidth: 560,
        background: '#091628',
        border: '1px solid #163860',
        borderRadius: '16px',
        padding: '1.75rem',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 500, color: '#e8f4ff', margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3d7090', padding: '0.25rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#e8f4ff'}
            onMouseLeave={e => e.currentTarget.style.color = '#3d7090'}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ActionBtn({ onClick, danger, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.375rem 0.75rem',
        background: 'transparent',
        border: `1px solid ${danger ? 'rgba(239,68,68,0.25)' : '#163860'}`,
        borderRadius: '6px',
        color: danger ? '#f87171' : '#6aa0bc',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: 500,
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = danger ? '#f87171' : '#5cc8e0'
        e.currentTarget.style.color = danger ? '#fca5a5' : '#e8f4ff'
        if (danger) e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = danger ? 'rgba(239,68,68,0.25)' : '#163860'
        e.currentTarget.style.color = danger ? '#f87171' : '#6aa0bc'
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
    </button>
  )
}

export default function AdminDashboard() {
  const { signOut, session } = useAuth()
  const [activeTab,    setActiveTab]    = useState('singles')
  const [products,     setProducts]     = useState([])
  const [events,       setEvents]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [modal,        setModal]        = useState(null)
  const [deleteConfirm,setDeleteConfirm]= useState(null)

  const currentTab = TABS.find(t => t.key === activeTab)

  const fetchData = useCallback(async () => {
    setLoading(true)
    if (activeTab === 'events') {
      const { data } = await supabase.from('events').select('*').order('date')
      setEvents(data ?? [])
    } else {
      const { data } = await supabase
        .from('products').select('*')
        .eq('category', currentTab.category)
        .order('created_at', { ascending: false })
      setProducts(data ?? [])
    }
    setLoading(false)
  }, [activeTab, currentTab.category])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async (id, type) => {
    await supabase.from(type === 'event' ? 'events' : 'products').delete().eq('id', id)
    setDeleteConfirm(null)
    fetchData()
  }

  const handleSaved = () => { setModal(null); fetchData() }

  const formatPrice = (p) => Number(p).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })

  const formatDate = (d) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: '#060c1a' }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(3,8,16,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #0d2540',
        padding: '0 1rem',
        height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.0625rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#e8f4ff',
          }}>
            Defsune<span style={{ color: '#5cc8e0' }}>TCG</span>
            <span style={{ color: '#3d7090', fontSize: '0.7rem', fontFamily: 'var(--font-body)', fontWeight: 400, marginLeft: '0.4rem' }}>
              Admin
            </span>
          </span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#3d7090', display: 'none' }} className="admin-email">
            {session?.user?.email}
          </span>
          <button
            onClick={signOut}
            style={{
              padding: '0.35rem 0.75rem',
              background: 'transparent', border: '1px solid #163860',
              borderRadius: '6px', color: '#6aa0bc',
              cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3d7090'; e.currentTarget.style.color = '#e8f4ff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#163860'; e.currentTarget.style.color = '#6aa0bc' }}
          >
            Salir
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
        {/* Tabs — scrollable on mobile */}
        <div style={{
          display: 'flex', gap: 0,
          borderBottom: '1px solid #0d2540',
          marginBottom: '1.5rem',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.625rem 0.875rem',
                background: 'none', border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid #5cc8e0' : '2px solid transparent',
                color: activeTab === tab.key ? '#e8f4ff' : '#3d7090',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                fontWeight: activeTab === tab.key ? 600 : 400,
                transition: 'color 0.2s',
                marginBottom: '-1px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              onMouseEnter={e => { if (activeTab !== tab.key) e.currentTarget.style.color = '#90c0dc' }}
              onMouseLeave={e => { if (activeTab !== tab.key) e.currentTarget.style.color = '#3d7090' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 500, color: '#e8f4ff', margin: 0 }}>
            {currentTab.label}
          </h1>
          <button
            onClick={() => setModal({ type: activeTab === 'events' ? 'event' : 'product', item: null })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.5rem 0.875rem',
              background: 'linear-gradient(135deg, #5cc8e0, #3aacc4)',
              border: 'none', borderRadius: '8px',
              color: '#030810', cursor: 'pointer',
              fontSize: '0.8125rem', fontWeight: 600,
              letterSpacing: '0.03em',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/>
            </svg>
            {activeTab === 'events' ? 'Nuevo evento' : 'Añadir'}
          </button>
        </div>

        {/* Skeleton */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="skeleton" style={{ height: 68, borderRadius: 10 }} />
            ))}
          </div>
        )}

        {/* Products list */}
        {!loading && activeTab !== 'events' && (
          <div style={{ background: '#091628', border: '1px solid #0d2540', borderRadius: '12px', overflow: 'hidden' }}>
            {products.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#3d7090', fontSize: '0.9rem' }}>
                Sin productos en esta categoría. Añade el primero.
              </div>
            ) : products.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  padding: '0.75rem 1rem',
                  borderBottom: i < products.length - 1 ? '1px solid #0d2540' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(13,37,64,0.4)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Thumbnail */}
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name}
                    style={{ width: 32, height: 44, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 32, height: 44, background: '#0d2540', borderRadius: 4, flexShrink: 0 }} />
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: '#e8f4ff', fontSize: '0.875rem', fontWeight: 500,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {p.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#5cc8e0', fontSize: '0.8rem', fontWeight: 600 }}>
                      {formatPrice(p.price)}
                    </span>
                    {p.certification && (
                      <span style={{
                        padding: '0.1rem 0.4rem', borderRadius: '4px',
                        fontSize: '0.65rem', fontWeight: 700,
                        background: 'rgba(59,130,246,0.15)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        color: '#93c5fd',
                      }}>
                        {p.certification}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                  <ActionBtn onClick={() => setModal({ type: 'product', item: p })}>Editar</ActionBtn>
                  <ActionBtn danger onClick={() => setDeleteConfirm({ id: p.id, name: p.name, type: 'product' })}>
                    Eliminar
                  </ActionBtn>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Events list */}
        {!loading && activeTab === 'events' && (
          <div style={{ background: '#091628', border: '1px solid #0d2540', borderRadius: '12px', overflow: 'hidden' }}>
            {events.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#3d7090', fontSize: '0.9rem' }}>
                Sin eventos. Añade el primero.
              </div>
            ) : events.map((ev, i) => (
              <div
                key={ev.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  padding: '0.75rem 1rem',
                  borderBottom: i < events.length - 1 ? '1px solid #0d2540' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(13,37,64,0.4)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Date block */}
                <div style={{
                  flexShrink: 0, textAlign: 'center',
                  background: 'rgba(92,200,224,0.08)',
                  border: '1px solid rgba(92,200,224,0.2)',
                  borderRadius: '8px',
                  padding: '0.3rem 0.6rem',
                  minWidth: 52,
                }}>
                  <div style={{ color: '#5cc8e0', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {new Date(ev.date + 'T00:00:00').toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                  </div>
                  <div style={{ color: '#e8f4ff', fontSize: '1.1rem', fontWeight: 700, lineHeight: 1 }}>
                    {new Date(ev.date + 'T00:00:00').getDate()}
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: '#e8f4ff', fontSize: '0.875rem', fontWeight: 500,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {ev.name}
                  </div>
                  {ev.location && (
                    <div style={{ color: '#6aa0bc', fontSize: '0.78rem', marginTop: '0.15rem',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ev.location}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                  <ActionBtn onClick={() => setModal({ type: 'event', item: ev })}>Editar</ActionBtn>
                  <ActionBtn danger onClick={() => setDeleteConfirm({ id: ev.id, name: ev.name, type: 'event' })}>
                    Eliminar
                  </ActionBtn>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Product/Event modal */}
      {modal && (
        <Modal
          title={
            modal.type === 'event'
              ? (modal.item ? 'Editar evento' : 'Nuevo evento')
              : (modal.item ? 'Editar producto' : 'Nuevo producto')
          }
          onClose={() => setModal(null)}
        >
          {modal.type === 'event' ? (
            <EventForm event={modal.item} onSaved={handleSaved} onCancel={() => setModal(null)} />
          ) : (
            <ProductForm product={modal.item} onSaved={handleSaved} onCancel={() => setModal(null)} />
          )}
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <Modal title="Confirmar eliminación" onClose={() => setDeleteConfirm(null)}>
          <p style={{ color: '#90c0dc', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
            ¿Seguro que quieres eliminar{' '}
            <strong style={{ color: '#e8f4ff' }}>"{deleteConfirm.name}"</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setDeleteConfirm(null)}
              style={{
                padding: '0.625rem 1.25rem', background: 'transparent',
                border: '1px solid #163860', borderRadius: '8px',
                color: '#6aa0bc', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500,
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.type)}
              style={{
                padding: '0.625rem 1.25rem',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '8px', color: '#fca5a5',
                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
            >
              Eliminar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
