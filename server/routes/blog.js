const express = require('express')
const router = express.Router()
const { createSlug, dbGet, dbAll, dbRun } = require('../models/database')
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary')

// SQL queries
const SELECT_ALL_POSTS = `
  SELECT id, title, content, image_url, slug, created_at, updated_at, published
  FROM posts
  WHERE published = 1
  ORDER BY created_at DESC
`

const SELECT_POST_BY_ID = `
  SELECT id, title, content, image_url, image_public_id, slug, created_at, updated_at, published
  FROM posts
  WHERE id = ? AND published = 1
`

const SELECT_POST_BY_SLUG = `
  SELECT id, title, content, image_url, image_public_id, slug, created_at, updated_at, published
  FROM posts
  WHERE slug = ? AND published = 1
`

const INSERT_POST = `
  INSERT INTO posts (title, content, image_url, image_public_id, slug)
  VALUES (?, ?, ?, ?, ?)
`

const UPDATE_POST = `
  UPDATE posts
  SET title = ?, content = ?, image_url = ?, image_public_id = ?, slug = ?
  WHERE id = ?
`

const DELETE_POST = `
  DELETE FROM posts WHERE id = ?
`

// GET /api/blog/posts - Get all published posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await dbAll(SELECT_ALL_POSTS)

    // Format dates for frontend
    const formattedPosts = posts.map(post => ({
      ...post,
      date: new Date(post.created_at).toLocaleDateString(),
      created_at: post.created_at,
      updated_at: post.updated_at
    }))

    res.json({
      success: true,
      data: formattedPosts,
      count: formattedPosts.length
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts'
    })
  }
})

// GET /api/blog/posts/:identifier - Get single post by ID or slug
router.get('/posts/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params
    let post

    // Try to get by ID first (if it's a number), then by slug
    if (/^\d+$/.test(identifier)) {
      post = await dbGet(SELECT_POST_BY_ID, [parseInt(identifier)])
    } else {
      post = await dbGet(SELECT_POST_BY_SLUG, [identifier])
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      })
    }

    // Format date for frontend
    const formattedPost = {
      ...post,
      date: new Date(post.created_at).toLocaleDateString()
    }

    res.json({
      success: true,
      data: formattedPost
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch post'
    })
  }
})

// POST /api/blog/posts - Create new post
router.post('/posts', upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      })
    }

    if (title.length > 200) {
      return res.status(400).json({
        success: false,
        error: 'Title must be less than 200 characters'
      })
    }

    if (content.length > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Content must be less than 50,000 characters'
      })
    }

    // Generate slug
    let slug = createSlug(title)

    // Ensure slug is unique
    let counter = 1
    let originalSlug = slug
    let existingPost = await dbGet(SELECT_POST_BY_SLUG, [slug])
    while (existingPost) {
      slug = `${originalSlug}-${counter}`
      counter++
      existingPost = await dbGet(SELECT_POST_BY_SLUG, [slug])
    }

    let imageUrl = null
    let imagePublicId = null

    // Handle image upload if provided
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname,
          'vibe-blog/posts'
        )
        imageUrl = uploadResult.url
        imagePublicId = uploadResult.public_id
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError)
        return res.status(500).json({
          success: false,
          error: 'Failed to upload image'
        })
      }
    }

    // Insert post into database
    const result = await dbRun(INSERT_POST, [title, content, imageUrl, imagePublicId, slug])

    // Get the created post
    const createdPost = await dbGet(SELECT_POST_BY_ID, [result.lastID])

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: {
        ...createdPost,
        date: new Date(createdPost.created_at).toLocaleDateString()
      }
    })

  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create post'
    })
  }
})

// PUT /api/blog/posts/:id - Update existing post
router.put('/posts/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params
    const { title, content } = req.body

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid post ID is required'
      })
    }

    // Check if post exists
    const existingPost = await dbGet(SELECT_POST_BY_ID, [parseInt(id)])
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      })
    }

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      })
    }

    // Generate new slug if title changed
    let slug = existingPost.slug
    if (title !== existingPost.title) {
      slug = createSlug(title)

      // Ensure slug is unique (excluding current post)
      let counter = 1
      let originalSlug = slug
      let tempPost = await dbGet(SELECT_POST_BY_SLUG, [slug])
      while (tempPost && tempPost.id !== parseInt(id)) {
        slug = `${originalSlug}-${counter}`
        counter++
        tempPost = await dbGet(SELECT_POST_BY_SLUG, [slug])
      }
    }

    let imageUrl = existingPost.image_url
    let imagePublicId = existingPost.image_public_id

    // Handle image update
    if (req.file) {
      try {
        // Delete old image if exists
        if (existingPost.image_public_id) {
          await deleteFromCloudinary(existingPost.image_public_id)
        }

        // Upload new image
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname,
          'vibe-blog/posts'
        )
        imageUrl = uploadResult.url
        imagePublicId = uploadResult.public_id
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError)
        return res.status(500).json({
          success: false,
          error: 'Failed to upload image'
        })
      }
    }

    // Update post in database
    await dbRun(UPDATE_POST, [title, content, imageUrl, imagePublicId, slug, parseInt(id)])

    // Get the updated post
    const updatedPost = await dbGet(SELECT_POST_BY_ID, [parseInt(id)])

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: {
        ...updatedPost,
        date: new Date(updatedPost.created_at).toLocaleDateString()
      }
    })

  } catch (error) {
    console.error('Error updating post:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update post'
    })
  }
})

// DELETE /api/blog/posts/:id - Delete post
router.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid post ID is required'
      })
    }

    // Check if post exists and get image info
    const existingPost = await dbGet(SELECT_POST_BY_ID, [parseInt(id)])
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      })
    }

    // Delete image from Cloudinary if exists
    if (existingPost.image_public_id) {
      try {
        await deleteFromCloudinary(existingPost.image_public_id)
      } catch (cloudinaryError) {
        console.error('Failed to delete image from Cloudinary:', cloudinaryError)
        // Continue with post deletion even if image deletion fails
      }
    }

    // Delete post from database
    const result = await dbRun(DELETE_POST, [parseInt(id)])

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      })
    }

    res.json({
      success: true,
      message: 'Post deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete post'
    })
  }
})

module.exports = router