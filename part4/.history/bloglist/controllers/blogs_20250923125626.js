const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
    throw error
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  try {
    const result = await Blog.findByIdAndDelete(id)
    if (result) {
      return
    }
  }
})

module.exports = blogsRouter
