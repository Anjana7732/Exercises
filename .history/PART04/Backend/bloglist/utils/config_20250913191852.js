require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI || mongodb+srv://phonebookUser:Test123@cluster0.dapeenn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

module.exports = {
  MONGODB_URI
}
