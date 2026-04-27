import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import Footer from '../components/Footer'

const TABS = [
  { value: 'gradeadas_pcg', label: 'Gradeadas PCG' },
  { value: 'gradeadas_psa', label: 'PSA · Beckett · CGC' },
  { value: 'singles',       label: 'Singles' },
  { value: 'packs',         label: 'Packs / Lotes' },
]

export default function Catalog() {
  const [activeTab,        setActiveTab]        = useState('gradeadas_pcg')
  const [search,           setSearch]           = useState('')
  const [sortAsc,          setSortAsc]          = useState(true)
  const [products,         setProducts]         = useState([])
  const [loading,          setLoading]          = useState(true)
  const [selectedProduct,  setSelectedProduct]  = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchProducts() {
      setLoading(true)
      setSearch('')
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', activeTab)
        .order('price', { ascending: sortAsc })
      if (!cancelled && !error) setProducts(data ?? [])
      if (!cancelled) setLoading(false)
    }
    fetchProducts()
    return () => { cancelled = true }
  }, [activeTab, sortAsc])

  const filtered = useMemo(() =>
    search.trim()
      ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      : products,
    [products, search]
  )

  return (
    <>
      {/* Page header */}
      <div style={{
        paddingTop: '64px',
        background: 'linear-gradient(180deg, rgba(9,22,40,0.6) 0%, transparent 100%)',
        borderBottom: '1px solid #0d2540',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
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
            Catálogo
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 600, color: '#e8f4ff',
            margin: '0 0 2rem', lineHeight: 1.1,
            letterSpacing: '0.04em',
          }}>
            Colección completa
          </h1>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0', flexWrap: 'nowrap' }}
            className="catalog-tabs"
          >
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px 8px 0 0',
                  border: '1px solid',
                  borderBottom: 'none',
                  borderColor: activeTab === tab.value ? 'rgba(92,200,224,0.4)' : '#163860',
                  background: activeTab === tab.value ? 'rgba(92,200,224,0.08)' : 'transparent',
                  color: activeTab === tab.value ? '#5cc8e0' : '#6aa0bc',
                  fontSize: '0.8125rem',
                  fontWeight: activeTab === tab.value ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                  letterSpacing: '0.03em',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>
        {/* Controls */}
        <div style={{
          display: 'flex', gap: '0.75rem', alignItems: 'center',
          marginBottom: '1.5rem', flexWrap: 'wrap',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: 200 }}>
            <svg
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="#3d7090" strokeWidth="2"
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre..."
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '0.5rem 0.875rem 0.5rem 2.25rem',
                background: '#060c1a',
                border: '1px solid #163860',
                borderRadius: '8px',
                color: '#e8f4ff',
                fontSize: '0.875rem',
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#5cc8e0'}
              onBlur={e => e.target.style.borderColor = '#163860'}
            />
          </div>

          {/* Sort */}
          <button
            onClick={() => setSortAsc(v => !v)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.5rem 0.875rem',
              border: '1px solid #163860', borderRadius: '8px',
              background: 'rgba(9,22,40,0.6)',
              color: '#6aa0bc', fontSize: '0.8125rem',
              fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e8f4ff'; e.currentTarget.style.borderColor = '#5cc8e0' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#6aa0bc'; e.currentTarget.style.borderColor = '#163860' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 2v10M3 12l-2-2M3 12l2-2M11 2v10M11 2l-2 2M11 2l2 2"/>
            </svg>
            {sortAsc ? 'Precio: menor a mayor' : 'Precio: mayor a menor'}
          </button>
        </div>

        {/* Grid */}
        {loading && (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="skeleton" style={{ aspectRatio: '3/4' }} />
                <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="skeleton" style={{ height: 16, width: '80%' }} />
                  <div className="skeleton" style={{ height: 14, width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '5rem 1rem',
            border: '1px dashed #163860', borderRadius: '12px',
            color: '#3d7090',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
              style={{ margin: '0 auto 1rem', display: 'block', color: '#163860' }}>
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
            <p style={{ margin: 0, fontSize: '0.9375rem' }}>
              {search ? `Sin resultados para "${search}"` : 'Próximamente disponible'}
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="product-grid">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}

        {/* Results count */}
        {!loading && filtered.length > 0 && (
          <p style={{ marginTop: '1.5rem', fontSize: '0.8125rem', color: '#3d7090', textAlign: 'right' }}>
            {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
            {search && ` · búsqueda: "${search}"`}
          </p>
        )}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      <Footer />

      <style>{`
        .catalog-tabs { scrollbar-width: none; }
        .catalog-tabs::-webkit-scrollbar { display: none; }
        @media (max-width: 500px) {
          .catalog-tabs button { font-size: 0.75rem !important; padding: 0.4rem 0.75rem !important; }
        }
      `}</style>
    </>
  )
}
