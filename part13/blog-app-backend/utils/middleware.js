const jwt = require('jsonwebtoken')
const logger = require('./logger')
const config = require('./config')
const User = require('../models/user')
const Session = require('../models/session')

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const userExtractor = async (request, response, next) => {
  if (request.token) {
    try {
      // Verify JWT token
      const decodedToken = jwt.verify(request.token, config.SECRET)
      
      // Check if session exists in database (server-side session validation)
      const session = await Session.findOne({
        where: { token: request.token }
      })

      if (!session) {
        // Token is valid but session doesn't exist (e.g., user logged out)
        request.user = null
        return next()
      }

      // Get user from session
      const user = await User.findByPk(decodedToken.id)

      if (!user) {
        request.user = null
        return next()
      }

      // Check if user is disabled
      if (user.disabled) {
        request.user = null
        return next()
      }

      request.user = user
    } catch (error) {
      // Token is invalid or expired
      request.user = null
    }
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeValidationError') {
    // Return the actual validation error messages for better user feedback
    const errors = error.errors.map(e => e.message || `${e.type} ${e.path} failed`)
    return response.status(400).json({ error: errors.length === 1 ? errors[0] : errors })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ error: 'unique constraint violation' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

module.exports = {
  asyncHandler,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}
