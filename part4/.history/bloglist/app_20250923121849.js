const express = require('express')
// const mongoose = require('mongoose')
const app = express()
const blogsRouter = require('./controllers/blogs')


const mongoUrl = PR
mongoose.connect(mongoUrl)

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
