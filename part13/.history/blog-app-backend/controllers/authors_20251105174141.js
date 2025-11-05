const authorsRouter = require('express').Router()
const Blog = require('../models/blog')
const { asyncHandler } = require('../utils/middleware')
const sequelize = require('../utils/db')
const { Op } = require('sequelize')

// Exercise 13.16: GET author statistics - count of blogs and total likes per author
authorsRouter.get('/', asyncHandler(async (request, response) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    group: ['author'],
    // Bonus: Order by likes in descending order
    order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']],
    raw: true
  })
  
  // Format the response to match the expected structure
  const formattedAuthors = authors.map(author => ({
    author: author.author,
    articles: author.articles.toString(),
    likes: (author.likes || 0).toString()
  }))
  
  response.json(formattedAuthors)
}))

module.exports = authorsRouter

