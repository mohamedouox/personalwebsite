import { useState, useEffect } from 'react'
import BlogPost from './BlogPost'
import BlogModal from './BlogModal'
import apiService from '../services/api'

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadBlogPosts()
  }, [])

  const loadBlogPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiService.getAllPosts()

      if (response.success) {
        setPosts(response.data)
      } else {
        throw new Error(response.error || 'Failed to load posts')
      }
    } catch (err) {
      console.error('Failed to load blog posts:', err)
      setError(err.message)

      // Fallback to localStorage for offline functionality
      const savedPosts = localStorage.getItem('blogPosts')
      if (savedPosts) {
        setPosts(JSON.parse(savedPosts))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddPost = async (postData, imageFile) => {
    try {
      setError(null)

      const response = await apiService.createPost(postData, imageFile)

      if (response.success) {
        // Add the new post to the beginning of the list
        setPosts(prevPosts => [response.data, ...prevPosts])
        setIsModalOpen(false)

        // Update localStorage as backup
        const updatedPosts = [response.data, ...posts]
        localStorage.setItem('blogPosts', JSON.stringify(updatedPosts))
      } else {
        throw new Error(response.error || 'Failed to create post')
      }
    } catch (err) {
      console.error('Failed to create post:', err)
      setError(err.message)
    }
  }

  return (
    <section className="section active">
      <div className="container">
        <h2 className="section-title">
          <span className="section-number">03.</span>
          VIBE_BLOG
        </h2>

        <div className="blog-controls">
          <button
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            NEW POST
          </button>
        </div>

        {error && (
          <div className="error-message" style={{
            background: 'rgba(255, 0, 128, 0.1)',
            border: '1px solid rgba(255, 0, 128, 0.3)',
            color: 'var(--neon-pink)',
            padding: '1rem',
            borderRadius: 'var(--border-radius)',
            marginBottom: '2rem',
            fontFamily: 'var(--font-mono)'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div className="blog-posts">
          {loading ? (
            <div style={{
              textAlign: 'center',
              color: 'var(--electric-blue)',
              padding: '3rem',
              fontFamily: 'var(--font-mono)'
            }}>
              <div className="loading-spinner" style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                border: '2px solid var(--electric-blue)',
                borderRadius: '50%',
                borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite',
                marginRight: '0.5rem'
              }}></div>
              Loading vibe posts...
            </div>
          ) : posts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: 'var(--secondary-text)',
              padding: '3rem'
            }}>
              <p>No posts yet. Create your first vibe post!</p>
            </div>
          ) : (
            posts.map(post => (
              <BlogPost key={post.id} post={post} />
            ))
          )}
        </div>

        <BlogModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddPost}
        />
      </div>
    </section>
  )
}

export default Blog