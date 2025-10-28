// Dummy function
export const dummy = (blogs) => 1

// Total likes
export const totalLikes = (blogs) =>
  blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)

// Favorite blog
export const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  const fav = blogs.reduce((max, blog) => (blog.likes > (max.likes || 0) ? blog : max), {})
  return { title: fav.title, author: fav.author, likes: fav.likes }
}
