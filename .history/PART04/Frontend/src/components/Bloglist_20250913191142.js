import React from 'react'
import { totalLikes, favoriteBlog } from '../utils/list_helper'

const BlogList = ({ blogs }) => {
  const total = totalLikes(blogs)
  const favorite = favoriteBlog(blogs)

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">All Blogs</h2>
      <ul className="mb-4">
        {blogs.map(blog => (
          <li key={blog._id} className="border p-2 mb-2 rounded shadow">
            <strong>{blog.title}</strong> by {blog.author} — {blog.likes} likes
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Total Likes: {total}</h2>

      {favorite && (
        <div className="p-2 border rounded shadow mt-4 bg-yellow-100">
          <h2 className="text-lg font-semibold">Favorite Blog</h2>
          <p>
            <strong>{favorite.title}</strong> by {favorite.author} — {favorite.likes} likes
          </p>
        </div>
      )}
    </div>
  )
}

export default BlogList
