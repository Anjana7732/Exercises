const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { asyncHandler } = require('../utils/middleware')

// GET all blogs
blogsRouter.get('/', asyncHandler(async (request, response) => {
  const blogs = await Blog.findAll()
  response.json(blogs)
}))

// POST new blog
blogsRouter.post('/', asyncHandler(async (request, response) => {
  const body = request.body

  const blog = await Blog.create({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  response.status(201).json(blog)
}))

// GET a single blog by id
blogsRouter.get('/:id', asyncHandler(async (request, response) => {
  const blog = await Blog.findByPk(parseInt(request.params.id))
  
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

// DELETE a blog by id
blogsRouter.delete('/:id', asyncHandler(async (request, response) => {
  const blog = await Blog.findByPk(parseInt(request.params.id))

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  await blog.destroy()
  response.status(204).end()
}))

module.exports = blogsRouter
