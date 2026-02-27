import { useState, useEffect } from 'react'

const Contact = () => {
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const contactMethods = [
    {
      icon: '@',
      text: 'mohamedouox@example.com',
      href: 'mailto:mohamedouox@example.com'
    },
    {
      icon: '#',
      text: '@mohamedouox',
      href: '#'
    },
    {
      icon: '⚡',
      text: 'Available for projects',
      href: '#'
    }
  ]

  return (
    <section className="section active">
      <div className="container">
        <h2 className="section-title">
          <span className="section-number">04.</span>
          CONNECT
        </h2>

        <div className="contact-content">
          <div className="contact-text">
            <p className="lead">
              Ready to create something amazing together? Let's vibe and build the future.
            </p>

            <div className="contact-methods">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.href}
                  className="contact-method"
                >
                  <span className="method-icon">{method.icon}</span>
                  <span className="method-text">{method.text}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="contact-visual">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <div className="btn close"></div>
                  <div className="btn minimize"></div>
                  <div className="btn maximize"></div>
                </div>
                <span className="terminal-title">Contact Terminal</span>
              </div>
              <div className="terminal-content">
                <div className="terminal-line">
                  <span className="prompt">visitor@mohamedouox.dev:~$</span>
                  <span className="command">whoami</span>
                </div>
                <div className="terminal-line">
                  <span className="output">future_collaborator</span>
                </div>
                <div className="terminal-line">
                  <span className="prompt">visitor@mohamedouox.dev:~$</span>
                  <span className="command">connect --with mohamedouox</span>
                </div>
                <div className="terminal-line">
                  <span className="output success">Connection established ✓</span>
                </div>
                <div className="terminal-line">
                  <span className="prompt">visitor@mohamedouox.dev:~$</span>
                  <span className={`cursor-blink ${cursorVisible ? 'visible' : 'hidden'}`}>_</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact