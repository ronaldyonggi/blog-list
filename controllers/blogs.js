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
})

// Delete a blog
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter