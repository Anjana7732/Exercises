const authorsRouter = require('express').Router()
const Blog = require('../models/blog')
const { asyncHandler } = require('../utils/middleware')
const sequelize = require('../utils/db')


authorsRouter.get('/', asyncHandler(async (request, response) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.literal('COALESCE(SUM(likes), 0)'), 'likes']
    ],
    group: ['author'],
    
    order: [[sequelize.literal('COALESCE(SUM(likes), 0)'), 'DESC']],
    raw: true
  })
  
  // Format the response to match the expected structure
  const formattedAuthors = authors
    .filter(author => author.author) // Filter out null authors
    .map(author => ({
      author: author.author,
      articles: author.articles.toString(),
      likes: author.likes.toString()
    }))
  
  response.json(formattedAuthors)
}))

module.exports = authorsRouter

