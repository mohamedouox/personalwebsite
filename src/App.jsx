import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Work from './components/Work'
import Blog from './components/Blog'
import Contact from './components/Contact'
import ParticlesBackground from './components/ParticlesBackground'
import NeuralNetwork from './components/NeuralNetwork'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    // Console easter egg
    console.log(`
  ╔══════════════════════════════════════════════════════════════╗
  ║                                                              ║
  ║    █▀▀█ █▀▀█ █▀▄▀█ █▀▀ █▀▀▄   █▀▀█ █░░█ █▀▀█ █░█            ║
  ║    █▄▄▀ █░░█ █░▀░█ █▀▀ █░░█   █░░█ █░░█ █░░█ ▄▀▄            ║
  ║    ▀░▀▀ ▀▀▀▀ ▀░░░▀ ▀▀▀ ▀▀▀░   ▀▀▀▀ ░▀▀▀ ▀▀▀▀ ▀░▀            ║
  ║                                                              ║
  ║           Welcome to the vibe coding dimension! 🚀          ║
  ║                                                              ║
  ║    This website is powered by:                              ║
  ║    • React + Vite (modern stack)                            ║
  ║    • AI-enhanced creativity & design                        ║
  ║    • 100% vibe-driven development                           ║
  ║                                                              ║
  ║    Keyboard shortcuts:                                       ║
  ║    • Ctrl/Cmd + 1-5: Navigate sections                      ║
  ║    • Esc: Close modals                                       ║
  ║                                                              ║
  ║    Ready to collaborate? Let's create something amazing! ✨  ║
  ║                                                              ║
  ╚══════════════════════════════════════════════════════════════╝
    `)

    // Add some random AI-inspired quotes to console
    const aiQuotes = [
      "The future belongs to those who understand both human creativity and artificial intelligence.",
      "Code is poetry, and AI is the muse that helps us write better verses.",
      "In the dance between human intuition and machine learning, magic happens.",
      "Every line of code is a step towards a more intelligent world.",
      "Embrace AI not as a replacement, but as an amplifier of human potential."
    ]

    setTimeout(() => {
      console.log(`💭 ${aiQuotes[Math.floor(Math.random() * aiQuotes.length)]}`)
    }, 3000)

    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        const sectionMap = {
          '1': 'home',
          '2': 'about',
          '3': 'work',
          '4': 'blog',
          '5': 'contact'
        }

        if (sectionMap[e.key]) {
          e.preventDefault()
          setActiveSection(sectionMap[e.key])
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSectionChange = (section) => {
    setActiveSection(section)
  }

  return (
    <div className="App">
      {/* Animated backgrounds */}
      <ParticlesBackground />
      <NeuralNetwork />

      {/* Navigation */}
      <Navigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main content */}
      <main className="main">
        {activeSection === 'home' && <Hero onSectionChange={handleSectionChange} />}
        {activeSection === 'about' && <About />}
        {activeSection === 'work' && <Work />}
        {activeSection === 'blog' && <Blog />}
        {activeSection === 'contact' && <Contact />}
      </main>
    </div>
  )
}

export default App