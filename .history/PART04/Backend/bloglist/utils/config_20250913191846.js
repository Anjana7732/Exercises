require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI || 'y

module.exports = {
  MONGODB_URI
}
