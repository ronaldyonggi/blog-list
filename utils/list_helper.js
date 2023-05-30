const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const blogsLikesReducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(blogsLikesReducer, 0)
}

module.exports = {
  dummy,
  totalLikes
}