const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    { title: 'First blog', author: 'John', url: 'http://example.com', likes: 5},
    { title: 'Second blog', author: 'Jane', url: 'http://example2.com', likes: 10},

]

test('blogs are reurned as json and correct amount', async () => {
    const response = await api.
})