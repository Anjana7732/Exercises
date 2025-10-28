const dummy = (blogs) => 1

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const 
module.exports = {
    dummy,
    totalLikes,
}