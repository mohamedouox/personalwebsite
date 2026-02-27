# Vibe Coder Backend Server

Express.js backend server for the mohamedouox vibe coder website with SQLite database and Cloudinary image uploads.

## 🚀 Features

- **RESTful API** for blog post management
- **SQLite Database** with better-sqlite3 for performance
- **Cloudinary Integration** for optimized image uploads
- **Security Middleware** (Helmet, CORS, Rate Limiting)
- **Automatic Database Initialization** with sample data
- **Image Optimization** with automatic format conversion
- **Slug Generation** for SEO-friendly URLs

## 📋 Prerequisites

- Node.js 16+
- Cloudinary account (for image uploads)

## ⚡ Quick Start

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # Cloudinary credentials (get from cloudinary.com)
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

5. **Initialize database:**
   ```bash
   npm run init-db
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```

The server will be running at `http://localhost:5000` 🎉

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/blog/posts` | Get all published posts |
| GET | `/api/blog/posts/:id` | Get single post by ID or slug |
| POST | `/api/blog/posts` | Create new post (with image upload) |
| PUT | `/api/blog/posts/:id` | Update existing post |
| DELETE | `/api/blog/posts/:id` | Delete post and associated image |

## 🖼️ Image Upload

The server automatically handles image optimization with Cloudinary:

- **Automatic format conversion** (WebP, AVIF for modern browsers)
- **Quality optimization** (auto:good)
- **Size limiting** (max 1200x800px)
- **Organized storage** in `vibe-blog/posts` folder

## 🗄️ Database Schema

### Posts Table
```sql
posts (
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
```

## 🔧 Scripts

```bash
npm start          # Production server
npm run dev        # Development with nodemon
npm run init-db    # Initialize database with sample data
```

## 🛡️ Security Features

- **Helmet.js** for security headers
- **CORS** configuration for frontend access
- **Rate limiting** (100 requests per 15 minutes)
- **File type validation** for image uploads
- **SQL injection protection** with prepared statements

## 📁 Project Structure

```
server/
├── config/
│   └── cloudinary.js      # Cloudinary setup
├── models/
│   └── database.js        # Database models & schema
├── routes/
│   └── blog.js           # Blog API routes
├── scripts/
│   └── init-db.js        # Database initialization
├── database/             # SQLite database files (auto-created)
├── .env.example          # Environment template
├── package.json
├── server.js            # Main server file
└── README.md
```

## 🌐 Frontend Integration

Update your React frontend's environment variables:

```env
# In vite-project/.env
VITE_API_URL=http://localhost:5000/api
```

The frontend will automatically use the API when available and fallback to localStorage for offline functionality.

## 🚨 Troubleshooting

### Database Issues
```bash
# Reset database
rm -rf database/
npm run init-db
```

### Image Upload Issues
- Verify Cloudinary credentials in `.env`
- Check file size (max 10MB)
- Ensure file is a valid image format

### CORS Issues
- Verify `FRONTEND_URL` in `.env` matches your frontend URL
- Check that the frontend is running on the correct port

## 📝 Development Notes

- Database is automatically created in `./database/vibe_blog.db`
- Sample blog posts are inserted on first run
- Images are stored in Cloudinary under `vibe-blog/posts/`
- All database queries use prepared statements for performance
- Automatic slug generation from post titles

Ready to handle some AI-enhanced vibe coding! ✨