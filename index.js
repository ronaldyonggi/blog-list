require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3001

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)


const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)
  .then(() => console.log('connected to DB!'))
  .catch(error => console.log('error connecting DB:', error.message))

app.use(cors())
app.use(express.json())

// Get all the blogs
app.get('/api/blogs', (request, response) => {
  Blog.find({})
    .then(blogs => response.json(blogs))
})

// Create a blog
app.post('/api/blogs', (request, response) => {
  const newBlog = new Blog(request.body)

  newBlog.save()
    .then(result => response.status(201).json(result))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

