const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { asyncHandler } = require('../utils/middleware')
const { Op } = require('sequelize')

blogsRouter.get('/', asyncHandler(async (request, response) => {
  const { search } = request.query
  
  const where = {}
  
  // Exercise 13.13 & 13.14: Filter by search keyword in title or author (case-insensitive)
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { author: { [Op.iLike]: `%${search}%` } }
    ]
  }
  
  const blogs = await Blog.findAll({
    where,
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'username'] 
    },
    order: [['likes', 'DESC']]
  })
  response.json(blogs)
}))

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
    userId: request.user.id 
  })

  const blogWithUser = await Blog.findByPk(blog.id, {
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'username']
    }
  })

  response.status(201).json(blogWithUser)
}))

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

blogsRouter.put('/:id', asyncHandler(async (request, response) => {
  const { likes } = request.body

  const blog = await Blog.findByPk(parseInt(request.params.id))

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  blog.likes = likes
  const updatedBlog = await blog.save()

  response.json(updatedBlog)
}))

blogsRouter.delete('/:id', asyncHandler(async (request, response) => {
  if (!request.user || !request.user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findByPk(parseInt(request.params.id))

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (!blog.userId || blog.userId !== request.user.id) {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }

  await blog.destroy()
  response.status(204).end()
}))

module.exports = blogsRouter
