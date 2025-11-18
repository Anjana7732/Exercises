const logoutRouter = require('express').Router()
const Session = require('../models/session')
const { asyncHandler } = require('../utils/middleware')

logoutRouter.delete('/', asyncHandler(async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  if (!request.user || !request.user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // Delete the session from database
  const deleted = await Session.destroy({
    where: { token: request.token }
  })

  if (deleted === 0) {
    return response.status(404).json({ error: 'session not found' })
  }

  response.status(204).end()
}))

module.exports = logoutRouter

