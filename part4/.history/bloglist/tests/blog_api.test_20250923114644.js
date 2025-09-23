const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    { title: 'First blog', author: 'John', url: 'http://example.com, likes: 5'},
    { title: 'Firs blog', author: 'John', url: 'http://example.com, likes: 5'},

]