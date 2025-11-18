const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const authorsRouter = require('./controllers/authors')
const readinglistsRouter = require('./controllers/readinglists')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const sequelize = require('./utils/db')
const Blog = require('./models/blog')
const User = require('./models/user')
const ReadingList = require('./models/readinglist')
const Session = require('./models/session')

Blog.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasMany(Blog, { foreignKey: 'userId', as: 'blogs' })

// ReadingList relationships
ReadingList.belongsTo(User, { foreignKey: 'userId', as: 'user' })
ReadingList.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' })
User.belongsToMany(Blog, { through: ReadingList, foreignKey: 'userId', otherKey: 'blogId', as: 'readings' })
Blog.hasMany(ReadingList, { foreignKey: 'blogId', as: 'readinglists' })

// Session relationships (Exercise 13.24)
Session.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasMany(Session, { foreignKey: 'userId', as: 'sessions' })

sequelize.authenticate()
  .then(() => {
    logger.info('Connected to PostgreSQL')
    // Migrations are run separately via npm run migrate
    // No need for sequelize.sync() anymore
  })
  .catch(error => {
    logger.error('Error connecting to PostgreSQL:')
    logger.error('Message:', error.message)
    if (error.original) {
      logger.error('Original error:', error.original.message)
    }
    logger.error('Full error:', error)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor) 
app.use(middleware.userExtractor) 

// Root route
app.get('/', (request, response) => {
  response.json({
    message: 'Blog App API',
    endpoints: {
      blogs: '/api/blogs',
      users: '/api/users',
      login: '/api/login',
      logout: '/api/logout',
      authors: '/api/authors',
      readinglists: '/api/readinglists'
    }
  })
})

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readinglistsRouter) 

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
