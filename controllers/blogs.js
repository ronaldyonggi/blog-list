const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// Retrieve token from request
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }

  return null
}

// Get all the blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.
    find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// Create a blog
blogsRouter.post('', async (request, response) => {
  const body = request.body
  const { title, author, url, likes } = body
  const user = await User.findById(body.userId)

  // const newBlog = await (new Blog(request.body)).save()
  const newBlog = new Blog({
    title, author, url, likes, user: user.id
  })

  const savedBlog = await newBlog.save()

  // Add the user's blogs
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)
})

// Delete a blog
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// Update a blog
blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true, runValidators: true, context: 'query' }
  )
  response.json(updatedBlog)
})

module.exports = blogsRouter