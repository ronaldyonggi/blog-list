const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Get all the blogs
blogsRouter.get('/', (request, response) => {
  Blog.find({})
    .then(blogs => response.json(blogs))
})

// Create a blog
blogsRouter.post('', (request, response) => {
  const newBlog = new Blog(request.body)

  newBlog.save()
    .then(result => response.status(201).json(result))
})

module.exports = blogsRouter