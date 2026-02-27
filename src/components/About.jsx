const About = () => {
  const frontendTechs = ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue']
  const aiTechs = ['OpenAI API', 'Claude API', 'Machine Learning', 'Neural Networks']

  return (
    <section className="section active">
      <div className="container">
        <h2 className="section-title">
          <span className="section-number">01.</span>
          ABOUT_THE_VIBE
        </h2>

        <div className="about-content">
          <div className="about-text">
            <p className="lead">
              I'm a <span className="highlight">vibe coder</span> - someone who doesn't just write code, but crafts digital poetry. Every line is intentional, every function has soul.
            </p>

            <p>
              My journey started with HTML and CSS, evolved through JavaScript mastery, and now I'm riding the <span className="ai-text">AI wave</span> to create experiences that feel almost magical.
            </p>

            <div className="tech-grid">
              <div className="tech-category">
                <h4>Frontend Mastery</h4>
                <div className="tech-items">
                  {frontendTechs.map(tech => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="tech-category">
                <h4>AI Integration</h4>
                <div className="tech-items">
                  {aiTechs.map(tech => (
                    <span key={tech} className="tech-tag ai">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="about-visual">
            <div className="code-art">
              <div className="code-line">
                <span className="keyword">const</span>{' '}
                <span className="variable">developer</span>{' '}
                <span className="operator">=</span>{' '}
                <span className="brace">{'{'}</span>
              </div>
              <div className="code-line indent">
                <span className="property">name:</span>{' '}
                <span className="string">'mohamedouox'</span>,
              </div>
              <div className="code-line indent">
                <span className="property">passion:</span>{' '}
                <span className="string">'vibe coding'</span>,
              </div>
              <div className="code-line indent">
                <span className="property">loves:</span>{' '}
                <span className="array">['AI', 'clean code', 'coffee']</span>,
              </div>
              <div className="code-line indent">
                <span className="property">motto:</span>{' '}
                <span className="string">'code with soul'</span>
              </div>
              <div className="code-line">
                <span className="brace">{'}'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About