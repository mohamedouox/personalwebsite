const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

// Create database connection
const dbPath = path.join(__dirname, '..', 'database', 'vibe_blog.db')

// Initialize database connection
let db = null

const initDatabase = async () => {
  try {
    // Create database directory if it doesn't exist
    const dbDir = path.dirname(dbPath)
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }

    // Connect to database
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Database connection failed:', err)
        throw err
      }
      console.log('🔗 Connected to SQLite database')
    })

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON')

    // Create posts table
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          image_url TEXT,
          image_public_id TEXT,
          slug TEXT UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          published BOOLEAN DEFAULT 1
        )
      `, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    // Create trigger to update updated_at timestamp
    await new Promise((resolve, reject) => {
      db.run(`
        CREATE TRIGGER IF NOT EXISTS update_posts_timestamp
        AFTER UPDATE ON posts
        BEGIN
          UPDATE posts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END
      `, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    console.log('✅ Database initialized successfully')

    // Insert sample data if table is empty
    const count = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM posts', (err, row) => {
        if (err) reject(err)
        else resolve(row.count)
      })
    })

    if (count === 0) {
      console.log('📝 Adding sample blog posts...')
      await insertSamplePosts()
    }

  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    throw error
  }
}

const insertSamplePosts = async () => {
  const samplePosts = [
    {
      title: 'Welcome to My Vibe Coding Journey',
      content: `Hey everyone! 👋

This is the beginning of something amazing. I'm mohamedouox, and I'm what you might call a "vibe coder" - someone who doesn't just write code, but crafts digital experiences with soul and passion.

My journey combines the art of traditional web development with the power of artificial intelligence. Every project I work on is an opportunity to explore new possibilities and push the boundaries of what's possible when human creativity meets AI enhancement.

Here, I'll be sharing:
- 🚀 My latest projects and experiments
- 🤖 AI integration insights and discoveries
- 💡 Coding tips and techniques
- ☕ Random thoughts over coffee

Stay tuned for more vibe-driven content!`,
      slug: 'welcome-to-my-vibe-coding-journey',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Why I Love Working with AI',
      content: `Artificial Intelligence isn't just a buzzword for me - it's a creative partner that amplifies my coding abilities in ways I never imagined.

Here's why AI has become an integral part of my development workflow:

**Enhanced Creativity**: AI helps me brainstorm solutions and explore approaches I might not have considered. It's like having a brilliant pair programming partner available 24/7.

**Rapid Prototyping**: With AI-assisted code generation, I can quickly prototype ideas and iterate faster than ever before.

**Learning Accelerator**: AI tools help me understand new frameworks, libraries, and concepts by providing personalized explanations and examples.

**Code Quality**: AI-powered analysis helps me write cleaner, more efficient code and catch potential issues early.

The future of development is human creativity enhanced by artificial intelligence, and I'm excited to be part of this revolution! 🌟`,
      slug: 'why-i-love-working-with-ai',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Building This Website: A Technical Deep Dive',
      content: `Let me walk you through the technical stack and design decisions behind this website - it's a perfect example of modern web development with AI enhancement!

**Frontend Stack:**
- ⚛️ React + Vite for blazing-fast development
- 🎨 Custom CSS with cyber-organic design system
- 🌊 Interactive neural network canvas animations
- ✨ Particle system for ambient background effects

**Backend Architecture:**
- 🚀 Express.js API server
- 🗄️ SQLite with sqlite3 for reliability
- ☁️ Cloudinary for optimized image handling
- 🔒 Security with Helmet and rate limiting

**Design Philosophy:**
The cyber-organic aesthetic represents the fusion of human creativity (organic) with AI enhancement (cyber). Every animation, color choice, and interaction is intentional.

**AI Integration:**
From design inspiration to code optimization, AI tools were instrumental in bringing this vision to life while maintaining my personal coding style and preferences.

The result? A website that's not just functional, but has personality and soul! 💫`,
      slug: 'building-this-website-technical-deep-dive',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  for (const post of samplePosts) {
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO posts (title, content, slug, created_at) VALUES (?, ?, ?, ?)',
        [post.title, post.content, post.slug, post.created_at],
        (err) => {
          if (err) reject(err)
          else resolve()
        }
      )
    })
  }

  console.log('✅ Sample posts added successfully')
}

// Helper function to create slug from title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Database query helpers using promises
const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve({ lastID: this.lastID, changes: this.changes })
    })
  })
}

module.exports = {
  initDatabase,
  createSlug,
  dbGet,
  dbAll,
  dbRun
}