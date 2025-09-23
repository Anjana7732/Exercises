require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require("./controllers/users")
const app = express()

const mongoUrl = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err.message))
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
