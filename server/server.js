const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const blogRoutes = require('./routes/blog')
const { initDatabase } = require('./models/database')

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

app.use(limiter)

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Initialize database
initDatabase()

// Routes
app.use('/api/blog', blogRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'mohamedouox vibe coder API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'The vibe you\'re looking for doesn\'t exist 🤖'
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error)

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development'

  res.status(error.status || 500).json({
    error: error.message || 'Internal Server Error',
    ...(isDevelopment && { stack: error.stack })
  })
})

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════════════╗
  ║                                                              ║
  ║    🚀 VIBE CODER API SERVER RUNNING                         ║
  ║                                                              ║
  ║    Port: ${PORT.toString().padEnd(54)} ║
  ║    Environment: ${(process.env.NODE_ENV || 'development').padEnd(47)} ║
  ║    Frontend: ${(process.env.FRONTEND_URL || 'http://localhost:5173').padEnd(49)} ║
  ║                                                              ║
  ║    API Endpoints:                                            ║
  ║    • GET  /api/health                                        ║
  ║    • GET  /api/blog/posts                                    ║
  ║    • POST /api/blog/posts                                    ║
  ║    • GET  /api/blog/posts/:id                                ║
  ║    • PUT  /api/blog/posts/:id                                ║
  ║    • DELETE /api/blog/posts/:id                              ║
  ║                                                              ║
  ║    Ready to handle some AI-enhanced vibe coding! ✨         ║
  ║                                                              ║
  ╚══════════════════════════════════════════════════════════════╝
  `)
})