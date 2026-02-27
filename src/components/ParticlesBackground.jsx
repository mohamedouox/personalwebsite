import { useEffect } from 'react'

const ParticlesBackground = () => {
  useEffect(() => {
    const particlesContainer = document.getElementById('particles')
    const particleCount = 50

    const createParticle = () => {
      const particle = document.createElement('div')
      particle.className = 'particle'

      // Random position
      particle.style.left = Math.random() * 100 + 'vw'
      particle.style.top = Math.random() * 100 + 'vh'

      // Random animation delay
      particle.style.animationDelay = Math.random() * 6 + 's'

      // Random size
      const size = Math.random() * 3 + 1
      particle.style.width = size + 'px'
      particle.style.height = size + 'px'

      return particle
    }

    // Create initial particles
    for (let i = 0; i < particleCount; i++) {
      const particle = createParticle()
      particlesContainer?.appendChild(particle)
    }

    // Handle visibility change for performance
    const handleVisibilityChange = () => {
      const particles = document.querySelectorAll('.particle')
      particles.forEach(particle => {
        if (document.hidden) {
          particle.style.animationPlayState = 'paused'
        } else {
          particle.style.animationPlayState = 'running'
        }
      })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return <div className="particles-container" id="particles"></div>
}

export default ParticlesBackground