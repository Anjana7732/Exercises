const readinglistsRouter = require('express').Router()
const ReadingList = require('../models/readinglist')
const Blog = require('../models/blog')
const User = require('../models/user')
const { asyncHandler } = require('../utils/middleware')

// POST /api/readinglists - Add blog to reading list (Exercise 13.20)
readinglistsRouter.post('/', asyncHandler(async (request, response) => {
  const { blogId, userId } = request.body

  if (!blogId || !userId) {
    return response.status(400).json({ error: 'blogId and userId are required' })
  }

  // Check if blog exists
  const blog = await Blog.findByPk(blogId)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // Check if user exists
  const user = await User.findByPk(userId)
  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }

  // Check if already in reading list
  const existing = await ReadingList.findOne({
    where: {
      userId,
      blogId
    }
  })

  if (existing) {
    return response.status(400).json({ error: 'blog already in reading list' })
  }

  // Create reading list entry
  const readingList = await ReadingList.create({
    userId,
    blogId,
    read: false
  })

  response.status(201).json(readingList)
}))

// PUT /api/readinglists/:id - Mark blog as read (Exercise 13.22)
readinglistsRouter.put('/:id', asyncHandler(async (request, response) => {
  const { read } = request.body
  const readingListId = parseInt(request.params.id)

  if (!request.user || !request.user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (typeof read !== 'boolean') {
    return response.status(400).json({ error: 'read must be a boolean' })
  }

  const readingList = await ReadingList.findByPk(readingListId)

  if (!readingList) {
    return response.status(404).json({ error: 'reading list entry not found' })
  }

  // Check if user owns this reading list entry
  if (readingList.userId !== request.user.id) {
    return response.status(403).json({ error: 'can only mark own reading list entries as read' })
  }

  readingList.read = read
  await readingList.save()

  response.json(readingList)
}))

module.exports = readinglistsRouter

