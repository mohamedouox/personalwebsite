#!/usr/bin/env node

/**
 * Database initialization script
 * Run with: npm run init-db
 */

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const { initDatabase } = require('../models/database')

console.log('🚀 Initializing vibe coder database...')

try {
  initDatabase()
  console.log('✅ Database initialization completed successfully!')
  console.log('📄 You can now start the server with: npm run dev')
} catch (error) {
  console.error('❌ Database initialization failed:', error.message)
  process.exit(1)
}