const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
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
    // Sync models with database
    return sequelize.sync()
  })
  .then(() => logger.info('Database models synchronized'))
  .catch(error => logger.error('Error connecting to PostgreSQL:', error.message))

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
