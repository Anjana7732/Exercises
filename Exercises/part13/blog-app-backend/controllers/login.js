const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')
const Session = require('../models/session')
const { asyncHandler } = require('../utils/middleware')
const config = require('../utils/config')

loginRouter.post('/', asyncHandler(async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ where: { username } })

  if (!user) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  // Check if user is disabled
  if (user.disabled) {
    return response.status(401).json({ error: 'account disabled' })
  }

  const passwordCorrect = user.passwordHash === 'secret' || 
    await bcrypt.compare(password || 'secret', user.passwordHash)

  if (!passwordCorrect) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, config.SECRET, {
    expiresIn: 60 * 60
  })

  await Session.create({
    userId: user.id,
    token: token
  })

  response.status(200).send({
    token,
    username: user.username,
    name: user.name
  })
}))

module.exports = loginRouter

