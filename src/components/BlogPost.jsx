const BlogPost = ({ post }) => {
  // Handle both image_url (from API) and image (from localStorage fallback)
  const imageUrl = post.image_url || post.image

  return (
    <article className="blog-post">
      {imageUrl && (
        <div className="blog-post-image-container">
          <img
            src={imageUrl}
            alt={post.title}
            className="blog-post-image"
            loading="lazy"
            onError={(e) => {
              // Hide broken images gracefully
              e.target.style.display = 'none'
              e.target.nextSibling?.classList.add('no-image')
            }}
          />
          <div className="image-overlay">
            <div className="image-info">
              <span className="image-label">📸 Vibe Shot</span>
            </div>
          </div>
        </div>
      )}
      <div className={`blog-post-content ${!imageUrl ? 'no-image' : ''}`}>
        <div className="post-header">
          <h3 className="blog-post-title">{post.title}</h3>
          <div className="blog-post-meta">
            <div className="blog-post-date">{post.date}</div>
            {imageUrl && (
              <div className="post-badge">
                <span className="badge-icon">🖼️</span>
                <span className="badge-text">Visual</span>
              </div>
            )}
          </div>
        </div>
        <div className="blog-post-text">{post.content}</div>

        {/* Reading time estimate */}
        <div className="post-footer">
          <div className="reading-time">
            ⏱️ {Math.max(1, Math.ceil(post.content.split(' ').length / 200))} min read
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogPost