import { useEffect, useState } from 'react'

const Navigation = ({ activeSection, onSectionChange }) => {
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { id: 'home', label: 'home' },
    { id: 'about', label: 'about' },
    { id: 'work', label: 'work' },
    { id: 'blog', label: 'blog' },
    { id: 'contact', label: 'contact' }
  ]

  return (
    <nav className="nav">
      <div className="nav-brand">
        <span className="terminal-prompt">$</span>
        <span className="brand-text">mohamedouox</span>
        <span className={`cursor ${cursorVisible ? 'visible' : 'hidden'}`}>_</span>
      </div>

      <div className="nav-links">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="ai-status">
        <div className="ai-indicator"></div>
        <span>AI_ENHANCED</span>
      </div>
    </nav>
  )
}

export default Navigation