const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const sequelize = require('./utils/db')
const Blog = require('./models/blog')
const User = require('./models/user')

// Exercise 13.12: Set up associations between Blog and User
Blog.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasMany(Blog, { foreignKey: 'userId', as: 'blogs' })

// Connect to PostgreSQL
sequelize.authenticate()
  .then(() => {
    logger.info('Connected to PostgreSQL')
    // Sync models with database - use alter: true to add missing columns
    return sequelize.sync({ alter: true })
  })
  .then(async () => {
    logger.info('Database models synchronized')
    
    // Handle migration: if blogs table exists without userId column, we need to handle it
    // Check if there are any blogs without userId and clean them up
    try {
      const blogsWithoutUser = await Blog.findAll({ 
        where: { userId: null },
        limit: 1 
      })
      if (blogsWithoutUser.length > 0) {
        logger.warn('Found blogs without userId. Cleaning up...')
        await Blog.destroy({ where: { userId: null } })
        logger.info('Cleaned up blogs without userId')
      }
    } catch (error) {
      if (!error.message.includes('column') && !error.message.includes('does not exist')) {
        logger.error('Error checking for blogs without userId:', error.message)
      }
    }
  })
  .catch(error => {
    logger.error('Error connecting to PostgreSQL:')
    logger.error('Message:', error.message)
    if (error.original) {
      logger.error('Original error:', error.original.message)
    }
    logger.error('Full error:', error)
    // Don't exit - let the app start and show the error
  })

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor) // Extract token from Authorization header
app.use(middleware.userExtractor) // Attach user to request if token is valid

// Routes
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter) // Exercise 13.16: Author statistics route

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
