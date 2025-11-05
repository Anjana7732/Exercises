const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String
  },
  url: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
})

// Auto-increment id before saving
blogSchema.pre('save', async function(next) {
  if (this.isNew && !this.id) {
    // Find the maximum id and add 1
    const maxBlog = await mongoose.model('Blog').findOne().sort('-id').exec()
    this.id = maxBlog && maxBlog.id ? maxBlog.id + 1 : 1
  }
  next()
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Use numeric id, remove MongoDB's _id
    returnedObject.id = returnedObject.id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
