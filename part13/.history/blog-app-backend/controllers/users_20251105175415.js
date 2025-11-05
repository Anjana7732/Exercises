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

module.exports = usersRouter

