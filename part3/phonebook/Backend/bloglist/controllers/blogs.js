const blogsRouter = require('express').Router()
const Blog = require('../models/person')

// GET all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// POST a new blog
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter
