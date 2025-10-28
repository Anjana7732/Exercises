const { test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('when list has only one blog, equals the likes of that', () => {
  const listWithOneBlog = [
    { title: 'Go To Statement Considered Harmful', author: 'Dijkstra', likes: 5 },
  ]
  const result = listHelper.totalLikes(listWithOneBlog)
  assert.strictEqual(result, 5)
})

test('of a bigger list is calculated right', () => {
  const blogs = [
    { title: 'Blog A', author: 'Author1', likes: 7 },
    { title: 'Blog B', author: 'Author2', likes: 3 },
    { title: 'Blog C', author: 'Author1', likes: 12 },
  ]
  const result = listHelper.totalLikes(blogs)
  assert.strictEqual(result, 22)
})

test('of empty list is zero', () => {
  const result = listHelper.totalLikes([])
  assert.strictEqual(result, 0)
})
