import Hero from '../components/Hero'
import BuySection from '../components/BuySection'
import ProductGrid from '../components/ProductGrid'
import EventsSection from '../components/EventsSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Hero />

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #163860, transparent)' }} />

      <BuySection />

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #0d2540, transparent)' }} />

      <ProductGrid
        id="singles"
        accent="Catálogo"
        title="Singles"
        subtitle="Cartas individuales seleccionadas. Precio justo, condición verificada."
        category="singles"
      />

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #0d2540, transparent)' }} />

      <ProductGrid
        id="gradeadas-pcg"
        accent="Gradeadas"
        title="Gradeadas PCG"
        subtitle="Cartas certificadas por PCG con su correspondiente calificación."
        category="gradeadas_pcg"
      />

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #0d2540, transparent)' }} />

      <ProductGrid
        id="gradeadas-psa"
        accent="Premium"
        title="Gradeadas PSA · Beckett · CGC"
        subtitle="Las certificaciones más reconocidas del mercado internacional. Calidad garantizada."
        category="gradeadas_psa"
      />

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #0d2540, transparent)' }} />

      <ProductGrid
        id="packs"
        accent="Lotes"
        title="Packs & Lotes"
        subtitle="Colecciones curadas y lotes con gran relación calidad-precio."
        category="packs"
      />

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #0d2540, transparent)' }} />

      <EventsSection />

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #163860, transparent)' }} />

      <ContactSection />

      <Footer />
    </>
  )
}
