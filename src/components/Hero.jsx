import { useState, useEffect, useRef } from 'react'

const Hero = ({ onSectionChange }) => {
  const [typedCode, setTypedCode] = useState('')
  const [stats, setStats] = useState({ projects: 0, ai: 0, coffee: 0 })
  const statsRef = useRef(null)
  const [statsAnimated, setStatsAnimated] = useState(false)

  const codeLines = [
    "class VibeCoder {",
    "  constructor() {",
    "    this.passion = 'unlimited';",
    "    this.skills = ['HTML', 'CSS', 'JS'];",
    "    this.ai = new AIEnhancer();",
    "  }",
    "",
    "  createMagic() {",
    "    return this.code + this.vibe;",
    "  }",
    "",
    "  embraceAI() {",
    "    this.abilities *= AI_MULTIPLIER;",
    "  }",
    "}"
  ]

  const syntaxHighlight = (code) => {
    return code
      .replace(/\b(class|constructor|new|return|this)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(VibeCoder|AIEnhancer|AI_MULTIPLIER)\b/g, '<span class="variable">$1</span>')
      .replace(/(['"])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span class="string">$1$2$3</span>')
      .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
      .replace(/(\w+)(?=\s*[\(\{])/g, '<span class="function">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
  }

  useEffect(() => {
    let lineIndex = 0
    let charIndex = 0
    let currentCode = ''

    const typeCode = () => {
      if (lineIndex < codeLines.length) {
        const line = codeLines[lineIndex]

        if (charIndex < line.length) {
          currentCode += line.charAt(charIndex)
          charIndex++
        } else {
          currentCode += '\n'
          lineIndex++
          charIndex = 0
        }

        setTypedCode(syntaxHighlight(currentCode))

        const speed = line?.charAt(charIndex - 1) === ' ' ? 30 : Math.random() * 100 + 50
        setTimeout(typeCode, speed)
      }
    }

    const timer = setTimeout(typeCode, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
          setStatsAnimated(true)
          animateStats()
        }
      },
      { threshold: 0.5 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [statsAnimated])

  const animateStats = () => {
    const targets = { projects: 150, ai: 50, coffee: 1000 }
    const increments = {
      projects: targets.projects / 100,
      ai: targets.ai / 100,
      coffee: targets.coffee / 100
    }

    let current = { projects: 0, ai: 0, coffee: 0 }

    const timer = setInterval(() => {
      let completed = 0

      Object.keys(targets).forEach(key => {
        if (current[key] < targets[key]) {
          current[key] = Math.min(current[key] + increments[key], targets[key])
        } else {
          completed++
        }
      })

      setStats({
        projects: Math.floor(current.projects),
        ai: Math.floor(current.ai),
        coffee: Math.floor(current.coffee)
      })

      if (completed === Object.keys(targets).length) {
        clearInterval(timer)
      }
    }, 20)
  }

  return (
    <section className="section active hero">
      <div className="hero-content">
        <div className="code-window">
          <div className="window-header">
            <div className="window-buttons">
              <div className="btn close"></div>
              <div className="btn minimize"></div>
              <div className="btn maximize"></div>
            </div>
            <span className="window-title">~/developer/mohamedouox.js</span>
          </div>
          <div className="code-content">
            <pre dangerouslySetInnerHTML={{ __html: typedCode }}></pre>
          </div>
        </div>

        <div className="hero-text">
          <h1 className="glitch" data-text="VIBE CODER">
            VIBE CODER
          </h1>
          <p className="hero-subtitle">
            crafting digital experiences with{' '}
            <span className="ai-text">artificial intelligence</span> & pure passion
          </p>
          <div className="cta-buttons">
            <button
              className="btn-primary"
              onClick={() => onSectionChange('work')}
            >
              VIEW WORK
            </button>
            <button
              className="btn-secondary"
              onClick={() => onSectionChange('contact')}
            >
              GET IN TOUCH
            </button>
          </div>
        </div>
      </div>

      <div className="stats" ref={statsRef}>
        <div className="stat-item">
          <div className="stat-number">{stats.projects}</div>
          <div className="stat-label">projects coded</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.ai}</div>
          <div className="stat-label">AI integrations</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.coffee}</div>
          <div className="stat-label">coffee cups</div>
        </div>
      </div>
    </section>
  )
}

export default Hero