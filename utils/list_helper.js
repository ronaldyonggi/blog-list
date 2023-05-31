const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const blogsLikesReducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(blogsLikesReducer, 0)
}

const favoriteBlog = (blogs) => {
  const blogsMostLikesReducer = (prev, next) => {
    return prev.likes > next.likes ? prev : next
  }

  return blogs.reduce(blogsMostLikesReducer)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}