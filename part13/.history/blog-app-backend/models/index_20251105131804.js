const Blog = require('./blog')
const User = require('./user')

// Set up associations
Blog.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasMany(Blog, { foreignKey: 'userId', as: 'blogs' })

module.exports = {
  Blog,
  User
}

