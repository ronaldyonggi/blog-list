const _ = require('lodash/fp')

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

const mostBlogs = (blogs) => {
  const { flow, countBy, toPairs, maxBy, last, zipObject } = _

  const mostBlogs = flow(
    countBy('author'), // Group blogs by author
    toPairs, // Convert to array of [author, quantity] pairs
    maxBy(last), // Retrieve the entry with the most blogs
    zipObject(['author', 'blogs']) // Convert to an object of {author:..., blogs: ...}
  )

  return mostBlogs(blogs)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}