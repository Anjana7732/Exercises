const { test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0,
        },
    ]

    const blogs = [
        { title: 'Blog A', author: 'Author1', likes: 7 },
        { title: 'Blog B', author: 'Author2', likes: 3 },
        { title: 'Blog C', author: 'Author1', likes: 7 },                
    ]

    test('wwhen list has only one blog, equals the likes of that',() => {
    const result = listHelper.totallikes(listWithOneBlog)
    assert.strictEqual(result, 5)
})

test('of a ')
})

