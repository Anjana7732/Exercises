const dummy = (blogs) => 1

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    return blogs.reduce((prev, curr) =>
    curr.likes > prev.likes ? curr : prev
    )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = {}
  blogs.forEach((blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  const topAuthor = Object.keys(counts).reduce((a, b) =>
    counts[a] > counts[b] ? a : b
  )

  return {
    author: topAuthor,
    blogs: counts[topAuthor],
  }
}



module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
}