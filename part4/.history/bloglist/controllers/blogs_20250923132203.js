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

// Delete a blog by id
blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  try {
    const result = await Blog.findByIdAndDelete(id)
    if (result) {
      return response.status(204).end() // 204 No Content
    } else {
      return response.status(404).json({ error: 'Blog not found' })
    }
  } catch (error) {
    return response.status(400).json({ error: 'Invalid ID' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const update = request.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, update, {
      new: true,
      runva
    })
  }
} )


module.exports = blogsRouter
