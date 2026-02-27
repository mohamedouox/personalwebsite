// API service for communicating with the backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Don't set Content-Type for FormData (multipart uploads)
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type']
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Blog API methods
  async getAllPosts() {
    return this.request('/blog/posts')
  }

  async getPost(id) {
    return this.request(`/blog/posts/${id}`)
  }

  async createPost(postData, imageFile) {
    const formData = new FormData()
    formData.append('title', postData.title)
    formData.append('content', postData.content)

    if (imageFile) {
      formData.append('image', imageFile)
    }

    return this.request('/blog/posts', {
      method: 'POST',
      body: formData,
    })
  }

  async updatePost(id, postData, imageFile) {
    const formData = new FormData()
    formData.append('title', postData.title)
    formData.append('content', postData.content)

    if (imageFile) {
      formData.append('image', imageFile)
    }

    return this.request(`/blog/posts/${id}`, {
      method: 'PUT',
      body: formData,
    })
  }

  async deletePost(id) {
    return this.request(`/blog/posts/${id}`, {
      method: 'DELETE',
    })
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }
}

export const apiService = new ApiService()
export default apiService