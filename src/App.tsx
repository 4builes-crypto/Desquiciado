import { useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Storytelling } from './components/Storytelling'
import { BusinessModel } from './components/BusinessModel'
import { ReservationForm } from './components/ReservationForm'
import { Footer } from './components/Footer'
import { Catalog } from './components/Catalog'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onNavigate={setActiveSection} />
          </motion.div>
        )
      case 'nosotros':
        return (
          <motion.div
            key="nosotros"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Storytelling />
          </motion.div>
        )
      case 'catalogo':
        return (
          <motion.div
            key="catalogo"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Catalog />
          </motion.div>
        )
      case 'modelo':
        return (
          <motion.div
            key="modelo"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <BusinessModel />
          </motion.div>
        )
      case 'experiencias':
        return (
          <motion.div
            key="experiencias"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <ReservationForm />
          </motion.div>
        )
      default:
        return <Hero onNavigate={setActiveSection} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-red selection:text-cream bg-cream overflow-x-hidden">
      <Header activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderSection()}
        </AnimatePresence>
      </main>
      <Footer onNavigate={setActiveSection} />
    </div>
  )
}

export default App
