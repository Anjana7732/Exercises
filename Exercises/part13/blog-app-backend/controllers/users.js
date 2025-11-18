const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { asyncHandler } = require('../utils/middleware')
usersRouter.post('/', asyncHandler(async (request, response) => {
  const { name, username, password } = request.body


  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password || 'secret', saltRounds)

  const user = await User.create({
    name,
    username,
    passwordHash
  })

  const userResponse = user.toJSON()
  delete userResponse.passwordHash

  response.status(201).json(userResponse)
}))

usersRouter.get('/', asyncHandler(async (request, response) => {
  const Blog = require('../models/blog')
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] }, 
    include: {
      model: Blog,
      as: 'blogs' 
    }
  })
  response.json(users)
}))


usersRouter.put('/:username', asyncHandler(async (request, response) => {
  const { username: newUsername } = request.body
  const oldUsername = request.params.username

  const user = await User.findOne({ where: { username: oldUsername } })

  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }

  user.username = newUsername
  const updatedUser = await user.save()

  const userResponse = updatedUser.toJSON()
  delete userResponse.passwordHash

  response.json(userResponse)
}))

usersRouter.get('/:id', asyncHandler(async (request, response) => {
  const Blog = require('../models/blog')
  const ReadingList = require('../models/readinglist')
  const userId = parseInt(request.params.id)
  const { read } = request.query

  const user = await User.findByPk(userId, {
    attributes: { exclude: ['passwordHash'] }
  })

  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }

  // Build where clause for reading list filtering (Exercise 13.23)
  const readingListWhere = {}
  if (read !== undefined) {
    readingListWhere.read = read === 'true'
  }

  // Get reading list with blogs (Exercises 13.20, 13.21)
  const readings = await Blog.findAll({
    include: [
      {
        model: ReadingList,
        as: 'readinglists',
        where: {
          userId: userId,
          ...readingListWhere
        },
        required: true,
        attributes: ['id', 'read']
      }
    ],
    attributes: ['id', 'url', 'title', 'author', 'likes', 'year']
  })

  // Format response according to exercise requirements (Exercise 13.21)
  const formattedReadings = readings.map(blog => {
    const blogData = blog.toJSON()
    // The readinglists array should contain exactly one object
    return {
      id: blogData.id,
      url: blogData.url,
      title: blogData.title,
      author: blogData.author,
      likes: blogData.likes,
      year: blogData.year,
      readinglists: blogData.readinglists.map(rl => ({
        read: rl.read,
        id: rl.id
      }))
    }
  })

  const userResponse = {
    name: user.name,
    username: user.username,
    readings: formattedReadings
  }

  response.json(userResponse)
}))

module.exports = usersRouter

