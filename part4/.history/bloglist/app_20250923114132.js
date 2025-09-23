const express = require('express')
// const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')


// const mongoUrl = 'mongodb://localhost/bloglist'
// mongoose.connect(mongoUrl)

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
