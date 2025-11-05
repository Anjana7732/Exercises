require('dotenv').config()

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-app',
  PORT: process.env.PORT || 3001
}

