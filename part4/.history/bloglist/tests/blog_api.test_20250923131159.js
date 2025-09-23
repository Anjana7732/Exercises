// tests/blog_api.test.js
require('dotenv').config({ path: '.env.test' })  // load test DB env first
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

// Initial blogs for testing
const initialBlogs = [
  { title: 'First blog', author: 'John', url: 'http://example.com', likes: 5 },
  { title: 'Second blog', author: 'Jane', url: 'http://example2.com', likes: 10 },
]

// Reset database before each test
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

// 4.8: GET blogs as JSON
test('blogs are returned as JSON and correct amount', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body).toHaveLength(initialBlogs.length)
}, 10000)

// 4.9: id property exists
test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  expect(blog.id).toBeDefined()
})

// 4.10: POST creates a new blog
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Someone',
    url: 'http://newblog.com',
    likes: 7,
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain('New blog')
})

// 4.11: POST missing likes defaults to 0
test('blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'No likes blog',
    author: 'Anon',
    url: 'http://nolikes.com'
  }

  const response = await api.post('/api/blogs').send(newBlog)
  expect(response.body.likes).toBe(0)
})

// 4.12: POST missing title or url returns 400
test('blog without title returns 400', async () => {
  const newBlog = { author: 'No title', url: 'http://notitle.com', likes: 1 }
  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('blog without url returns 400', async () => {
  const newBlog = { title: 'No url', author: 'Anon', likes: 1 }
  await api.post('/api/blogs').send(newBlog).expect(400)
})

// Close DB connection after all tests
afterAll(async () => {
  await mongoose.connection.close()
})


describe('deleting a blog', () => {
    test('succeeds with status 204 if id is valid', async () => {
        const blogsAtStart = await Blog.find({})
        const blogToDelete = blogsAtStart[0]

        await api.delete('/api/blogs/${blogToDelete.id}').expect(204)

        const blogsAtEnd = await Blog.find({})
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

        const ids = blogsAtEnd.map(b => b.id)
        expect(ids).not.toCon
    })
})