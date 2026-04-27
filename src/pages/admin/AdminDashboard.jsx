import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import ProductForm from './ProductForm'
import EventForm from './EventForm'

const TABS = [
  { key: 'singles',       label: 'Singles',            category: 'singles' },
  { key: 'pcg',           label: 'Gradeadas PCG',      category: 'gradeadas_pcg' },
  { key: 'psa',           label: 'PSA / Beckett / CGC', category: 'gradeadas_psa' },
  { key: 'packs',         label: 'Packs / Lotes',      category: 'packs' },
  { key: 'events',        label: 'Eventos',            category: null },
]

const CERT_LABELS = { PSA: 'PSA', Beckett: 'Beckett', CGC: 'CGC' }

function Modal({ title, children, onClose }) {
  return (
    <div style={{
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
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 500,
            color: '#e8f4ff',
            margin: 0,
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#3d7090', padding: '0.25rem',
              transition: 'color 0.2s',
            }}
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

export default function AdminDashboard() {
  const { signOut, session } = useAuth()
  const [activeTab, setActiveTab] = useState('singles')
  const [products, setProducts] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

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
    const table = type === 'event' ? 'events' : 'products'
    await supabase.from(table).delete().eq('id', id)
    setDeleteConfirm(null)
    fetchData()
  }

  const handleSaved = () => {
    setModal(null)
    fetchData()
  }

  const formatPrice = (p) =>
    Number(p).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })

  return (
    <div style={{ minHeight: '100vh', background: '#060c1a' }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(3,8,16,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #0d2540',
        padding: '0 1.5rem',
        height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.125rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#e8f4ff',
          }}>
            Defsune<span style={{ color: '#5cc8e0' }}>TCG</span>
            <span style={{ color: '#3d7090', fontSize: '0.75rem', fontFamily: 'var(--font-body)', fontWeight: 400, marginLeft: '0.5rem' }}>
              Admin
            </span>
          </span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8125rem', color: '#3d7090' }}>{session?.user?.email}</span>
          <button
            onClick={signOut}
            style={{
              padding: '0.4rem 0.875rem',
              background: 'transparent',
              border: '1px solid #163860',
              borderRadius: '6px',
              color: '#6aa0bc',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#3d7090'; e.currentTarget.style.color = '#e8f4ff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#163860'; e.currentTarget.style.color = '#6aa0bc' }}
          >
            Salir
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '0.375rem', flexWrap: 'wrap',
          borderBottom: '1px solid #0d2540',
          marginBottom: '2rem',
          paddingBottom: '0',
        }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.625rem 1rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid #5cc8e0' : '2px solid transparent',
                color: activeTab === tab.key ? '#e8f4ff' : '#3d7090',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: activeTab === tab.key ? 600 : 400,
                letterSpacing: '0.02em',
                transition: 'color 0.2s',
                marginBottom: '-1px',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (activeTab !== tab.key) e.currentTarget.style.color = '#90c0dc' }}
              onMouseLeave={e => { if (activeTab !== tab.key) e.currentTarget.style.color = '#3d7090' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.375rem',
            fontWeight: 500,
            color: '#e8f4ff',
            margin: 0,
          }}>
            {currentTab.label}
          </h1>
          <button
            onClick={() => setModal({ type: activeTab === 'events' ? 'event' : 'product', item: null })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #5cc8e0, #3aacc4)',
              border: 'none',
              borderRadius: '8px',
              color: '#030810',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.03em',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/>
            </svg>
            {activeTab === 'events' ? 'Nuevo evento' : 'Nuevo producto'}
          </button>
        </div>

        {/* Content */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="skeleton" style={{ height: 64, borderRadius: 10 }} />
            ))}
          </div>
        )}

        {!loading && activeTab !== 'events' && (
          <div style={{
            background: '#091628',
            border: '1px solid #0d2540',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {products.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#3d7090' }}>
                Sin productos. Añade el primero.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #0d2540' }}>
                    {['Imagen', 'Nombre', 'Precio', 'Certif.', 'Acciones'].map(h => (
                      <th key={h} style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#3d7090',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: i < products.length - 1 ? '1px solid #0d2540' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(13,37,64,0.4)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.name}
                            style={{ width: 36, height: 50, objectFit: 'cover', borderRadius: 4 }}
                          />
                        ) : (
                          <div style={{ width: 36, height: 50, background: '#0d2540', borderRadius: 4 }} />
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#e8f4ff', fontSize: '0.9rem', maxWidth: 220 }}>
                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                        {p.description && (
                          <div style={{
                            fontSize: '0.75rem', color: '#3d7090', marginTop: '0.2rem',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {p.description}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#5cc8e0', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                        {formatPrice(p.price)}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {p.certification ? (
                          <span style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: 'rgba(59,130,246,0.15)',
                            border: '1px solid rgba(59,130,246,0.3)',
                            color: '#93c5fd',
                          }}>
                            {p.certification}
                          </span>
                        ) : <span style={{ color: '#3d7090' }}>—</span>}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => setModal({ type: 'product', item: p })}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: 'transparent',
                              border: '1px solid #163860',
                              borderRadius: '6px',
                              color: '#6aa0bc',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#5cc8e0'; e.currentTarget.style.color = '#e8f4ff' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#163860'; e.currentTarget.style.color = '#6aa0bc' }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ id: p.id, name: p.name, type: 'product' })}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: 'transparent',
                              border: '1px solid rgba(239,68,68,0.2)',
                              borderRadius: '6px',
                              color: '#f87171',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = '#f87171' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)' }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {!loading && activeTab === 'events' && (
          <div style={{
            background: '#091628',
            border: '1px solid #0d2540',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            {events.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#3d7090' }}>
                Sin eventos. Añade el primero.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #0d2540' }}>
                    {['Nombre', 'Fecha', 'Ubicación', 'Acciones'].map(h => (
                      <th key={h} style={{
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#3d7090',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev, i) => (
                    <tr
                      key={ev.id}
                      style={{
                        borderBottom: i < events.length - 1 ? '1px solid #0d2540' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(13,37,64,0.4)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '0.75rem 1rem', color: '#e8f4ff', fontWeight: 500, fontSize: '0.9rem' }}>
                        {ev.name}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#5cc8e0', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                        {new Date(ev.date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#6aa0bc', fontSize: '0.875rem' }}>
                        {ev.location}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => setModal({ type: 'event', item: ev })}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: 'transparent',
                              border: '1px solid #163860',
                              borderRadius: '6px',
                              color: '#6aa0bc',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#5cc8e0'; e.currentTarget.style.color = '#e8f4ff' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#163860'; e.currentTarget.style.color = '#6aa0bc' }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ id: ev.id, name: ev.name, type: 'event' })}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: 'transparent',
                              border: '1px solid rgba(239,68,68,0.2)',
                              borderRadius: '6px',
                              color: '#f87171',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = '#f87171' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)' }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <Modal title="Confirmar eliminación" onClose={() => setDeleteConfirm(null)}>
          <p style={{ color: '#90c0dc', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
            ¿Seguro que quieres eliminar <strong style={{ color: '#e8f4ff' }}>"{deleteConfirm.name}"</strong>? Esta acción no se puede deshacer.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setDeleteConfirm(null)}
              style={{
                padding: '0.625rem 1.25rem',
                background: 'transparent',
                border: '1px solid #163860',
                borderRadius: '8px',
                color: '#6aa0bc',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500,
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
                borderRadius: '8px',
                color: '#fca5a5',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)' }}
            >
              Eliminar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
