import Hero from '../components/Hero'
import BuySection from '../components/BuySection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #163860, transparent)' }} />
      <BuySection />
      <Footer />
    </>
  )
}
