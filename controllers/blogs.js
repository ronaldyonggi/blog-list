const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Get all the blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// Create a blog
blogsRouter.post('', async (request, response) => {
  const newBlog = await (new Blog(request.body)).save()
  response.status(201).json(newBlog)

  // newBlog.save()
    // .then(result => response.status(201).json(result))
})

module.exports = blogsRouter