const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { asyncHandler } = require('../utils/middleware')

// Exercise 13.12: GET all blogs - include user information
blogsRouter.get('/', asyncHandler(async (request, response) => {
  const blogs = await Blog.findAll({
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'username'] // Don't include password hash
    }
  })
  response.json(blogs)
}))

// Exercise 13.10: POST new blog - requires authentication
blogsRouter.post('/', asyncHandler(async (request, response) => {
  const body = request.body

  if (!request.user || !request.user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.create({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    userId: request.user.id // Exercise 13.10: Link blog to user
  })

  // Exercise 13.12: Include user in response
  const blogWithUser = await Blog.findByPk(blog.id, {
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'username']
    }
  })

  response.status(201).json(blogWithUser)
}))

// GET a single blog by id
blogsRouter.get('/:id', asyncHandler(async (request, response) => {
  const blog = await Blog.findByPk(parseInt(request.params.id), {
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'username']
    }
  })
  
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  
  response.json(blog)
}))

// PUT update blog likes
blogsRouter.put('/:id', asyncHandler(async (request, response) => {
  const { likes } = request.body

  // Only update likes using numeric id
  const blog = await Blog.findByPk(parseInt(request.params.id))

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  blog.likes = likes
  const updatedBlog = await blog.save()

  response.json(updatedBlog)
}))

// Exercise 13.11: DELETE a blog by id - only by the user who created it
blogsRouter.delete('/:id', asyncHandler(async (request, response) => {
  if (!request.user || !request.user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findByPk(parseInt(request.params.id))

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // Exercise 13.11: Check if user owns the blog
  // Also handle case where blog.userId might be null (shouldn't happen after migration)
  if (!blog.userId || blog.userId !== request.user.id) {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await blog.destroy()
  response.status(204).end()
}))

module.exports = blogsRouter
