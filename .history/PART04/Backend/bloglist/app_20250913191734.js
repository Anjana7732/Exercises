const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')

const app = express()

mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err))

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app
