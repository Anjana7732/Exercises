const { test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: 
        }
    ]
})

test('wwhen list has only one blog, equals the likes of that',() => {
    const result = listHelper.totallikes(listWithOneBlog)
    assert.strictEqual(result, 5)
})

test('of a ')