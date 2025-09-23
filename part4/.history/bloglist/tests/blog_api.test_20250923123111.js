// tests/blog_api.test.js
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

// Initial blogs to populate test DB
const initialBlogs = [
  { title: 'First blog', author: 'John', url: 'http://example.com', likes: 5 },
  { title: 'Second blog', author: 'Jane', url: 'http://example2.com', likes: 10 },
]

// Run before each test: clear DB and insert initial blogs
beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

// Test: blogs are returned as JSON and correct amount
test('blogs are returned as json and correct amount', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(initialBlogs.length)
})

// Test: adding a new blog works
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Alice',
    url: 'http://example3.com',
    likes: 7,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain('New blog')
})

// Close DB connection after all tests
afterAll(async () => {
  await mongoose.connection.close()
})
