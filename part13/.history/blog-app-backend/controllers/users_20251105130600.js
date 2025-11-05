const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { asyncHandler } = require('../utils/middleware')

// Exercise 13.8: POST /api/users - Create a new user
usersRouter.post('/', asyncHandler(async (request, response) => {
  const { name, username, password } = request.body

  // Simple password handling - can be improved later
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password || 'secret', saltRounds)

  const user = await User.create({
    name,
    username,
    passwordHash
  })

  // Exclude password hash from response
  const userResponse = user.toJSON()
  delete userResponse.passwordHash

  response.status(201).json(userResponse)
}))

// Exercise 13.8: GET /api/users - List all users
usersRouter.get('/', asyncHandler(async (request, response) => {
  const Blog = require('../models/blog')
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] }, // Don't return password hash
    include: {
      model: Blog,
      as: 'blogs' // Exercise 13.12: Include blogs
    }
  })
  response.json(users)
}))

// Exercise 13.8: PUT /api/users/:username - Update username
usersRouter.put('/:username', asyncHandler(async (request, response) => {
  const { username: newUsername } = request.body
  const oldUsername = request.params.username

  const user = await User.findOne({ where: { username: oldUsername } })

  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }

  user.username = newUsername
  const updatedUser = await user.save()

  // Exclude password hash from response
  const userResponse = updatedUser.toJSON()
  delete userResponse.passwordHash

  response.json(userResponse)
}))

module.exports = usersRouter

