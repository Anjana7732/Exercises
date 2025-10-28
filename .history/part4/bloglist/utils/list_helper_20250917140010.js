const dummy = (blogs) => 1

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.like)
}
module.exports = {
    dummy,
}