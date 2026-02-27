const Work = () => {
  const projects = [
    {
      id: 1,
      title: "AI-Powered Portfolio",
      description: "A dynamic portfolio that uses AI to generate personalized content based on visitor interests.",
      tags: ["JavaScript", "OpenAI", "CSS3"],
      codeSnippet: "<AI-Enhanced>"
    },
    {
      id: 2,
      title: "Neural Network Visualizer",
      description: "Interactive visualization tool for understanding neural network architectures and training.",
      tags: ["React", "D3.js", "ML"],
      codeSnippet: "<VibeCoder/>"
    },
    {
      id: 3,
      title: "Intelligent Code Generator",
      description: "AI-powered tool that generates clean, optimized code based on natural language descriptions.",
      tags: ["Vue.js", "Claude API", "Node.js"],
      codeSnippet: "<SoulCode/>"
    }
  ]

  return (
    <section className="section active">
      <div className="container">
        <h2 className="section-title">
          <span className="section-number">02.</span>
          FEATURED_WORK
        </h2>

        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <div className="placeholder-image">
                  <div className="code-snippet">
                    <span>{project.codeSnippet}</span>
                  </div>
                </div>
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Work