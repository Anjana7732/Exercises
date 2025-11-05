const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const sequelize = require('./utils/db')

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
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
