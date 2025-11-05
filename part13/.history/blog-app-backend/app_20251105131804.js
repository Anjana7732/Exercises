const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const sequelize = require('./utils/db')

// Load models and set up associations
require('./models/index')

// Connect to PostgreSQL
sequelize.authenticate()
  .then(() => {
    logger.info('Connected to PostgreSQL')
    // Sync models with database - use alter: true to add missing columns
    return sequelize.sync({ alter: true })
  })
  .then(async () => {
    logger.info('Database models synchronized')
    
    // Handle existing blogs without userId (if any)
    const { Blog } = require('./models/index')
    const blogsWithoutUser = await Blog.findAll({ where: { userId: null } })
    if (blogsWithoutUser.length > 0) {
      logger.warn(`Found ${blogsWithoutUser.length} blogs without userId. They will be deleted.`)
      // Delete blogs without userId as they can't be used with the new schema
      await Blog.destroy({ where: { userId: null } })
      logger.info('Cleaned up blogs without userId')
    }
  })
  .catch(error => {
    logger.error('Error connecting to PostgreSQL:', error.message)
    logger.error(error)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor) // Extract token from Authorization header
app.use(middleware.userExtractor) // Attach user to request if token is valid

// Routes
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
