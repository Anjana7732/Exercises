const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { asyncHandler } = require('../utils/middleware')

// GET all blogs
blogsRouter.get('/', asyncHandler(async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
}))

// POST new blog
blogsRouter.post('/', asyncHandler(async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
}))

// GET a single blog by id
blogsRouter.get('/:id', asyncHandler(async (request, response) => {
  const blog = await Blog.findOne({ id: parseInt(request.params.id) })
  
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  
  response.json(blog)
}))

// PUT update blog likes
blogsRouter.put('/:id', asyncHandler(async (request, response) => {
  const { likes } = request.body

  // Only update likes using numeric id
  const updatedBlog = await Blog.findOneAndUpdate(
    { id: parseInt(request.params.id) },
    { likes },
    { new: true, runValidators: true }
  )

  if (!updatedBlog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  response.json(updatedBlog)
}))

module.exports = blogsRouter
