import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import SectionHeader from './SectionHeader'

export default function ProductGrid({ id, title, subtitle, accent, category }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortAsc, setSortAsc] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('price', { ascending: sortAsc })

      if (!error) setProducts(data ?? [])
      setLoading(false)
    }
    fetchProducts()
  }, [category, sortAsc])

  const hasProducts = products.length > 0

  return (
    <section id={id} style={{ padding: '5rem 0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
          <SectionHeader title={title} subtitle={subtitle} accent={accent} />

          {hasProducts && (
            <button
              onClick={() => setSortAsc(v => !v)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.5rem 0.875rem',
                border: '1px solid #163860',
                borderRadius: '8px',
                background: 'rgba(9,22,40,0.6)',
                color: '#6aa0bc',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                alignSelf: 'flex-end',
                flexShrink: 0,
                marginBottom: '1.25rem',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#e8f4ff'; e.currentTarget.style.borderColor = '#5cc8e0' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6aa0bc'; e.currentTarget.style.borderColor = '#163860' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 2v10M3 12l-2-2M3 12l2-2M11 2v10M11 2l-2 2M11 2l2 2"/>
              </svg>
              Precio: {sortAsc ? 'menor a mayor' : 'mayor a menor'}
            </button>
          )}
        </div>

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

        {!loading && !hasProducts && (
          <div style={{
            textAlign: 'center', padding: '4rem 1rem',
            border: '1px dashed #163860', borderRadius: '12px',
            color: '#3d7090',
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 1rem', display: 'block', color: '#163860' }}>
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
            <p style={{ margin: 0, fontSize: '0.9375rem' }}>Próximamente disponible</p>
          </div>
        )}

        {!loading && hasProducts && (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </section>
  )
}
